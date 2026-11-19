# Module: app/upcoming

Displays a chronological list of upcoming band events (gigs, rehearsals, and other activities) from today onwards, allowing members to expand items for markdown details and link to full event pages.

## Key files
- `app/upcoming/page.tsx`: Client component page that subscribes to band events, filters them to upcoming dates, and renders interactive collapsible event cards within AppShell.

## Public interface
- export default function UpcomingPage(): JSX.Element

## Dependencies
- react
- next/link
- ../../lib/AppShell
- ../../lib/Markdown
- ../../lib/EventModal
- ../../lib/eventService

## Open questions
- _none_
