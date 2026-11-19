# Module: app/events

Displays detailed information for a single band event (gig or rehearsal) by ID, subscribing to real-time event updates and providing an edit modal.

## Key files
- `app/events/[id]/page.tsx`: Client-rendered Next.js page component that loads and renders individual event details, formatted dates, markdown descriptions, and an event edit modal.

## Public interface
- default function EventPage()

## Dependencies
- next/navigation
- next/link
- react
- lib/AppShell
- lib/Markdown
- lib/EventModal
- lib/eventService

## Open questions
- _none_
