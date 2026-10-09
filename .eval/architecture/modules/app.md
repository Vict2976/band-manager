# Module: app

Next.js App Router entry for the Band Manager: the root layout (fonts, PWA/icon metadata, shared band auth provider wrapping every page) and the home route, which is the Calendar tab — a Monday-first month view where tapping a day shows that day's gigs and rehearsals, with dots per event coloured by type (filled when Confirmed, outlined when still being figured out), and buttons to add a gig or rehearsal or open an existing event for editing.

## Key files
- `app/layout.tsx`: RootLayout: loads Geist fonts and globals.css, declares page metadata (title 'Band Manager', favicons, apple-touch-icon, manifest, theme-color #6874f4, standalone-web-app meta tags) and wraps all children in AuthProvider from ../lib/auth so the one shared band login applies app-wide.
- `app/page.tsx`: Client component for the Calendar tab at '/'. CalendarPage wraps the Calendar component in AppShell. Calendar subscribes to live band events via subscribeToEvents, groups them by date (YYYY-MM-DD keys), builds a 42-cell Monday-first month grid with local date helpers (toKey, todayKey, buildMonthGrid, formatLongDate), supports previous/next month and 'Today' navigation, renders per-day event dots using TYPE_COLOR and status, and lists the selected day's events (type pill, StatusBadge, time) as cards that open EventModal for editing; '+ Add event' starts creation. Also imports Markdown, CalendarSync and a Legend component whose rendering is in the truncated part of the file.

## Public interface
- app/layout.tsx: default export RootLayout({ children }) — Next.js root layout
- app/layout.tsx: export const metadata: Metadata — site title, description and icon config
- app/page.tsx: default export CalendarPage() — the '/' route (Calendar tab)

## Dependencies
- next (Metadata type, next/link)
- next/font/google (Geist, Geist_Mono)
- react (useEffect, useMemo, useRef, useState)
- ./globals.css (imported by app/layout.tsx)
- ../lib/auth — AuthProvider
- ../lib/AppShell — AppShell page chrome / tab shell
- ../lib/Markdown — Markdown renderer
- ../lib/EventModal — EventModal, TYPE_COLOR, StatusBadge
- ../lib/CalendarSync — calendar subscription/sync UI
- ../lib/eventService — BandEvent type, subscribeToEvents

## Open questions
- app/page.tsx is truncated: the Legend component, how CalendarSync, Markdown, EventModal (create vs. edit) and useRef are actually used, and how creation pre-fills the selected date are not visible.
- The root layout sets lang='en' and the description 'Shared calendar and gear list for the band' — confirm this matches the intended language/branding for Olis Orkester.
- Event grouping relies on e.date being a 'YYYY-MM-DD' string matching the local toKey format; the BandEvent contract in ../lib/eventService is not shown here.
- Layout references /manifest.json, /logo.png and favicon assets that are outside this module and not provided.
- Two overlapping icon declarations (metadata.icons vs. manual <link> tags in <head>) point at different files (favicon PNGs vs. logo.png); unclear which is intended to win.
