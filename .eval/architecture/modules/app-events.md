# Module: app/events

Provides the event detail page allowing users to view, subscribe to real-time updates for, and edit or delete a specific event by ID.

## Key files
- `app/events/[id]/page.tsx`: Next.js dynamic client page that fetches and renders single event details, handles 404/loading states, and opens the editing modal.

## Public interface
- default function EventPage()

## Dependencies
- next/navigation
- next/link
- react
- ../../../lib/AppShell
- ../../../lib/Markdown
- ../../../lib/EventModal
- ../../../lib/eventService

## Open questions
- _none_
