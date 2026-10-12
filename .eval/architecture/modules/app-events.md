# Module: app/events

Provides the shareable event detail page where a single gig or rehearsal can be viewed in full and edited, supporting the product's goal of a shareable event page and keeping gig information current (owner edits on changes, deletes if cancelled).

## Key files
- `app/events/[id]/page.tsx`: Next.js route component rendering the event detail page: loads a single event by id, shows its type, status badge, date/time, markdown description, and an Edit button that opens the shared EventModal for editing or deletion.

## Public interface
- EventPage (default export, route component for /events/[id])

## Dependencies
- ../../../lib/AppShell
- ../../../lib/Markdown
- ../../../lib/EventModal
- ../../../lib/eventService

## Open questions
- What does lib/eventService's subscribeToEvent do under the hood (realtime DB subscription?) and how is BandEvent's shape defined, since this file only consumes it.
- How does EventModal implement edit/delete and status changes (e.g. Being figured out → Confirmed), since this page only triggers it.
- Is there any server-side rendering or metadata generation for shareable links, or is this purely client-rendered ('use client')?
