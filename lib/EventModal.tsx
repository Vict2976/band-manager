'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Markdown from './Markdown';
import RichTextEditor from './RichTextEditor';
import {
  BandEvent,
  EventType,
  EventStatus,
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

export const STATUS_META: Record<EventStatus, { label: string; short: string; color: string }> = {
  confirmed: { label: 'Confirmed', short: 'Confirmed', color: 'var(--confirmed)' },
  pending: { label: 'Being figured out', short: 'Figuring out', color: 'var(--pending)' },
};

/** Status pill — a filled dot for confirmed, a hollow ring while it's unsettled. */
export function StatusBadge({ status, compact }: { status: EventStatus; compact?: boolean }) {
  const meta = STATUS_META[status];
  const done = status === 'confirmed';
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wide rounded-full ${
        compact ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'
      }`}
      style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 12%, white)` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={done ? { background: meta.color } : { border: `1.5px solid ${meta.color}` }}
      />
      {compact ? meta.short : meta.label}
    </span>
  );
}

function formatLongDate(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function EventModal({
  date,
  event,
  onClose,
  onDeleted,
  initialMode,
}: {
  date: string;
  event: BandEvent | null;
  onClose: () => void;
  onDeleted?: () => void;
  /** Force a starting mode. Defaults to 'view' for existing events, 'edit' for new. */
  initialMode?: 'view' | 'edit';
}) {
  const openedInEdit = initialMode === 'edit' || !event;
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode ?? (event ? 'view' : 'edit'));
  const [type, setType] = useState<EventType>(event?.type ?? 'rehearsal');
  // Something you've just jotted down isn't settled yet, so new events start as pending.
  const [status, setStatus] = useState<EventStatus>(event?.status ?? 'pending');
  const [title, setTitle] = useState(event?.title ?? '');
  const [eventDate, setEventDate] = useState(event?.date ?? date);
  const [time, setTime] = useState(event?.time ?? '');
  const [text, setText] = useState(event?.text ?? '');
  const [busy, setBusy] = useState(false);

  const baseType = event?.type ?? 'rehearsal';
  const baseStatus: EventStatus = event?.status ?? 'pending';
  const baseTitle = event?.title ?? '';
  const baseDate = event?.date ?? date;
  const baseTime = event?.time ?? '';
  const baseText = event?.text ?? '';
  const dirty =
    type !== baseType ||
    status !== baseStatus ||
    title !== baseTitle ||
    eventDate !== baseDate ||
    time !== baseTime ||
    text !== baseText;

  const resetFields = () => {
    setType(baseType);
    setStatus(baseStatus);
    setTitle(baseTitle);
    setEventDate(baseDate);
    setTime(baseTime);
    setText(baseText);
  };

  // Close the whole modal (warn if mid-edit with changes).
  const requestClose = () => {
    if (mode === 'edit' && dirty && !confirm('You have unsaved changes. Close and lose them?')) return;
    onClose();
  };

  // Cancel an edit: back to the view (or close, if we opened straight into edit).
  const cancelEdit = () => {
    if (dirty && !confirm('You have unsaved changes. Discard them?')) return;
    if (openedInEdit) {
      onClose();
    } else {
      resetFields();
      setMode('view');
    }
  };

  const save = async () => {
    setBusy(true);
    const payload: NewEvent = { type, status, title, date: eventDate, time, text };
    try {
      if (event) {
        await updateEvent(event.id, payload);
        if (openedInEdit) {
          onClose();
        } else {
          setBusy(false);
          setMode('view');
        }
      } else {
        await createEvent(payload);
        onClose();
      }
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

  const isEdit = mode === 'edit';
  const heightClass = 'h-[100dvh] sm:h-auto sm:max-h-[88vh]';

  // Portal to <body>: the page wrappers animate opacity/transform, which would
  // otherwise trap this overlay under the sticky header and bottom nav.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-[var(--ink)]/30 backdrop-blur-sm sm:p-4" onClick={requestClose}>
      <div
        className={`w-full ${heightClass} sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl animate-pop-in flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar — stays put; everything else scrolls. */}
        <div className="shrink-0 p-5 sm:p-6 pb-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">
              {isEdit ? (event ? 'Edit event' : 'New event') : 'Event'}
            </h3>
            <div className="flex items-center gap-1">
              {event && (
                <Link
                  href={`/events/${event.id}`}
                  onClick={(e) => {
                    if (isEdit && dirty && !confirm('You have unsaved changes. Leave and lose them?')) e.preventDefault();
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
        </div>

        {/* Body — the only scrolling region, so Save is always reachable. */}
        {isEdit ? (
          <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 pb-2 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-[var(--muted)]">Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus={!event}
                maxLength={120}
                placeholder="e.g. Loppen, Christiania"
                className="field mt-1 w-full px-3 py-2.5 text-sm font-semibold"
              />
            </label>

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

            <div>
              <span className="block text-xs font-medium text-[var(--muted)] mb-1.5">Status</span>
              <div className="grid grid-cols-2 gap-2">
                {(['pending', 'confirmed'] as EventStatus[]).map((st) => {
                  const sel = status === st;
                  const meta = STATUS_META[st];
                  return (
                    <button
                      key={st}
                      onClick={() => setStatus(st)}
                      className="py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                      style={
                        sel
                          ? { background: meta.color, borderColor: meta.color, color: '#fff' }
                          : { borderColor: 'var(--hairline)', color: 'var(--muted)' }
                      }
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>
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
              <span className="block text-xs font-medium text-[var(--muted)] mb-1.5">Details</span>
              <RichTextEditor
                value={text}
                onChange={setText}
                minHeight="9rem"
                placeholder="What's happening? e.g. load-in 18:00, bring the small PA…"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                style={{ color: TYPE_COLOR[type], background: `color-mix(in srgb, ${TYPE_COLOR[type]} 12%, white)` }}
              >
                {type}
              </span>
              <StatusBadge status={status} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-3">{title || formatLongDate(eventDate)}</h2>
            <p className="text-[var(--muted)] font-semibold mt-0.5">
              {formatLongDate(eventDate)}
              {time && ` · ${time}`}
            </p>
            <hr className="my-4 border-[var(--hairline)]" />
            {text.trim() ? (
              <Markdown>{text}</Markdown>
            ) : (
              <p className="text-[var(--faint)] italic">No details yet.</p>
            )}
          </div>
        )}

        {/* Footer (fixed) */}
        <div className="shrink-0 flex items-center gap-2 p-5 sm:p-6 pt-4 border-t border-[var(--hairline)]">
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
          {isEdit ? (
            <>
              <button onClick={cancelEdit} disabled={busy} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy || !title.trim()}
                className="btn-grad px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40"
              >
                {busy ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button onClick={() => setMode('edit')} className="btn-grad px-6 py-2.5 rounded-xl text-sm font-bold">
              Edit event
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
