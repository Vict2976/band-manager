# Module: app/api

Provides an authenticated iCalendar (ICS) subscription endpoint that dynamically reads band events from Firestore and serves them in standard iCalendar format.

## Key files
- `app/api/calendar/[token]/route.ts`: Next.js dynamic route handler serving GET requests for the ICS calendar feed authenticated with a constant-time token check.

## Public interface
- GET(req: NextRequest, { params }: { params: Promise<{ token: string }> })
- export const dynamic = 'force-dynamic'
- export const runtime = 'nodejs'

## Dependencies
- next/server
- ../../../../lib/firebaseAdmin
- ../../../../lib/ics
- ../../../../lib/eventText

## Open questions
- _none_
