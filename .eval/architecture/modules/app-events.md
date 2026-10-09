# Module: app/events

Renders the 'Full page' for a single gig or rehearsal: the shareable, standalone event page (route /events/[id]) that shows the event's type, status badge (e.g. being figured out / confirmed), title, full date/time and Markdown-rendered details, with an Edit button that opens the shared EventModal in edit mode. It subscribes live to the event so changes saved by the band appear instantly, and handles loading and 'event no longer exists' states with a link back to the calendar.

## Key files
- `app/events/[id]/page.tsx`: Next.js client page component (EventPage wrapped in AppShell) containing EventDetail: subscribes to one event by route id via subscribeToEvent, renders header/badges/details with Markdown, toggles EventModal for editing, and redirects to '/' after deletion.

## Public interface
- default export EventPage (Next.js App Router page for /events/[id])

## Dependencies
- lib/AppShell (layout wrapper)
- lib/Markdown (renders event.text)
- lib/EventModal (default EventModal component, TYPE_COLOR map, StatusBadge)
- lib/eventService (BandEvent type, subscribeToEvent)
- next/navigation (useParams, useRouter)
- next/link
- react (useEffect, useState)

## Open questions
- Where does subscribeToEvent get its data (lib/eventService is not included in this module), and what backend provides the live subscription?
- Does the event page enforce any auth beyond what AppShell provides (the single shared band login)?
- Date formatting is hardcoded to 'en-GB' locale — is that intentional for the band?
- The route is only reachable via the [id] segment; who generates/shares the link (the 'Full page' link in the chat) is not shown here.
