'use client';

import { useEffect, useRef, useState } from 'react';
import Markdown from './Markdown';
import RichTextEditor from './RichTextEditor';

/**
 * One free-text document the whole band edits together: rendered as markdown,
 * edited in place, autosaved shortly after typing stops.
 */
// @uxid lib/SharedNotes::SharedNotes
export default function SharedNotes({
  title,
  subtitle,
  placeholder,
  emptyLabel,
  subscribe,
  save,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  emptyLabel: string;
  subscribe: (onChange: (text: string) => void) => () => void;
  save: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const dirty = useRef(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textRef = useRef(text);
  textRef.current = text;
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    return subscribe((remote) => {
      if (!dirty.current) {
        setText(remote);
        setLoaded(true);
      }
    });
  }, [subscribe]);

  useEffect(() => {
    if (!dirty.current) return;
    setStatus('saving');
    const t = setTimeout(async () => {
      await saveRef.current(text);
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
      if (dirty.current) saveRef.current(textRef.current);
    };
  }, []);

  return (
    <section className="animate-slide-up">
      <div className="flex items-end justify-between px-1 mb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{subtitle}</p>
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
          placeholder={placeholder}
        />
      ) : (
        <div className="card p-5 min-h-[30vh]">
          {!loaded ? (
            <p className="text-sm text-[var(--faint)]">Loading…</p>
          ) : text.trim() ? (
            <Markdown>{text}</Markdown>
          ) : (
            <button onClick={() => setEditing(true)} className="text-sm font-semibold text-[var(--primary)] hover:underline">
              {emptyLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

// @uxid lib/SharedNotes::SaveStatus
function SaveStatus({ status }: { status: 'idle' | 'saving' | 'saved' }) {
  if (status === 'idle') return <span className="h-5" />;
  return (
    <span className="text-xs font-semibold flex items-center gap-1.5 h-5 whitespace-nowrap">
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
