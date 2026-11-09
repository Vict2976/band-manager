# Module: app/upcoming

The "Upcoming" page: a client-rendered list of the band's future events (gigs and other activities) in date order, so members can check upcoming gigs on their phones. Each row shows the date, a relative label (Today / Tomorrow / in N days / next week / in N weeks), the event type, a status badge, optional time and title; tapping a row expands its Markdown details with a link to the event's full page (/events/[id]). When nothing is upcoming it links back to the calendar at / to add something.

## Key files
- `app/upcoming/page.tsx`: Next.js client page. Default export UpcomingPage wraps the Upcoming component in AppShell. Upcoming subscribes to events via subscribeToEvents, filters to those with date >= today (relying on the service's date/time sort), and renders an accordion-style list with local expand/collapse state. Contains date helpers todayKey, shortDate, daysFromToday, relativeLabel.

## Public interface
- default export UpcomingPage (Next.js page component for route /upcoming)

## Dependencies
- react (useEffect, useMemo, useState)
- next/link
- ../../lib/AppShell (AppShell layout)
- ../../lib/Markdown (Markdown renderer for event text)
- ../../lib/EventModal (TYPE_COLOR, StatusBadge)
- ../../lib/eventService (BandEvent type, subscribeToEvents)

## Open questions
- The page lists events but has no UI for members to mark whether they can play; where availability/stand-in handling lives is not shown in this module (possibly /events/[id]).
- subscribeToEvents is assumed to return an unsubscribe function (returned directly from useEffect) and to sort by date then time; this contract is defined outside the module.
- Date comparison uses local-time YYYY-MM-DD string keys; behaviour for events missing a date or across timezones depends on eventService.
