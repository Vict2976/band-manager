'use client';

import { useState } from 'react';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';
import {
  BandEvent,
  EventType,
  NewEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from './eventService';

// gig = magenta, rehearsal = periwinkle
export const TYPE_COLOR: Record<EventType, string> = {
  gig: 'var(--latina)',
  rehearsal: 'var(--primary)',
};

export default function EventModal({
  date,
  event,
  onClose,
  onDeleted,
}: {
  date: string;
  event: BandEvent | null;
  onClose: () => void;
  onDeleted?: () => void;
}) {
  const [type, setType] = useState<EventType>(event?.type ?? 'rehearsal');
  const [eventDate, setEventDate] = useState(event?.date ?? date);
  const [time, setTime] = useState(event?.time ?? '');
  const [text, setText] = useState(event?.text ?? '');
  const [busy, setBusy] = useState(false);

  const dirty =
    type !== (event?.type ?? 'rehearsal') ||
    eventDate !== (event?.date ?? date) ||
    time !== (event?.time ?? '') ||
    text !== (event?.text ?? '');

  // Close, but warn first if there are unsaved edits.
  const requestClose = () => {
    if (dirty && !confirm('You have unsaved changes. Close and lose them?')) return;
    onClose();
  };

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
      (onDeleted ?? onClose)();
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-[var(--ink)]/30 backdrop-blur-sm sm:p-4" onClick={requestClose}>
      <div
        className="w-full h-[100dvh] sm:h-[88vh] sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl animate-pop-in flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (fixed) */}
        <div className="shrink-0 p-5 sm:p-6 pb-3 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">{event ? 'Edit event' : 'New event'}</h3>
            <div className="flex items-center gap-1">
              {event && (
                <Link
                  href={`/events/${event.id}`}
                  onClick={(e) => {
                    if (dirty && !confirm('You have unsaved changes. Leave and lose them?')) e.preventDefault();
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:bg-[var(--primary-50)] px-2.5 py-1.5 rounded-full transition-colors"
                >
                  Full page
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </Link>
              )}
              <button
                onClick={requestClose}
                aria-label="Close"
                className="w-9 h-9 -mr-1 grid place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>
          </div>

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

          <span className="block text-xs font-medium text-[var(--muted)]">Details</span>
        </div>

        {/* Editor (fills remaining height, scrolls internally) */}
        <div className="flex-1 min-h-0 px-5 sm:px-6">
          <RichTextEditor
            value={text}
            onChange={setText}
            autoFocus={!event}
            grow
            minHeight="9rem"
            placeholder="What's happening? e.g. **Gig at Loppen**, load-in 18:00, bring the small PA…"
          />
        </div>

        {/* Footer (fixed) */}
        <div className="shrink-0 flex items-center gap-2 p-5 sm:p-6 pt-3 border-t border-[var(--hairline)] mt-3">
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
          <button onClick={requestClose} disabled={busy} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors disabled:opacity-50">
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
