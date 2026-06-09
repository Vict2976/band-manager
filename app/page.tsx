'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '../lib/AppShell';
import Markdown from '../lib/Markdown';
import RichTextEditor from '../lib/RichTextEditor';
import {
  BandEvent,
  EventType,
  NewEvent,
  subscribeToEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../lib/eventService';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// gig = magenta, rehearsal = periwinkle
const TYPE_COLOR: Record<EventType, string> = {
  gig: 'var(--latina)',
  rehearsal: 'var(--primary)',
};

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
                    </div>
                    {e.text.trim() ? (
                      <div className="text-sm leading-relaxed">
                        <Markdown>{e.text}</Markdown>
                      </div>
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

function Legend() {
  return (
    <div className="flex items-center justify-center gap-5 mt-4 text-xs font-medium text-[var(--muted)]">
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--latina)' }} /> Gig</span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)' }} /> Rehearsal</span>
    </div>
  );
}

function EventModal({
  date,
  event,
  onClose,
}: {
  date: string;
  event: BandEvent | null;
  onClose: () => void;
}) {
  const [type, setType] = useState<EventType>(event?.type ?? 'rehearsal');
  const [eventDate, setEventDate] = useState(event?.date ?? date);
  const [time, setTime] = useState(event?.time ?? '');
  const [text, setText] = useState(event?.text ?? '');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const payload: NewEvent = { type, date: eventDate, time, text };
    try {
      if (event) await updateEvent(event.id, payload);
      else await createEvent(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!event || !confirm('Delete this event?')) return;
    setBusy(true);
    try {
      await deleteEvent(event.id);
      onClose();
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--ink)]/30 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold">{event ? 'Edit event' : 'New event'}</h3>

        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-2">
          {(['rehearsal', 'gig'] as EventType[]).map((t) => {
            const sel = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className="py-2.5 rounded-xl text-sm font-bold capitalize border-2 transition-all"
                style={
                  sel
                    ? { background: TYPE_COLOR[t], borderColor: TYPE_COLOR[t], color: '#fff' }
                    : { borderColor: 'var(--hairline)', color: 'var(--muted)' }
                }
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Date</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="field mt-1 w-full px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-[var(--muted)]">Time (optional)</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="field mt-1 w-full px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <div>
          <span className="text-xs font-medium text-[var(--muted)]">Details</span>
          <div className="mt-1">
            <RichTextEditor
              value={text}
              onChange={setText}
              autoFocus={!event}
              minHeight="7rem"
              placeholder="What's happening? e.g. **Gig at Loppen**, load-in 18:00, bring the small PA…"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          {event && (
            <button
              onClick={remove}
              disabled={busy}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--latina)] hover:bg-[var(--latina)]/10 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose} disabled={busy} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={busy || !text.trim()}
            className="btn-grad px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
