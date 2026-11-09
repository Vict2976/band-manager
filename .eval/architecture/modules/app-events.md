# Module: app/events

Client-side event detail page: shows a single band event (a gig or other event) with its type, status, title, date/time and Markdown notes, subscribed live via eventService; lets the user open the EventModal to edit or delete the event and redirects to the calendar after deletion.

## Key files
- `app/events/[id]/page.tsx`: Next.js client page for /events/[id]; wraps EventDetail in AppShell, handles loading / not-found states, renders event header (type colour bar, type pill, StatusBadge, formatted en-GB date, optional time), Markdown body, and an Edit button that opens EventModal in edit mode.

## Public interface
- default export EventPage (Next.js page component for route /events/[id])

## Dependencies
- react (useEffect, useState)
- next/navigation (useParams, useRouter)
- next/link
- ../../../lib/AppShell
- ../../../lib/Markdown
- ../../../lib/EventModal (default EventModal, TYPE_COLOR, StatusBadge)
- ../../../lib/eventService (BandEvent type, subscribeToEvent)

## Open questions
- What does subscribeToEvent back onto (real-time listener vs polling) and does it clean up the subscription correctly? The effect returns its result as the cleanup, so it must return an unsubscribe function.
- Is there any auth/membership check before showing or editing an event? None is visible in this file.
- The product is about members marking availability; this page shows no availability/stand-in UI — is that handled elsewhere (e.g. in EventModal) or not yet built?
- What are the possible values of event.type and event.status (TYPE_COLOR and StatusBadge are defined in lib/EventModal, not shown)?
