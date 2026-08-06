'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '../../../lib/AppShell';
import Markdown from '../../../lib/Markdown';
import EventModal, { TYPE_COLOR } from '../../../lib/EventModal';
import { BandEvent, subscribeToEvent } from '../../../lib/eventService';

function formatFullDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// @uxid app/events/[id]/page::EventPage
export default function EventPage() {
  return (
    <AppShell>
      <EventDetail />
    </AppShell>
  );
}

// @uxid app/events/[id]/page::EventDetail
function EventDetail() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  // undefined = loading, null = not found
  const [event, setEvent] = useState<BandEvent | null | undefined>(undefined);
  const [editing, setEditing] = useState(false);

  useEffect(() => subscribeToEvent(id, setEvent), [id]);

  if (event === undefined) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-9 h-9 border-[3px] border-[var(--primary-100)] border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (event === null) {
    return (
      <div className="text-center py-24">
        <p className="text-[var(--muted)]">This event no longer exists.</p>
        <Link href="/" className="mt-3 inline-block text-sm font-bold text-[var(--primary)] hover:underline">
          ← Back to calendar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-up">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
      >
        <span className="text-base leading-none">‹</span> Calendar
      </Link>

      <article className="card overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: TYPE_COLOR[event.type] }} />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{ color: TYPE_COLOR[event.type], background: `color-mix(in srgb, ${TYPE_COLOR[event.type]} 12%, white)` }}
              >
                {event.type}
              </span>
              <h1 className="text-2xl font-bold mt-3 tracking-tight">{formatFullDate(event.date)}</h1>
              {event.time && <p className="text-[var(--muted)] font-semibold mt-0.5">{event.time}</p>}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="btn-soft shrink-0 text-sm font-semibold px-5 py-2 rounded-full"
            >
              Edit
            </button>
          </div>

          <hr className="my-6 border-[var(--hairline)]" />

          {event.text.trim() ? (
            <Markdown>{event.text}</Markdown>
          ) : (
            <p className="text-[var(--faint)] italic">No details yet.</p>
          )}
        </div>
      </article>

      {editing && (
        <EventModal
          date={event.date}
          event={event}
          initialMode="edit"
          onClose={() => setEditing(false)}
          onDeleted={() => router.push('/')}
        />
      )}
    </div>
  );
}
