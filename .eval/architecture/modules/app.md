# Module: app

Root of the Next.js app: defines the global HTML shell (metadata, icons, fonts, AuthProvider) and the home route, which renders the shared band calendar — the single place where gigs and rehearsals are seen and added, matching the product's aim of letting everyone see what's happening and when in a few seconds.

## Key files
- `app/layout.tsx`: Root layout: wraps the whole app in AuthProvider, sets page metadata/title ('Band Manager'), favicons, manifest, and theme-color so the app 'works like a phone app'.
- `app/page.tsx`: Home page: renders AppShell and the Calendar component, which builds a month grid, lists events per day with type color and confirmed/TBC status dots, and opens an EventModal to create or edit an event; also surfaces CalendarSync.

## Public interface
- RootLayout (default export, app/layout.tsx)
- CalendarPage (default export, app/page.tsx)

## Dependencies
- next
- next/font/google
- next/link
- ../lib/auth
- ../lib/AppShell
- ../lib/Markdown
- ../lib/EventModal
- ../lib/CalendarSync
- ../lib/eventService
- ./globals.css

## Open questions
- app/page.tsx is truncated — the full rendering of selected-day events, the EventModal create/edit flow, and how 'Confirmed'/'Being figured out' statuses and '(TBC)' suffixes are handled in the UI are not fully shown.
- No prompt files or model/LLM API calls appear in app/layout.tsx or app/page.tsx; unclear if other files in the app module (not shown) contain AI logic.
- The relationship between lib/eventService's subscribeToEvents and the described 'instant shared saving' / real-time sync claim is not shown in these files.
