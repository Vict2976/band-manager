# Module: app/gear

The Gear tab of the Band Manager: a Next.js client page that shows the band's shared gear list (one shared text the whole band edits, via SharedNotes) and, below it, the per-musician 'What to bring' section — one circle per band member that opens a modal to write the gear that musician needs at every gig. Circles are filled with a member color when a note exists, so the band can see at a glance who has written something.

## Key files
- `app/gear/page.tsx`: Default export GearPage wraps the tab in AppShell and composes GearOverview (shared gear list backed by subscribeToGear/saveGear through SharedNotes) and Needs (per-member 'What to bring' circles subscribed via subscribeToNeeds). NeedModal is a portal-rendered editor that saves a member's note with saveNeed and warns about unsaved changes on close.

## Public interface
- default export GearPage (Next.js route page for /gear)

## Dependencies
- react (useEffect, useState)
- react-dom (createPortal)
- ../../lib/AppShell (page shell)
- ../../lib/SharedNotes (shared editable text component)
- ../../lib/gearService (subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS)

## Open questions
- Where gearService persists data (its implementation is not in this module), and whether subscribeToGear/subscribeToNeeds are realtime subscriptions returning unsubscribe functions as the useEffect usage implies.
- BAND_MEMBERS is a static list imported from gearService; how it is maintained when the band lineup changes is not visible here.
- Save errors in NeedModal are only logged to console with no user-facing message.
