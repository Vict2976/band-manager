# Module: app/gear

Provides the band's shared gear inventory and per-musician "what to bring" notes, letting members see what gear the band has and what each person needs or brings to a gig.

## Key files
- `app/gear/page.tsx`: Renders the Gear page inside AppShell with two sections: GearOverview (shared gear inventory editor using SharedNotes) and Needs (per-member avatar grid with a modal to edit each musician's 'what to bring' notes).

## Public interface
- GearPage (default export, app/gear/page.tsx)

## Dependencies
- ../../lib/AppShell
- ../../lib/SharedNotes
- ../../lib/gearService

## Open questions
- What does lib/gearService.ts implement (subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS) — not shown in provided files.
- What does lib/SharedNotes.tsx implement for the shared gear text editing UI — not shown in provided files.
- What does lib/AppShell.tsx provide for page layout/navigation — not shown in provided files.
