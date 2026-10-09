# Module: app/standins

Renders the Stand-ins tab of the Band Manager: a single shared, live-updating text note listing musicians who can fill in if someone can't make a gig or cancels, with a placeholder encouraging grouping by instrument (e.g. '## Drums', '## Bass', '## Sound / tech') so the right person is quick to find. It is one of the secondary 'Extras' tabs beyond gigs and rehearsals.

## Key files
- `app/standins/page.tsx`: Next.js client page component (StandinsPage) that wraps a SharedNotes editor in the AppShell, wiring the shared note to the stand-ins subscribe/save functions from lib/standinService.

## Public interface
- default export StandinsPage (React client component, Next.js app route at /standins)

## Dependencies
- ../../lib/AppShell (AppShell layout wrapper)
- ../../lib/SharedNotes (shared live-editable text note component)
- ../../lib/standinService (subscribeToStandins, saveStandins)

## Open questions
- Where and how lib/standinService persists and streams the stand-ins text (e.g. which realtime backend) — not visible in this module.
- Whether SharedNotes interprets the '## Instrument' markdown-style headings or just stores plain text.
- The purpose of the '@uxid' comment annotation (app/standins/page::StandinsPage) and which tooling consumes it.
