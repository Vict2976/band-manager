'use client';

import { useEffect, useRef, useState } from 'react';
import AppShell from '../../lib/AppShell';
import Markdown from '../../lib/Markdown';
import RichTextEditor from '../../lib/RichTextEditor';
import {
  subscribeToGear,
  saveGear,
  subscribeToNeeds,
  saveNeed,
  BAND_MEMBERS,
} from '../../lib/gearService';

// Festival palette cycled across member avatars.
const MEMBER_COLORS = ['#6874f4', '#ff6b35', '#ff3d77', '#ffc24b', '#4c5ae8'];

export default function GearPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <GearOverview />
        <Needs />
      </div>
    </AppShell>
  );
}

/* ---------------- What we have ---------------- */

function GearOverview() {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const dirty = useRef(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    return subscribeToGear((remote) => {
      if (!dirty.current) {
        setText(remote);
        setLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!dirty.current) return;
    setStatus('saving');
    const t = setTimeout(async () => {
      await saveGear(text);
      dirty.current = false;
      setStatus('saved');
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setStatus('idle'), 2000);
    }, 700);
    return () => clearTimeout(t);
  }, [text]);

  // If we leave the page mid-edit (before the debounce fires), save now so nothing is lost.
  useEffect(() => {
    return () => {
      if (dirty.current) saveGear(textRef.current);
    };
  }, []);

  return (
    <section className="animate-slide-up">
      <div className="flex items-end justify-between px-1 mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gear</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">What the band has.</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <button
            onClick={() => setEditing((v) => !v)}
            className="btn-soft text-sm font-semibold px-4 py-2 rounded-full"
          >
            {editing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>

      {editing ? (
        <RichTextEditor
          value={text}
          onChange={(v) => {
            dirty.current = true;
            setText(v);
          }}
          minHeight="40vh"
          placeholder={
            '## PA\n2× QSC K12\n\n## Mics\n- 3× SM58\n- 1× SM57\n\n## Drums\nHouse kit at the studio'
          }
        />
      ) : (
        <div className="card p-5 min-h-[30vh]">
          {!loaded ? (
            <p className="text-sm text-[var(--faint)]">Loading…</p>
          ) : text.trim() ? (
            <Markdown>{text}</Markdown>
          ) : (
            <button onClick={() => setEditing(true)} className="text-sm font-semibold text-[var(--primary)] hover:underline">
              Add your gear →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------------- What we need ---------------- */

function SaveStatus({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return <span className="h-5" />;
  return (
    <span className="text-xs font-semibold flex items-center gap-1.5 h-5">
      {status === 'saving' ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          <span className="text-[var(--muted)]">Saving…</span>
        </>
      ) : (
        <span className="text-[var(--primary)]">Saved ✓</span>
      )}
    </span>
  );
}

function Needs() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => subscribeToNeeds(setNotes), []);

  return (
    <section className="animate-slide-up">
      <div className="px-1 mb-3">
        <h2 className="text-xl font-bold tracking-tight">What to bring</h2>
        <p className="text-sm text-[var(--muted)] mt-0.5">Gear we bring for each musician to a gig — tap to edit.</p>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {BAND_MEMBERS.map((member, i) => {
          const hasNote = (notes[member] ?? '').trim().length > 0;
          const color = MEMBER_COLORS[i % MEMBER_COLORS.length];
          return (
            <button
              key={member}
              onClick={() => setEditing(member)}
              className="flex flex-col items-center gap-1.5 group"
              title={notes[member] || `${member} — what to bring`}
            >
              <span className="relative">
                <span
                  className="w-12 h-12 rounded-full grid place-items-center text-white text-base font-bold transition-transform group-hover:scale-105 shadow-sm"
                  style={{ background: hasNote ? color : '#fff', color: hasNote ? '#fff' : 'var(--faint)', border: hasNote ? 'none' : '2px solid var(--hairline)' }}
                >
                  {member[0]}
                </span>
                {hasNote && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--gold)] border-2 border-white" />
                )}
              </span>
              <span className="text-xs font-semibold text-[var(--muted)]">{member}</span>
            </button>
          );
        })}
      </div>

      {editing && (
        <NeedModal
          member={editing}
          initial={notes[editing] ?? ''}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}

function NeedModal({
  member,
  initial,
  onClose,
}: {
  member: string;
  initial: string;
  onClose: () => void;
}) {
  const [text, setText] = useState(initial);
  const [busy, setBusy] = useState(false);

  const requestClose = () => {
    if (text !== initial && !confirm('You have unsaved changes. Close and lose them?')) return;
    onClose();
  };

  const save = async () => {
    setBusy(true);
    try {
      await saveNeed(member, text);
      onClose();
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--ink)]/30 backdrop-blur-sm p-0 sm:p-4" onClick={requestClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-4 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold">What to bring for {member}</h3>
        <p className="text-sm text-[var(--muted)] -mt-2">The gear this musician needs at every gig.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          autoFocus
          placeholder="e.g. guitar combo amp, 2× DI boxes, mic + stand, monitor mix…"
          className="field w-full px-3 py-2.5 text-sm resize-none"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1" />
          <button onClick={requestClose} disabled={busy} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted)] hover:bg-[var(--primary-50)] transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={save} disabled={busy} className="btn-grad px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-40">
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
