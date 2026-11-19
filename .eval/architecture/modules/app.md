# Module: app

Provides the root layout and main calendar view for band members to manage and browse gig and rehearsal schedules.

## Key files
- `app/layout.tsx`: Root HTML layout configuring global fonts, metadata, icons, styling, and the authentication provider.
- `app/page.tsx`: Main client-rendered calendar page for viewing monthly schedules, selecting dates, and managing band events.

## Public interface
- RootLayout
- metadata
- default (CalendarPage)

## Dependencies
- react
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
- _none_
