# Module: app

Root layout and calendar page for a band management application. Provides the main app shell, authentication context, and a calendar view for browsing events by date.

## Key files
- `app/layout.tsx` — Root layout component that wraps the entire app with auth provider, fonts, metadata, and PWA configuration.
- `app/page.tsx` — Calendar page component that displays a monthly calendar grid, selected day events, and event creation/editing modals.

## Public interface
- CalendarPage
- Calendar
- RootLayout
- buildMonthGrid()
- formatLongDate()
- toKey()
- todayKey()

## Dependencies
- lib/auth::AuthProvider
- lib/AppShell
- lib/Markdown
- lib/EventModal
- lib/eventService::BandEvent
- lib/eventService::subscribeToEvents
- next/font/google
- next/link

## Open questions
- What is the complete implementation of EventModal and how does it handle create vs edit workflows?
- How does the EventModal component interact with the backend event service?
- What authentication flows does AuthProvider handle?
- What is the full event API contract returned by subscribeToEvents?
- How are event type colors (TYPE_COLOR) determined and can they be customized?
