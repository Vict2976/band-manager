'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './auth';
import Markdown from './Markdown';

type Msg = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Hvornår er næste gig?',
  'Hvornår øver vi næste gang?',
  'Hvad mangler vi af udstyr?',
  'Hvem kan vi ringe til som stand-in?',
];

/**
 * Floating AI helper in the bottom-right corner. Only mounted inside AppShell
 * after sign-in, and the API route verifies the Firebase ID token as well.
 */
export default function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!user) return null;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || !user) return;
    setError('');
    setInput('');
    const history: Msg[] = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error((await res.text().catch(() => '')) || 'Noget gik galt.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: answer }]);
      }
      if (!answer.trim()) throw new Error('Fik et tomt svar. Prøv igen.');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setMessages(history);
      setError((err as Error).message || 'Noget gik galt.');
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed z-40 right-3 left-3 sm:left-auto bottom-[calc(9rem+env(safe-area-inset-bottom))] sm:bottom-24 sm:right-6 sm:w-[380px] h-[min(560px,calc(100dvh-12rem))] card flex flex-col overflow-hidden animate-slide-up"
          role="dialog"
          aria-label="Band-assistent"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--hairline)]">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg btn-grad grid place-items-center text-white text-xs font-bold">♪</span>
              <div>
                <p className="text-sm font-bold leading-tight">Band-assistent</p>
                <p className="text-[11px] text-[var(--muted)] leading-tight">Spørg om gigs, øvning, gear…</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && !busy && (
                <button
                  onClick={() => {
                    setMessages([]);
                    setError('');
                  }}
                  className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] px-2 py-1"
                >
                  Ryd
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Luk"
                className="w-8 h-8 grid place-items-center rounded-full text-[var(--muted)] hover:bg-[var(--primary-50)]"
              >
                ✕
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[var(--muted)]">
                  Hej! Jeg kender bandets kalender, gear og stand-ins. Hvad vil du vide?
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="btn-soft text-xs font-semibold px-3 py-1.5 rounded-full text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md px-3 py-2 text-sm text-white bg-[var(--primary)] whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md px-3 py-2 text-sm bg-[var(--primary-50)]">
                    {m.content ? (
                      <Markdown className="text-sm">{m.content}</Markdown>
                    ) : (
                      <span className="flex gap-1 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              )
            )}

            {error && <p className="text-xs text-[var(--latina)]">{error}</p>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 p-3 border-t border-[var(--hairline)]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Skriv et spørgsmål…"
              className="field flex-1 resize-none text-sm px-3 py-2 max-h-28"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="btn-grad rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Wrapper carries the positioning: .btn-grad sets position: relative,
          which would override a `fixed` class on the button itself. */}
      <div className="fixed z-40 right-4 sm:right-6 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] sm:bottom-6">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Luk band-assistent' : 'Åbn band-assistent'}
        className="w-14 h-14 rounded-full btn-grad shadow-lg grid place-items-center"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          </svg>
        )}
      </button>
      </div>
    </>
  );
}
