# Module: app/gear

UI module for managing band gear inventory and per-musician requirements. Displays shared gear list (Markdown-formatted) and per-member 'what to bring' checklist with modal editor for each band member.

## Key files
- `app/gear/page.tsx` — Main page component with GearOverview, Needs, NeedModal, and SaveStatus UI

## Public interface
- GearPage (default export)
- GearOverview
- Needs
- NeedModal
- SaveStatus

## Dependencies
- react (useEffect, useRef, useState)
- ../../lib/AppShell
- ../../lib/Markdown
- ../../lib/RichTextEditor
- ../../lib/gearService (subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS)

## Open questions
- Where is gearService implementation located and what backend/database does it use?
- What is the shape of the remote gear data returned by subscribeToGear?
- How does BAND_MEMBERS list get populated?
- Are there permission checks to prevent non-band members from editing gear?
- What triggers a re-render when other users modify gear concurrently?
