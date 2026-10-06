'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import AppShell from '../../lib/AppShell';
import SharedNotes from '../../lib/SharedNotes';
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
  return (
    <SharedNotes
      title="Gear"
      subtitle="What the band has."
      placeholder={'## PA\n2× QSC K12\n\n## Mics\n- 3× SM58\n- 1× SM57\n\n## Drums\nHouse kit at the studio'}
      emptyLabel="Add your gear →"
      subscribe={subscribeToGear}
      save={saveGear}
    />
  );
}

/* ---------------- What we need ---------------- */

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

  // Portal to <body> so the animated section can't clip or bury the overlay.
  return createPortal(
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
    </div>,
    document.body
  );
}
