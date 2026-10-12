'use client';

import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: string;
  autoFocus?: boolean;
  /** Fill the parent's height; the textarea scrolls internally. */
  grow?: boolean;
}

type Result = { text: string; selStart: number; selEnd: number };

// @uxid lib/RichTextEditor::RichTextEditor
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = '8rem',
  autoFocus,
  grow = false,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pendingSel = useRef<{ start: number; end: number } | null>(null);

  // Restore caret/selection after a toolbar edit re-renders the textarea.
  useEffect(() => {
    if (pendingSel.current && ref.current) {
      ref.current.focus();
      ref.current.setSelectionRange(pendingSel.current.start, pendingSel.current.end);
      pendingSel.current = null;
    }
  });

  const apply = (fn: (val: string, s: number, e: number) => Result) => {
    const ta = ref.current;
    if (!ta) return;
    const { text, selStart, selEnd } = fn(value, ta.selectionStart, ta.selectionEnd);
    pendingSel.current = { start: selStart, end: selEnd };
    onChange(text);
  };

  // Wrap the selection in an inline marker (** or *); toggles off if already wrapped.
  const wrap = (marker: string) =>
    apply((val, s, e) => {
      const before = val.slice(0, s);
      const sel = val.slice(s, e);
      const after = val.slice(e);
      if (before.endsWith(marker) && after.startsWith(marker)) {
        return {
          text: before.slice(0, -marker.length) + sel + after.slice(marker.length),
          selStart: s - marker.length,
          selEnd: e - marker.length,
        };
      }
      return {
        text: before + marker + sel + marker + after,
        selStart: s + marker.length,
        selEnd: e + marker.length,
      };
    });

  // Add/remove a per-line prefix across the selected lines (headings, lists).
  const linePrefix = (make: (i: number) => string, test: RegExp) =>
    apply((val, s, e) => {
      const lineStart = val.lastIndexOf('\n', s - 1) + 1;
      let lineEnd = val.indexOf('\n', e);
      if (lineEnd === -1) lineEnd = val.length;
      const lines = val.slice(lineStart, lineEnd).split('\n');
      const allPrefixed = lines.every((ln) => test.test(ln));
      const next = lines
        .map((ln, i) => (allPrefixed ? ln.replace(test, '') : make(i) + ln))
        .join('\n');
      return {
        text: val.slice(0, lineStart) + next + val.slice(lineEnd),
        selStart: lineStart,
        selEnd: lineStart + next.length,
      };
    });

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if ((ev.metaKey || ev.ctrlKey) && !ev.shiftKey && !ev.altKey) {
      const k = ev.key.toLowerCase();
      if (k === 'b') { ev.preventDefault(); wrap('**'); }
      else if (k === 'i') { ev.preventDefault(); wrap('*'); }
    }
  };

  const tools: { label: React.ReactNode; title: string; run: () => void }[] = [
    { label: <strong>B</strong>, title: 'Bold (⌘B)', run: () => wrap('**') },
    { label: <em>I</em>, title: 'Italic (⌘I)', run: () => wrap('*') },
    { label: 'H', title: 'Heading', run: () => linePrefix(() => '## ', /^#{1,6}\s/) },
    { label: '• List', title: 'Bullet list', run: () => linePrefix(() => '- ', /^[-*]\s/) },
    { label: '1. List', title: 'Numbered list', run: () => linePrefix((i) => `${i + 1}. `, /^\d+\.\s/) },
  ];

  return (
    <div className={`rte${grow ? ' rte-grow' : ''}`}>
      <div className="rte-toolbar">
        {tools.map((t, i) => (
          <button
            key={i}
            type="button"
            title={t.title}
            // keep textarea selection while clicking the toolbar
            onMouseDown={(e) => e.preventDefault()}
            onClick={t.run}
            className="rte-btn"
          >
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{ minHeight }}
        className="rte-textarea"
      />
    </div>
  );
}
