# Module: lib

Shared library for the Band Manager: the app shell with the four tabs (Calendar, Upcoming, Gear, Stand-ins), the single shared band login and session handling, Firestore services for gigs/rehearsals (events), the shared Gear text, per-member What to bring notes and the Stand-ins list, plus the calendar Subscription machinery (feed token, iCalendar generation with a (TBC) suffix for events still being figured out) and reusable UI pieces (event modal, markdown renderer, rich-text editor, shared notes editor).

## Key files
- `lib/AppShell.tsx`: Authenticated layout: top bar with desktop tabs, mobile bottom nav for the four tabs, redirect to /login when unauthenticated, guarded Sign out button.
- `lib/auth.tsx`: AuthProvider/useAuth React context wrapping Firebase email+password sign-in, mirrors state into the session cookie and clears stale cookies on sign-out.
- `lib/sessionService.ts`: js-cookie based session store (band_manager_auth / band_manager_user cookies, 400-day rolling expiry).
- `lib/firebase.ts`: Client Firebase init from NEXT_PUBLIC_FIREBASE_* env vars; exports db, auth and authPersistenceReady (pins IndexedDB/localStorage persistence).
- `lib/firebaseAdmin.ts`: Server-side firebase-admin Firestore (adminDb) for the calendar feed route; loads credentials from FIREBASE_SERVICE_ACCOUNT or a local service-account JSON.
- `lib/eventService.ts`: Firestore 'events' collection: BandEvent types, real-time subscribeToEvents/subscribeToEvent, createEvent/updateEvent/deleteEvent; defaults legacy records to confirmed.
- `lib/eventText.ts`: Dependency-free helpers: resolveTitle (title, else first line of details, else type), firstLine, isDateKey, normalizeDate for legacy ISO timestamps.
- `lib/EventModal.tsx`: View/edit/create modal for a gig or rehearsal with type, status (Being figured out / Confirmed), title, date, time, markdown text; exports TYPE_COLOR, STATUS_META, StatusBadge; links to the Full page at /events/{id}.
- `lib/calendarFeedService.ts`: Stores an unguessable feed token in Firestore config/calendarFeed; getOrCreateFeedToken, rotateFeedToken, feedUrl ({origin}/api/calendar/{token}.ics).
- `lib/CalendarSync.tsx`: 'Sync to your phone' UI: shows/copies the subscription link, webcal:// and Google Calendar shortcuts, platform instructions, and a 'Make a new link' rotation with confirm.
- `lib/ics.ts`: RFC 5545 iCalendar builder: Europe/Copenhagen VTIMEZONE, default durations (gig 3h, rehearsal 2h), all-day fallback, '(TBC)' suffix and TENTATIVE status for pending, stable UIDs, SEQUENCE bumping, UTF-8-safe line folding.
- `lib/gearService.ts`: Shared gear text (gear/shared) and per-member What to bring notes (gearNeeds/{name}) with fixed BAND_MEMBERS roster.
- `lib/standinService.ts`: Single shared stand-ins free-text document (standins/shared) with real-time subscribe and save.
- `lib/SharedNotes.tsx`: Generic shared markdown document component: subscribe/save props, in-place editing, 700ms debounced autosave with Saving/Saved status, flush on unmount.
- `lib/Markdown.tsx`: react-markdown + remark-gfm renderer with links opening in new tabs.
- `lib/RichTextEditor.tsx`: Textarea with markdown toolbar (bold, italic, heading, bullet/numbered list) and ⌘B/⌘I shortcuts, preserving selection across edits.

## Public interface
- AppShell (default) — lib/AppShell.tsx
- AuthProvider, useAuth — lib/auth.tsx
- sessionService, SessionUser — lib/sessionService.ts
- db, auth, authPersistenceReady, default app — lib/firebase.ts
- adminDb — lib/firebaseAdmin.ts
- EventType, EventStatus, BandEvent, NewEvent, subscribeToEvents, subscribeToEvent, createEvent, updateEvent, deleteEvent — lib/eventService.ts
- firstLine, resolveTitle, isDateKey, normalizeDate — lib/eventText.ts
- EventModal (default), StatusBadge, TYPE_COLOR, STATUS_META — lib/EventModal.tsx
- getOrCreateFeedToken, rotateFeedToken, feedUrl — lib/calendarFeedService.ts
- CalendarSync (default) — lib/CalendarSync.tsx
- TIMEZONE, IcsEvent, titleFor, buildCalendar — lib/ics.ts
- subscribeToGear, saveGear, BAND_MEMBERS, subscribeToNeeds, saveNeed — lib/gearService.ts
- subscribeToStandins, saveStandins — lib/standinService.ts
- SharedNotes (default) — lib/SharedNotes.tsx
- Markdown (default) — lib/Markdown.tsx
- RichTextEditor (default) — lib/RichTextEditor.tsx

## Dependencies
- react
- react-dom (createPortal)
- next/navigation, next/link
- firebase/app, firebase/auth, firebase/firestore
- firebase-admin/app, firebase-admin/firestore
- js-cookie
- react-markdown
- remark-gfm
- Node fs/path (server-side credential loading)
- Env vars: NEXT_PUBLIC_FIREBASE_* (client), FIREBASE_SERVICE_ACCOUNT (server), NODE_ENV
- Routes referenced but not in this module: /login, /events/{id}, /api/calendar/{token}.ics, /, /upcoming, /gear, /standins

## Open questions
- lib/EventModal.tsx is truncated in the provided files; the full edit form and view body (status toggle, date/time fields, save/delete buttons) are not visible.
- The /api/calendar/[token].ics route that consumes adminDb and buildCalendar is not part of this module, so how the token is verified and the Firestore 'events' are mapped to IcsEvent is not shown here.
- lib/sessionService.ts cookies mark authentication client-side only; no middleware or server check is visible, so the cookie appears to serve the initial-render flash rather than security.
- The 'What to bring' roster is hardcoded in BAND_MEMBERS (lib/gearService.ts); adding or removing a band member requires a code change.
- Stand-ins are a single free-text document (lib/standinService.ts); grouping by instrument is left to how the band writes the text rather than enforced by structure.
- lib/firebaseAdmin.ts scans the repo root for any *-firebase-adminsdk-*.json file in local development; confirm this never runs in a deployed environment with unexpected files.
