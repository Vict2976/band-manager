# Module: app/standins

Renders the Stand-ins page: a shared, free-text notes area where the band keeps the list of people who can fill in when a member cannot play (name, contact and instrument or role), so the band can find a stand-in for a gig.

## Key files
- `app/standins/page.tsx`: Client-side Next.js page component (StandinsPage) that wraps a SharedNotes editor in the AppShell, configured with stand-in specific title, subtitle, placeholder and empty-state label, and wired to subscribeToStandins/saveStandins for live reading and persisting the stand-ins text.

## Public interface
- default export StandinsPage (React client component, Next.js app route at /standins)

## Dependencies
- ../../lib/AppShell (AppShell layout component)
- ../../lib/SharedNotes (SharedNotes shared-text editor component)
- ../../lib/standinService (subscribeToStandins, saveStandins)

## Open questions
- Where and how does lib/standinService persist stand-ins (database, realtime backend, local storage)? Only the import is visible here.
- Is the stand-in list intended to stay unstructured markdown-like text, or is there a plan to link stand-ins to specific gigs/availability?
- What does the '@uxid' comment annotation drive (tooling, tests, analytics)?
