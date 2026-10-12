# Module: lib

Shared client/server library for the Band Manager app: authentication/session handling, the shared Firestore-backed data services for events, gear, and stand-ins, the UI shell and reusable components (calendar sync, event modal, rich text editor, markdown rendering, shared notes), and the iCalendar feed generation that lets the band's shared calendar ('Shared band calendar that syncs to phones') update automatically on subscribers' phones.

## Key files
- `lib/AppShell.tsx`: Authenticated app chrome: top bar, desktop tabs and mobile bottom nav across Calendar/Upcoming/Gear/Stand-ins, redirects unauthenticated users to /login, and handles sign-out.
- `lib/auth.tsx`: React auth context wrapping Firebase Auth; manages sign-in/sign-out and keeps a long-lived session cookie in sync with Firebase auth state.
- `lib/sessionService.ts`: Cookie-based session persistence (400-day expiry) storing minimal user info alongside Firebase auth.
- `lib/firebase.ts`: Client Firebase app/Firestore/Auth initialization, pinning auth persistence to IndexedDB/localStorage so sessions survive restarts.
- `lib/firebaseAdmin.ts`: Server-side Firestore access via Firebase Admin SDK, used by the unauthenticated calendar feed route.
- `lib/calendarFeedService.ts`: Generates and rotates the unguessable feed token used as the secret in the calendar subscription URL ('Make a new link' invalidates old subscriptions).
- `lib/CalendarSync.tsx`: The 'Sync to your phone' UI: shows the calendar link, Copy button, and iPhone/Mac Calendar and Google Calendar shortcuts, plus link rotation.
- `lib/ics.ts`: Builds the RFC 5545 iCalendar feed: applies 'Gig:'/'Rehearsal:' naming, '(TBC)' suffix for unconfirmed events, 3-hour gig/2-hour rehearsal blocks, all-day fallback, and description-as-notes.
- `lib/eventService.ts`: Firestore CRUD and real-time subscriptions for gig/rehearsal events, including status ('pending'/'confirmed') and title resolution.
- `lib/eventText.ts`: Derives a usable title and normalizes stored dates for events lacking explicit titles or with legacy timestamp-formatted dates.
- `lib/EventModal.tsx`: Create/view/edit modal for a single event, including the status badge ('Being figured out' vs 'Confirmed') and save/delete actions.
- `lib/gearService.ts`: Shared gear inventory text plus per-musician 'what to bring' notes keyed by a fixed band roster (BAND_MEMBERS).
- `lib/standinService.ts`: Shared free-text stand-in musician list, stored and synced via Firestore.
- `lib/SharedNotes.tsx`: Generic autosaving markdown notes editor/viewer reused for gear and stand-ins pages.
- `lib/RichTextEditor.tsx`: Lightweight markdown-authoring textarea with bold/italic/heading/list toolbar.
- `lib/Markdown.tsx`: Renders stored markdown text (event descriptions, gear/stand-in notes) with app styling and safe external links.

## Public interface
- AppShell (default export)
- AuthProvider, useAuth (lib/auth.tsx)
- sessionService (lib/sessionService.ts)
- auth, db, authPersistenceReady (lib/firebase.ts)
- adminDb (lib/firebaseAdmin.ts)
- getOrCreateFeedToken, rotateFeedToken, feedUrl (lib/calendarFeedService.ts)
- CalendarSync (default export)
- buildCalendar, titleFor, TIMEZONE, IcsEvent (lib/ics.ts)
- subscribeToEvents, subscribeToEvent, createEvent, updateEvent, deleteEvent, BandEvent, NewEvent, EventType, EventStatus (lib/eventService.ts)
- resolveTitle, firstLine, normalizeDate, isDateKey (lib/eventText.ts)
- EventModal (default export), StatusBadge, TYPE_COLOR, STATUS_META (lib/EventModal.tsx)
- subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS (lib/gearService.ts)
- subscribeToStandins, saveStandins (lib/standinService.ts)
- SharedNotes (default export)
- RichTextEditor (default export)
- Markdown (default export)

## Dependencies
- firebase/app
- firebase/auth
- firebase/firestore
- firebase-admin/app
- firebase-admin/firestore
- js-cookie
- react-markdown
- remark-gfm
- next/navigation
- next/link
- react-dom (createPortal)

## Open questions
- BAND_MEMBERS is a hardcoded roster of names in lib/gearService.ts — no file here shows how/where this list is maintained or kept in sync with actual band membership.
- lib/eventService.ts treats events lacking a status field as 'confirmed' for legacy reasons — unclear if any migration path exists versus this runtime inference persisting indefinitely.
- No file in this module shows how the calendar feed route (lib/firebaseAdmin.ts consumer) authenticates the token against lib/calendarFeedService.ts's stored value, since that route itself isn't included here.
