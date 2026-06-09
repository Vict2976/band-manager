'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '../../lib/AppShell';
import Markdown from '../../lib/Markdown';
import { TYPE_COLOR } from '../../lib/EventModal';
import { BandEvent, subscribeToEvents } from '../../lib/eventService';

const pad = (n: number) => String(n).padStart(2, '0');
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function shortDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function daysFromToday(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date();
  const today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const ev = new Date(y, m - 1, d);
  return Math.round((ev.getTime() - today.getTime()) / 86400000);
}

function relativeLabel(key: string): string {
  const n = daysFromToday(key);
  if (n === 0) return 'Today';
  if (n === 1) return 'Tomorrow';
  if (n < 7) return `in ${n} days`;
  if (n < 14) return 'next week';
  return `in ${Math.round(n / 7)} weeks`;
}

// First meaningful line of the details, with markdown markers stripped.
function previewLine(text: string): string {
  const line = text.split('\n').map((s) => s.trim()).find(Boolean) || '';
  return line
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*+]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/[*_`>#]/g, '')
    .trim();
}

export default function UpcomingPage() {
  return (
    <AppShell>
      <Upcoming />
    </AppShell>
  );
}

function Upcoming() {
  const [events, setEvents] = useState<BandEvent[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => subscribeToEvents(setEvents), []);

  const upcoming = useMemo(() => {
    const today = todayKey();
    // subscribeToEvents already sorts by date then time
    return events.filter((e) => e.date >= today);
  }, [events]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="animate-slide-up">
      <div className="px-1 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Upcoming</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Next activities first — tap one to see details.</p>
      </div>

      {upcoming.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-[var(--muted)]">Nothing coming up.</p>
          <Link href="/" className="mt-2 inline-block text-sm font-bold text-[var(--primary)] hover:underline">
            Add something on the calendar →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {upcoming.map((e) => {
            const isOpen = open.has(e.id);
            const color = TYPE_COLOR[e.type];
            return (
              <li key={e.id} className="card overflow-hidden">
                <button
                  onClick={() => toggle(e.id)}
                  className="w-full flex items-center gap-3.5 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  {/* Date block */}
                  <div className="shrink-0 w-16 text-center">
                    <div className="text-sm font-bold leading-tight">{shortDate(e.date)}</div>
                    <div className="text-[11px] font-semibold" style={{ color }}>
                      {relativeLabel(e.date)}
                    </div>
                  </div>

                  <span className="w-px self-stretch bg-[var(--hairline)]" />

                  {/* Title / preview */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full"
                        style={{ color, background: `color-mix(in srgb, ${color} 12%, white)` }}
                      >
                        {e.type}
                      </span>
                      {e.time && <span className="text-xs font-medium text-[var(--muted)]">{e.time}</span>}
                    </div>
                    <p className="text-sm font-medium text-[var(--ink)] truncate mt-0.5">
                      {previewLine(e.text) || <span className="text-[var(--faint)] italic">No details</span>}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg
                    className="shrink-0 text-[var(--faint)] transition-transform"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 -mt-1 animate-fade-in">
                    <div className="border-t border-[var(--hairline)] pt-3">
                      {e.text.trim() ? (
                        <Markdown>{e.text}</Markdown>
                      ) : (
                        <p className="text-sm text-[var(--faint)] italic">No details.</p>
                      )}
                      <Link
                        href={`/events/${e.id}`}
                        className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-[var(--primary)] hover:underline"
                      >
                        Open full page
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
