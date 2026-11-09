# Module: app/gear

The band's Gear page: a client-rendered Next.js page where members see what gear the band has (a shared, editable notes block) and what each musician needs brought to every gig (per-member notes edited in a modal). It sits inside the shared AppShell and persists via gearService.

## Key files
- `app/gear/page.tsx`: Client page component exporting GearPage; composes GearOverview (shared 'Gear' notes via SharedNotes with subscribeToGear/saveGear) and Needs (per-member 'What to bring' avatars from BAND_MEMBERS, live-updated via subscribeToNeeds, edited in a portal-rendered NeedModal that calls saveNeed).

## Public interface
- default export GearPage (Next.js route page for /gear)

## Dependencies
- react (useEffect, useState)
- react-dom (createPortal)
- ../../lib/AppShell (AppShell layout wrapper)
- ../../lib/SharedNotes (shared editable notes component)
- ../../lib/gearService (subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS)

## Open questions
- What backing store does lib/gearService use for subscribeToGear/subscribeToNeeds (real-time subscription API suggests a live database, but it is not shown here)?
- Is BAND_MEMBERS a hardcoded list of the five members, and is there any auth/identity so only the relevant member edits their own needs?
- Save errors in NeedModal are only logged to console; is there user-facing error feedback elsewhere?
