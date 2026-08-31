import { NextRequest } from 'next/server';
import { adminDb } from '../../../../lib/firebaseAdmin';
import { buildCalendar, IcsEvent } from '../../../../lib/ics';
import { resolveTitle, normalizeDate, isDateKey } from '../../../../lib/eventText';

// The feed reflects Firestore at request time; nothing here may be cached
// at build time or Next would serve a frozen calendar forever.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Constant-time compare so the token can't be recovered by timing the endpoint. */
function tokensMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  // Subscribing clients often append .ics to the URL.
  const supplied = token.replace(/\.ics$/i, '');

  let db;
  try {
    db = adminDb();
  } catch (err) {
    console.error('Calendar feed: admin credentials unavailable', err);
    return new Response('Calendar feed is not configured on the server.', { status: 503 });
  }

  const configSnap = await db.doc('config/calendarFeed').get();
  const expected = configSnap.exists ? (configSnap.data()?.token as string | undefined) : undefined;

  if (!expected || !tokensMatch(supplied, expected)) {
    // Same response for "no feed yet" and "wrong token" — don't confirm which.
    return new Response('Not found', { status: 404 });
  }

  const snap = await db.collection('events').orderBy('date', 'asc').get();
  const events: IcsEvent[] = snap.docs.map((d) => {
    const data = d.data();
    const updatedAt = data.updatedAt?.toDate?.();
    return {
      id: d.id,
      type: data.type === 'gig' ? 'gig' : 'rehearsal',
      // Pre-status events read as confirmed, matching the app.
      status: data.status === 'pending' ? 'pending' : 'confirmed',
      title: resolveTitle(data.title, data.text || '', data.type),
      date: normalizeDate(data.date),
      time: data.time || undefined,
      text: data.text || '',
      updatedAt: updatedAt instanceof Date ? updatedAt : undefined,
    };
  });

  // A malformed date would produce an invalid DTSTART, and some calendar
  // clients reject the entire feed over one bad entry rather than skipping it.
  const usable = events.filter((e) => {
    if (isDateKey(e.date)) return true;
    console.warn(`Calendar feed: skipping event ${e.id} with unusable date`);
    return false;
  });

  const ics = buildCalendar(usable, {
    name: 'Band Manager',
    domain: req.nextUrl.hostname || 'band-manager',
    refreshMinutes: 15,
  });

  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="band-manager.ics"',
      // Let a CDN hold it briefly so a hammering client doesn't hit Firestore
      // on every poll, while keeping the feed near-live.
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
