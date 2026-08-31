'use client';

import { useEffect, useState } from 'react';
import { getOrCreateFeedToken, rotateFeedToken, feedUrl } from './calendarFeedService';

/**
 * "Subscribe" — not "export". The phone re-fetches this URL on a schedule, so
 * events added here keep appearing on everyone's calendar without anyone
 * doing anything again.
 */
export default function CalendarSync() {
  const [url, setUrl] = useState<string | null>(null);
  const [local, setLocal] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nudged, setNudged] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    // A feed on localhost is only reachable from this machine — a phone or
    // Google's servers can't fetch it, so subscribing would silently do nothing.
    setLocal(/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|.*\.local)(:|$)/i.test(origin));

    let alive = true;
    getOrCreateFeedToken()
      .then((token) => alive && setUrl(feedUrl(token, origin)))
      .catch((err) => {
        console.error('Could not load the calendar feed link:', err);
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked outside a secure context — the input below is
      // selectable, so there's still a way to get the link.
      setError(true);
    }
  };

  const rotate = async () => {
    if (
      !confirm(
        'Make a new link? Everyone who already subscribed will stop getting updates ' +
          'and has to subscribe again with the new link.'
      )
    )
      return;
    try {
      const token = await rotateFeedToken();
      setUrl(feedUrl(token, window.location.origin));
    } catch (err) {
      console.error('Could not make a new calendar link:', err);
      setError(true);
    }
  };

  // webcal:// asks the OS to hand the link to the calendar app. Browsers are
  // free to refuse silently, so it's an accelerator, never the only route.
  const webcal = url ? url.replace(/^https?:\/\//, 'webcal://') : '';
  // Google's own "add calendar by URL" screen — a plain https link, so it
  // works even where the webcal handoff doesn't.
  const google = webcal
    ? `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`
    : '';

  return (
    <section className="card p-4 sm:p-5 animate-slide-up">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 text-left"
        aria-expanded={open}
      >
        <span className="w-9 h-9 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)] shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[var(--ink)]">Sync to your phone</span>
          <span className="block text-xs text-[var(--muted)] mt-0.5">
            Keep this calendar in Google or iPhone Calendar — it updates by itself.
          </span>
        </span>
        <svg
          className="shrink-0 text-[var(--faint)] transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-[var(--hairline)] space-y-4 animate-fade-in">
          {error && !url ? (
            <p className="text-sm text-[var(--latina)]">
              Couldn&apos;t load the sync link. Reload the page and try again.
            </p>
          ) : !url ? (
            <p className="text-sm text-[var(--faint)]">Loading…</p>
          ) : (
            <>
              {local && (
                <p className="text-xs font-medium rounded-xl px-3 py-2.5 bg-[var(--gold)]/15 text-[var(--ink)]">
                  <span className="font-bold">This link only works on this computer.</span> It
                  points at your local dev server, which phones and Google can&apos;t reach. Open
                  the deployed site and copy the link from there.
                </p>
              )}

              <div className="flex gap-2">
                <input
                  readOnly
                  value={url}
                  onFocus={(e) => e.currentTarget.select()}
                  className="field flex-1 min-w-0 px-3 py-2.5 text-xs font-mono"
                  aria-label="Calendar subscription link"
                />
                <button onClick={copy} className="btn-grad shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-2">
                <a
                  href={webcal}
                  onClick={() => setNudged(true)}
                  className="btn-soft block text-center text-sm font-semibold px-4 py-2.5 rounded-xl"
                >
                  Open in iPhone / Mac Calendar
                </a>
                <a
                  href={google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-soft block text-center text-sm font-semibold px-4 py-2.5 rounded-xl"
                >
                  Add to Google Calendar
                </a>
              </div>

              {nudged && (
                <p className="text-xs text-[var(--muted)] leading-relaxed animate-fade-in">
                  <span className="font-bold text-[var(--ink)]">Nothing happened?</span> Some
                  browsers refuse to hand <code className="font-mono">webcal://</code> links to the
                  Calendar app without saying so — Chrome in particular, once you&apos;ve dismissed
                  its prompt. Copy the link above and paste it into the Calendar app instead, using
                  the steps below. Safari does it reliably if you&apos;d rather retry.
                </p>
              )}

              <div className="space-y-3 text-xs text-[var(--muted)] leading-relaxed">
                <div>
                  <p className="font-bold text-[var(--ink)]">iPhone</p>
                  <p>
                    Settings → Apps → Calendar → Calendar Accounts → Add Account → Other →
                    Add Subscribed Calendar, and paste the link.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[var(--ink)]">Google Calendar</p>
                  <p>
                    On a computer: Other calendars → + → From URL, paste the link, Add calendar.
                    It then shows up in the Google Calendar app on your phone.
                  </p>
                </div>
                <p className="pt-1">
                  <span className="font-bold text-[var(--ink)]">Heads up:</span> iPhone checks for
                  changes within about 15 minutes. Google decides for itself and is often several
                  hours behind — that&apos;s Google&apos;s limit, not something this app controls.
                </p>
                <p>
                  Anyone with this link can see the band&apos;s schedule, so keep it in the band
                  chat and nowhere public.{' '}
                  <button onClick={rotate} className="font-bold text-[var(--primary)] hover:underline">
                    Make a new link
                  </button>{' '}
                  if it leaks.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
