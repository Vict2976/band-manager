# Module: app/api [AI]

Provides Next.js server route handlers for serving public/tokenized iCalendar (.ics) feeds of band events and providing an authenticated AI chat endpoint that answers band-related queries using current Firestore data.

## Key files
- `app/api/calendar/[token]/route.ts`: Exports a GET handler that validates a feed token against Firestore config and returns an iCalendar (.ics) formatted feed of band gigs and rehearsals.
- `app/api/chat/route.ts`: Exports a POST handler that verifies Firebase auth, aggregates band events, gear, and stand-in notes into a system prompt, and streams LLM chat completions from OpenRouter.

## Public interface
- GET /api/calendar/[token] (app/api/calendar/[token]/route.ts: GET)
- POST /api/chat (app/api/chat/route.ts: POST)

## Dependencies
- next/server
- lib/firebaseAdmin
- lib/ics
- lib/eventText
- lib/verifyIdToken

## AI touchpoints [AI]
- `app/api/chat/route.ts`

## Open questions
- _none_
