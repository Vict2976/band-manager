# Module: app

Root of the Next.js app: `app/layout.tsx` sets up the HTML shell (fonts, PWA/mobile meta tags, favicon links, `AuthProvider` wrapper) and `app/page.tsx` renders the home screen — a Monday-first month calendar where band members see upcoming gigs and rehearsals, pick a day, and open or add events. Events are streamed live via `subscribeToEvents` from `lib/eventService` and rendered with per-type colours and confirmed/unconfirmed status dots; tapping an event opens `EventModal` for editing and '+ Add event' opens it in create mode.

## Key files
- `app/layout.tsx`: Next.js root layout: loads Geist fonts and globals.css, exports `metadata` (title 'Band Manager', description 'Shared calendar and gear list for the band', icons), adds manifest/theme-color/apple-mobile-web-app meta tags for phone home-screen install, and wraps all pages in `AuthProvider` from `../lib/auth`.
- `app/page.tsx`: Client component for the calendar home page. `CalendarPage` wraps `Calendar` in `AppShell`. `Calendar` keeps year/month/selected-day state, subscribes to `BandEvent`s, groups them by date, builds a 42-cell month grid with local date helpers (`buildMonthGrid`, `toKey`, `todayKey`, `formatLongDate`), shows event dots (filled = confirmed, outlined = otherwise, colour from `TYPE_COLOR[e.type]`), lists the selected day's events with `StatusBadge`, and opens `EventModal` for editing/creating. Also imports `Markdown`, `CalendarSync`, `Link`, `useRef` and a `Legend` component whose usage falls in the truncated portion.

## Public interface
- app/layout.tsx: default export `RootLayout({ children })` (Next.js root layout)
- app/layout.tsx: `export const metadata: Metadata` (title, description, icons)
- app/page.tsx: default export `CalendarPage()` — the `/` route page (client component)
- app/page.tsx (module-internal, not exported): `Calendar`, `Legend`, `buildMonthGrid`, `formatLongDate`, `toKey`, `todayKey`, `pad`, `WEEKDAYS`, `MONTHS`

## Dependencies
- next (Metadata type, next/font/google: Geist, Geist_Mono, next/link)
- react (useEffect, useMemo, useRef, useState)
- ./globals.css (imported in app/layout.tsx)
- ../lib/auth — `AuthProvider`
- ../lib/AppShell — `AppShell` (default)
- ../lib/Markdown — `Markdown` (default)
- ../lib/EventModal — `EventModal` (default), `TYPE_COLOR`, `StatusBadge`
- ../lib/CalendarSync — `CalendarSync` (default)
- ../lib/eventService — `BandEvent` type, `subscribeToEvents`

## Open questions
- app/page.tsx is truncated: the remainder of the event list item, the `Legend` component, and how `EventModal`, `CalendarSync`, `Markdown` and `Link` are actually rendered are not visible — in particular whether the 'mark whether they can play' availability flow lives in this page or entirely inside `EventModal`.
- `subscribeToEvents` is called with no auth context visible here — is event visibility gated by `AuthProvider` inside `AppShell`, or is the subscription open to any visitor of `/`?
- The `app/api/calendar/[token]/` route handler named in the stack scan was not among the provided files, so this summary cannot describe the server side; `CalendarSync` is presumably its client counterpart but that is unverified.
- app/layout.tsx declares both `metadata.icons` (favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png) and hand-written `<link rel="icon">` tags pointing at /logo.png — two overlapping icon sets; which one is intended?
- All date math is local-time (`new Date(year, month, day)`, `toKey`); event `date` keys from `eventService` are assumed to be `YYYY-MM-DD` strings in the same local convention.
