# Module: app/upcoming

The Upcoming tab of the Band Manager: a Next.js client page that lists every gig and rehearsal from today onward in date order, with each entry expandable in place to show its details (Markdown text) and a link to the event's full page. It subscribes to the live event stream so the list updates as events change, and offers a link back to the calendar when nothing is coming up.

## Key files
- `app/upcoming/page.tsx`: Route page for /upcoming. Default export UpcomingPage wraps the inner Upcoming component in AppShell. Upcoming subscribes to events via subscribeToEvents, filters to those with date >= today (relying on the service's date/time sort), and renders a list of cards showing a short date, a relative label (Today / Tomorrow / in N days / next week / in N weeks), the event type with TYPE_COLOR styling, a compact StatusBadge, the time, and the title. Tapping a card toggles an expanded section rendering the event text as Markdown (or 'No details.') plus an 'Open full page' link to /events/{id}. Empty state links to '/' to add an event on the calendar.

## Public interface
- default export UpcomingPage (Next.js page component for the /upcoming route)

## Dependencies
- react (useEffect, useMemo, useState)
- next/link
- ../../lib/AppShell (AppShell layout wrapper)
- ../../lib/Markdown (Markdown renderer for event text)
- ../../lib/EventModal (TYPE_COLOR, StatusBadge)
- ../../lib/eventService (BandEvent type, subscribeToEvents)

## Open questions
- Date comparison uses the device's local date (todayKey) while BandEvent.date is a 'YYYY-MM-DD' string; behaviour across time zones depends on how eventService stores dates, which is not visible here.
- The page assumes subscribeToEvents returns an unsubscribe function usable as the useEffect cleanup and already sorts by date then time; this contract lives in lib/eventService, not in this module.
- Dates are formatted with the 'en-GB' locale and English relative labels; whether the band wants a different locale is not evident from the code.
- There is no distinction in this list for unconfirmed events beyond StatusBadge; how '(TBC)' is represented depends on lib/EventModal.
