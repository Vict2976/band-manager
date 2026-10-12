# Module: app/standins

Provides the Stand-ins page, where the band maintains the shared list of musicians who can fill in if someone can't make a gig or cancels — described in the product's own words as 'a short shared list of musicians who can fill in if someone can't make a gig or cancels.'

## Key files
- `app/standins/page.tsx`: Defines the StandinsPage route component, rendering the shared stand-ins note editor inside the app shell.

## Public interface
- StandinsPage (default export of app/standins/page.tsx)

## Dependencies
- ../../lib/AppShell
- ../../lib/SharedNotes
- ../../lib/standinService

## Open questions
- What does lib/standinService's subscribeToStandins/saveStandins implementation do (storage, sync mechanism)?
- What does the SharedNotes component do internally (editing, formatting, persistence)?
