# Module: lib

Shared client and server library for the band's gig/rehearsal app: Firebase client initialisation and durable auth persistence, a cookie-backed session plus React auth context, Firestore services for events, shared gear notes, per-member gear needs and the shared stand-in list, the iCalendar (RFC 5545) feed builder and its token-secured subscription URL, a server-side firebase-admin Firestore accessor for the feed route, and the UI shell/components (tab navigation, event modal, markdown rendering/editing, autosaving shared notes, calendar sync panel).

## Key files
- `lib/firebase.ts`: Initialises the Firebase app, exports `db` (Firestore) and `auth`, and pins auth persistence to IndexedDB with localStorage fallback via `authPersistenceReady`.
- `lib/auth.tsx`: `AuthProvider`/`useAuth` React context: email+password sign-in/out via Firebase Auth, mirrors auth state into the session cookie, exposes `isAuthenticated`/`loading`.
- `lib/sessionService.ts`: js-cookie wrapper storing `band_manager_auth` and `band_manager_user` cookies (400-day rolling expiry) with get/set/clear helpers.
- `lib/AppShell.tsx`: Authenticated layout: redirects to /login when unauthenticated, renders header, desktop tabs and mobile bottom nav for Calendar, Upcoming, Gear and Stand-ins, with a confirmed sign-out button.
- `lib/eventService.ts`: Firestore `events` collection: `BandEvent` type (gig/rehearsal, confirmed/pending), real-time subscriptions, create/update/delete, legacy status/date normalisation.
- `lib/eventText.ts`: Dependency-free helpers (`resolveTitle`, `firstLine`, `normalizeDate`, `isDateKey`) shared by the app and the calendar feed route to derive titles and clean legacy date values.
- `lib/EventModal.tsx`: Portal modal to view/create/edit/delete an event with unsaved-change guards; exports `StatusBadge`, `TYPE_COLOR`, `STATUS_META`.
- `lib/ics.ts`: Builds the iCalendar feed (`buildCalendar`, `titleFor`, `IcsEvent`, `TIMEZONE`) with Europe/Copenhagen VTIMEZONE, default durations, TENTATIVE/CONFIRMED status, UTF-8-safe line folding and refresh TTL.
- `lib/calendarFeedService.ts`: Reads/creates/rotates the unguessable feed token in Firestore `config/calendarFeed` and formats the /api/calendar/{token}.ics URL.
- `lib/CalendarSync.tsx`: 'Sync to your phone' panel: shows the subscription URL, copy button, webcal and Google Calendar links, setup instructions and a 'make a new link' token rotation.
- `lib/firebaseAdmin.ts`: Server-side `adminDb()` using firebase-admin credentials from `FIREBASE_SERVICE_ACCOUNT` (raw or base64) or a local service-account JSON file; used by the calendar feed route.
- `lib/gearService.ts`: Shared gear document (`gear/shared`) plus per-member `gearNeeds` notes keyed by the hardcoded `BAND_MEMBERS` roster.
- `lib/standinService.ts`: Shared free-text stand-in list in Firestore `standins/shared` with subscribe/save.
- `lib/SharedNotes.tsx`: Generic markdown notes section with edit toggle, debounced autosave (700ms), save status indicator and flush-on-unmount.
- `lib/RichTextEditor.tsx`: Textarea with markdown toolbar (bold, italic, heading, bullet/numbered list) and ⌘B/⌘I shortcuts, preserving selection across edits.
- `lib/Markdown.tsx`: Renders markdown with react-markdown + remark-gfm, links opened in new tab with rel=noopener.

## Public interface
- AppShell (default) — lib/AppShell.tsx
- AuthProvider, useAuth — lib/auth.tsx
- sessionService, SessionUser — lib/sessionService.ts
- db, auth, authPersistenceReady, default app — lib/firebase.ts
- adminDb — lib/firebaseAdmin.ts
- subscribeToEvents, subscribeToEvent, createEvent, updateEvent, deleteEvent, BandEvent, NewEvent, EventType, EventStatus — lib/eventService.ts
- firstLine, resolveTitle, isDateKey, normalizeDate — lib/eventText.ts
- EventModal (default), StatusBadge, TYPE_COLOR, STATUS_META — lib/EventModal.tsx
- buildCalendar, titleFor, IcsEvent, TIMEZONE — lib/ics.ts
- getOrCreateFeedToken, rotateFeedToken, feedUrl — lib/calendarFeedService.ts
- CalendarSync (default) — lib/CalendarSync.tsx
- subscribeToGear, saveGear, subscribeToNeeds, saveNeed, BAND_MEMBERS — lib/gearService.ts
- subscribeToStandins, saveStandins — lib/standinService.ts
- SharedNotes (default) — lib/SharedNotes.tsx
- RichTextEditor (default) — lib/RichTextEditor.tsx
- Markdown (default) — lib/Markdown.tsx

## Dependencies
- next (next/navigation, next/link)
- react
- react-dom (createPortal)
- firebase (firebase/app, firebase/auth, firebase/firestore)
- firebase-admin (firebase-admin/app, firebase-admin/firestore)
- js-cookie
- react-markdown
- remark-gfm
- node:fs, node:path, Buffer (server-only, lib/firebaseAdmin.ts and lib/ics.ts)

## Where the code disagrees with the stack profile
- `lib/firebaseAdmin.ts`: Server-side code is not confined to the route handler directory: lib/firebaseAdmin.ts uses node fs/path and firebase-admin (and lib/ics.ts uses Buffer) as server-only modules inside lib/, and the data layer is Firebase/Firestore rather than anything the stack block names.

## Open questions
- lib/EventModal.tsx is truncated in the provided source; the remainder of the edit/view UI (status/date/time fields, save/delete buttons) could not be reviewed.
- lib/gearService.ts hardcodes a nine-name BAND_MEMBERS roster; is this the current band and how is it kept in sync with who can sign in?
- No service in lib handles members marking whether they can play a gig; where (if anywhere) is availability/RSVP stored?
- lib/sessionService.ts cookies are client-set and never verified server-side; lib/AppShell.tsx gating relies on Firebase auth state, so what purpose does the cookie serve beyond avoiding a login flash?
- lib/calendarFeedService.ts writes the feed token from the client SDK — what Firestore security rules govern read/write of config/calendarFeed?
- lib/firebaseAdmin.ts scans process.cwd() for any *-firebase-adminsdk-*.json file; confirm this fallback is unreachable in production builds.
