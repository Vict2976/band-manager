# Module: app/events

Display and manage individual event details with full markdown-rendered descriptions, edit capabilities, and event type styling

## Key files
- `app/events/[id]/page.tsx` — Event detail page component with EventDetail subcomponent handling loading, not-found, and display states

## Public interface
- EventPage (default export)
- EventDetail (internal component)
- formatFullDate utility function

## Dependencies
- lib/AppShell
- lib/Markdown
- lib/EventModal
- lib/eventService (BandEvent type and subscribeToEvent function)
- next/navigation (useParams, useRouter)
- next/link

## Open questions
- What authentication/authorization controls exist for the Edit action?
- How is event data persistence handled in eventService.subscribeToEvent?
- What markdown syntax is supported by the Markdown component?
- Are there any analytics or telemetry events tracked on this page?
