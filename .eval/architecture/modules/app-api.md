# Module: app/api

Serves the read-only ICS calendar feed that band members subscribe to, turning the app's gigs and rehearsals in Firestore into a live calendar feed matching the band's naming, timing, and confirmation rules.

## Key files
- `app/api/calendar/[token]/route.ts`: Next.js route handler that validates the per-band calendar token, reads events from Firestore, and streams back a dynamically generated ICS calendar feed

## Public interface
- GET /api/calendar/[token] — returns a text/calendar ICS feed for a valid token, or 404/503 on failure

## Dependencies
- lib/firebaseAdmin
- lib/ics
- lib/eventText

## Open questions
- Where is the token in config/calendarFeed generated/rotated (the 'Make a new link' action) — not shown in this module
- How do lib/ics and lib/eventText implement the '(TBC)' suffix, 3-hour/2-hour blocking, and all-day export rules referenced here
- Is there a corresponding UI (e.g. 'Sync to your phone' screen) that surfaces this token, not included in this module
