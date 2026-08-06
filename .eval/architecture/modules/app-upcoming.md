# Module: app/upcoming

Display upcoming band events with expandable details, sorted chronologically from today onwards. Provides quick preview and link to full event pages.

## Key files
- `app/upcoming/page.tsx` — Main page component that renders the upcoming events list with filtering, toggling, and date formatting

## Public interface
- UpcomingPage (default export)
- Upcoming (internal component)

## Dependencies
- react (useEffect, useMemo, useState)
- next/link
- lib/AppShell
- lib/Markdown
- lib/EventModal (TYPE_COLOR constant)
- lib/eventService (BandEvent type, subscribeToEvents function)

## Open questions
- What is the shape and real-time update mechanism of BandEvent objects from eventService?
- How are events sorted in subscribeToEvents beyond date and time?
- What markdown syntax does the Markdown component support?
- Is there pagination or virtualization for large event lists?
