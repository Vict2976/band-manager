# Module: app/api

Serves the band's gig and rehearsal schedule as a subscribable iCalendar (.ics) feed, so members can see upcoming gigs in their phone calendar. The route handler authenticates the request with a secret token stored in Firestore (config/calendarFeed), reads all events from the Firestore 'events' collection at request time, drops entries with malformed dates, and returns an ICS document with short CDN caching.

## Key files
- `app/api/calendar/[token]/route.ts`: Next.js dynamic route handler (GET) that validates the feed token with a constant-time compare, loads events via the Firebase Admin SDK, maps them to IcsEvent objects, and responds with text/calendar built by buildCalendar.

## Public interface
- GET /api/calendar/[token] (token may carry a trailing .ics) → text/calendar response; 404 on missing/wrong token, 503 if admin credentials are unavailable
- export const dynamic = 'force-dynamic'
- export const runtime = 'nodejs'

## Dependencies
- next/server (NextRequest)
- ../../../../lib/firebaseAdmin (adminDb)
- ../../../../lib/ics (buildCalendar, IcsEvent)
- ../../../../lib/eventText (resolveTitle, normalizeDate, isDateKey)
- Firestore documents: config/calendarFeed (token), events collection

## Open questions
- How is the token in config/calendarFeed generated and rotated, and who can read that document (Firestore rules)?
- Is the feed name 'Band Manager' and refreshMinutes=15 intended to be configurable per band/deployment?
- Are events with status 'pending' meant to appear in subscribers' calendars, or should only confirmed gigs be exported?
- Does buildCalendar in lib/ics handle timezone/all-day semantics when 'time' is absent?
