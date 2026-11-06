# Module: app/upcoming

Displays a chronological list of upcoming band events starting from today, providing collapsible event previews with markdown rendering and direct navigation to detailed event pages.

## Key files
- `app/upcoming/page.tsx`: Client-side page component that subscribes to event updates, filters events from the current date forward, and renders the interactive accordion-style upcoming list.

## Public interface
- default function UpcomingPage()

## Dependencies
- react
- next/link
- ../../lib/AppShell
- ../../lib/Markdown
- ../../lib/EventModal
- ../../lib/eventService

## Open questions
- _none_
