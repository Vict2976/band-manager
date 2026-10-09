# Module: app/api

Serves the band's read-only calendar Subscription: a token-protected iCalendar (.ics) feed of every gig and rehearsal, built from Firestore at request time so members' phone calendars keep themselves up to date without copying anything by hand. Pending events are flagged via status so the calendar builder can mark them as not yet confirmed; events with unusable dates are skipped so one bad entry does not break the whole feed for a calendar client.

## Key files
- `app/api/calendar/[token]/route.ts`: Next.js route handler (GET) for /api/calendar/[token]. Strips an optional .ics suffix, validates the token against config/calendarFeed in Firestore using a constant-time compare, loads all events ordered by date, normalizes them into IcsEvent objects (type gig/rehearsal, status pending/confirmed, resolved title, normalized date, time, text, updatedAt), filters out malformed dates, and returns the ICS text with text/calendar headers and short CDN caching. Forces dynamic rendering and the nodejs runtime.

## Public interface
- GET /api/calendar/[token] (optionally with .ics suffix) -> text/calendar body; 404 for missing/invalid token, 503 if admin credentials are unavailable
- export const dynamic = 'force-dynamic'
- export const runtime = 'nodejs'

## Dependencies
- next/server (NextRequest)
- lib/firebaseAdmin (adminDb) — Firestore Admin access
- lib/ics (buildCalendar, IcsEvent) — ICS generation
- lib/eventText (resolveTitle, normalizeDate, isDateKey) — title/date helpers
- Firestore documents: config/calendarFeed (token), collection events

## Open questions
- How is the config/calendarFeed token generated and rotated, and where does the app surface the subscription link to members?
- buildCalendar in lib/ics is expected to render the (TBC) suffix for pending events and honor refreshMinutes; this file does not show that behavior.
- Does the feed intentionally include past events (all events are fetched with no date lower bound)?
- Events lacking a status are treated as confirmed; confirm this matches the app's 'being figured out' default for newly added gigs.
