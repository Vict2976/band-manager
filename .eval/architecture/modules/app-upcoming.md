# Module: app/upcoming

Provides the 'Upcoming' view, a chronological list of upcoming gigs and rehearsals that lets a band member quickly expand an entry to see its details or jump to its full event page, supporting the goal of seeing what is happening and when in a few seconds.

## Key files
- `app/upcoming/page.tsx`: Client page component rendering the Upcoming list: filters events to those on or after today, sorts by date/time (via subscribeToEvents), and renders expandable rows showing date, relative label (Today/Tomorrow/in N days/weeks), type, status badge, time, title, and expanded markdown description with a link to the full event page.

## Public interface
- UpcomingPage (default export, route component for app/upcoming)

## Dependencies
- ../../lib/AppShell
- ../../lib/Markdown
- ../../lib/EventModal (TYPE_COLOR, StatusBadge)
- ../../lib/eventService (BandEvent, subscribeToEvents)
- next/link

## Open questions
- What does subscribeToEvents do internally for sorting/filtering and where does event data originate (not shown in this module)?
- Does BandEvent.status map directly to the 'Being figured out'/'Confirmed' states described in the product rules, and how is '(TBC)' suffixing handled relative to this view?
