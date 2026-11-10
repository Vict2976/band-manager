import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '../../../lib/firebaseAdmin';
import { resolveTitle, normalizeDate } from '../../../lib/eventText';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-haiku-5.5';
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** Today's date in Copenhagen, as YYYY-MM-DD plus a readable Danish form. */
function today(): { key: string; label: string } {
  const now = new Date();
  const key = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Copenhagen' }).format(now);
  const label = new Intl.DateTimeFormat('da-DK', {
    timeZone: 'Europe/Copenhagen',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);
  return { key, label };
}

function weekday(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('da-DK', { weekday: 'long', timeZone: 'UTC' }).format(d);
}

/** Everything the band has in the app, flattened into text for the model. */
async function buildKnowledge(): Promise<string> {
  const db = adminDb();
  const [eventsSnap, gearSnap, needsSnap, standinsSnap] = await Promise.all([
    db.collection('events').orderBy('date', 'asc').get(),
    db.doc('gear/shared').get(),
    db.collection('gearNeeds').get(),
    db.doc('standins/shared').get(),
  ]);

  const { key: todayKey } = today();

  const events = eventsSnap.docs
    .map((d) => {
      const data = d.data();
      const date = normalizeDate(data.date);
      return {
        type: data.type === 'gig' ? 'Gig/koncert' : 'Øveaften/prøve',
        status: data.status === 'pending' ? 'ikke bekræftet endnu' : 'bekræftet',
        title: resolveTitle(data.title, data.text || '', data.type),
        date,
        time: (data.time as string) || '',
        text: ((data.text as string) || '').trim(),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const fmtEvent = (e: (typeof events)[number]) =>
    [
      `### ${e.date} (${weekday(e.date)})${e.time ? ` kl. ${e.time}` : ''} — ${e.title}`,
      `Type: ${e.type} · Status: ${e.status}`,
      e.text ? `Detaljer:\n${e.text}` : '',
    ]
      .filter(Boolean)
      .join('\n');

  const upcoming = events.filter((e) => e.date >= todayKey);
  const past = events.filter((e) => e.date < todayKey);

  const needs = needsSnap.docs
    .map((d) => ({ name: d.id, text: ((d.data().text as string) || '').trim() }))
    .filter((n) => n.text);

  const gear = ((gearSnap.data()?.text as string) || '').trim();
  const standins = ((standinsSnap.data()?.text as string) || '').trim();

  return [
    `## Kommende begivenheder (${upcoming.length})`,
    upcoming.length ? upcoming.map(fmtEvent).join('\n\n') : '(ingen)',
    `## Tidligere begivenheder (${past.length})`,
    past.length ? past.map(fmtEvent).join('\n\n') : '(ingen)',
    `## Udstyr bandet har (fælles liste)`,
    gear || '(tom)',
    `## Hvad hvert medlem mangler / har brug for`,
    needs.length ? needs.map((n) => `### ${n.name}\n${n.text}`).join('\n\n') : '(ingen noter)',
    `## Stand-ins (vikarer)`,
    standins || '(tom)',
  ].join('\n\n');
}

function systemPrompt(knowledge: string): string {
  const { key, label } = today();
  return `Du er bandets hjælpsomme assistent i appen "Band Manager". Du svarer ALTID på dansk, kort og venligt.

I dag er ${label} (${key}).

Svar på spørgsmål om bandet, udstyr, kommende gigs, øveaftener, stand-ins osv. ud fra dataene nedenfor, som er hentet direkte fra appen lige nu. Regler:
- Brug kun oplysningerne nedenfor til fakta om bandet. Find ikke på datoer, steder, udstyr eller personer.
- Hvis svaret ikke står i dataene, så sig det ærligt og foreslå hvor i appen man kan tilføje det (Kalender, Kommende, Gear eller Stand-ins).
- Nævn hvis en begivenhed ikke er bekræftet endnu.
- Skriv datoer på dansk (fx "lørdag d. 14. december"). Brug gerne korte punktlister.
- Du kan også hjælpe med generelle spørgsmål om musik, udstyr og øvning, men gør det klart, når noget ikke kommer fra bandets egne data.
- Du kan ikke ændre noget i appen — kun læse og svare.

# Bandets data
${knowledge}`;
}

function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m): m is ChatMessage =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  return msgs;
}

export async function POST(req: NextRequest) {
  // Only signed-in band members: verify their Firebase ID token.
  const header = req.headers.get('authorization') || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!idToken) return new Response('Unauthorized', { status: 401 });
  try {
    await adminAuth().verifyIdToken(idToken);
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return new Response('Chatten er ikke sat op på serveren.', { status: 503 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  const messages = sanitize((body as { messages?: unknown })?.messages);
  if (!messages) return new Response('Bad request', { status: 400 });

  let knowledge: string;
  try {
    knowledge = await buildKnowledge();
  } catch (err) {
    console.error('Chat: could not load band data', err);
    return new Response('Kunne ikke hente bandets data.', { status: 500 });
  }

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Band Manager',
    },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      max_tokens: 1200,
      messages: [{ role: 'system', content: systemPrompt(knowledge) }, ...messages],
    }),
    signal: req.signal,
  });

  if (!upstream.ok || !upstream.body) {
    console.error('Chat: OpenRouter error', upstream.status, await upstream.text().catch(() => ''));
    return new Response('AI-tjenesten svarede ikke. Prøv igen om lidt.', { status: 502 });
  }

  // Turn OpenRouter's SSE stream into a plain text stream of answer tokens.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        let emitted = false;
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue; // skips ": OPENROUTER PROCESSING" keep-alives
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            controller.close();
            return;
          }
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
              emitted = true;
            }
          } catch {
            // ignore malformed chunk
          }
        }
        if (emitted) return;
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
