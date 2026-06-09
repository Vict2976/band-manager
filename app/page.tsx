'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import AppShell from '../lib/AppShell';
import Markdown from '../lib/Markdown';
import EventModal, { TYPE_COLOR } from '../lib/EventModal';
import { BandEvent, subscribeToEvents } from '../lib/eventService';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// --- date helpers (local, no deps) ---
const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => toKey(new Date());

function buildMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(year, month, 1 - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatLongDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function CalendarPage() {
  return (
    <AppShell>
      <Calendar />
    </AppShell>
  );
}

function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string>(todayKey());
  const [events, setEvents] = useState<BandEvent[]>([]);
  const [editing, setEditing] = useState<BandEvent | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => subscribeToEvents(setEvents), []);

  const byDate = useMemo(() => {
    const map = new Map<string, BandEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const grid = useMemo(() => buildMonthGrid(year, month), [year, month]);
  const selectedEvents = byDate.get(selected) || [];

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const goToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelected(todayKey());
  };

  return (
    <div className="space-y-5">
      {/* Calendar card */}
      <section className="card p-4 sm:p-5 animate-slide-up">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            {MONTHS[month]} <span className="text-[var(--faint)] font-semibold">{year}</span>
          </h1>
          <div className="flex items-center gap-1.5">
            <button onClick={goToday} className="btn-soft text-xs font-semibold px-3 py-2 rounded-full">
              Today
            </button>
            <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="w-9 h-9 grid place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors">‹</button>
            <button onClick={() => changeMonth(1)} aria-label="Next month" className="w-9 h-9 grid place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors">›</button>
          </div>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-[var(--faint)] py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d) => {
            const key = toKey(d);
            const inMonth = d.getMonth() === month;
            const isToday = key === todayKey();
            const isSelected = key === selected;
            const dayEvents = byDate.get(key) || [];
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[var(--primary-50)] ring-2 ring-[var(--primary)]'
                    : 'hover:bg-[var(--primary-50)]'
                } ${inMonth ? '' : 'opacity-40'}`}
              >
                <span
                  className={`w-7 h-7 grid place-items-center rounded-full text-[13px] font-semibold ${
                    isToday ? 'btn-grad text-white' : 'text-[var(--ink)]'
                  }`}
                >
                  {d.getDate()}
                </span>
                <span className="flex gap-1 h-1.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_COLOR[e.type] }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <Legend />
      </section>

      {/* Selected day */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="font-bold text-[var(--ink)]">{formatLongDate(selected)}</h2>
          <button
            onClick={() => setCreating(true)}
            className="btn-grad text-sm font-semibold px-4 py-2 rounded-full"
          >
            + Add event
          </button>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="card card-hover p-8 text-center">
            <p className="text-sm text-[var(--muted)]">Nothing planned this day.</p>
            <button onClick={() => setCreating(true)} className="mt-2 text-sm font-semibold text-[var(--primary)] hover:underline">
              Add a gig or rehearsal
            </button>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {selectedEvents.map((e) => (
              <li key={e.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setEditing(e)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      setEditing(e);
                    }
                  }}
                  className="card card-hover w-full text-left flex gap-3.5 p-4 overflow-hidden cursor-pointer"
                >
                  <span className="w-1.5 rounded-full shrink-0" style={{ background: TYPE_COLOR[e.type] }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ color: TYPE_COLOR[e.type], background: `color-mix(in srgb, ${TYPE_COLOR[e.type]} 12%, white)` }}
                      >
                        {e.type}
                      </span>
                      {e.time && <span className="text-xs font-medium text-[var(--muted)]">{e.time}</span>}
                      <div className="flex-1" />
                      <Link
                        href={`/events/${e.id}`}
                        onClick={(ev) => ev.stopPropagation()}
                        aria-label="Open full page"
                        title="Open full page"
                        className="shrink-0 -my-1 w-7 h-7 grid place-items-center rounded-full text-[var(--faint)] hover:text-[var(--primary)] hover:bg-[var(--primary-50)] transition-colors"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </Link>
                    </div>
                    {e.text.trim() ? (
                      <EventBody text={e.text} eventId={e.id} />
                    ) : (
                      <p className="text-sm text-[var(--faint)] italic">No details</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(creating || editing) && (
        <EventModal
          date={selected}
          event={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EventBody({ text, eventId }: { text: string; eventId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight + 4);
  }, [text]);

  return (
    <div>
      <div ref={ref} className="relative text-sm leading-relaxed max-h-72 overflow-hidden">
        <Markdown>{text}</Markdown>
        {overflows && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      {overflows && (
        <Link
          href={`/events/${eventId}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-block mt-1.5 text-xs font-bold text-[var(--primary)] hover:underline"
        >
          Show more →
        </Link>
      )}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center justify-center gap-5 mt-4 text-xs font-medium text-[var(--muted)]">
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--latina)' }} /> Gig</span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)' }} /> Rehearsal</span>
    </div>
  );
}

