# Module: lib

Core UI shell and event management library for a band scheduling application. Provides authentication context, event/gear CRUD operations via Firebase, rich text editing, markdown rendering, and responsive app layout with top/bottom navigation.

## Key files
- `lib/AppShell.tsx` — Main application layout wrapper with authenticated user detection, top navigation bar, mobile bottom tab bar, and route protection
- `lib/auth.tsx` — Firebase authentication context provider managing user login/logout and session persistence via cookies
- `lib/eventService.ts` — Firestore event CRUD operations and real-time subscriptions (gig/rehearsal events with date, time, details)
- `lib/firebase.ts` — Firebase app initialization and service exports (Firestore database and Auth)
- `lib/sessionService.ts` — Cookie-based session management for persisting user authentication state across page reloads

## Public interface
- AppShell
- AuthProvider
- useAuth
- subscribeToEvents
- subscribeToEvent
- createEvent
- updateEvent
- deleteEvent
- subscribeToGear
- saveGear
- subscribeToNeeds
- saveNeed
- sessionService
- Markdown
- RichTextEditor
- EventModal
- TYPE_COLOR

## Dependencies
- next/navigation
- next/link
- firebase/auth
- firebase/firestore
- js-cookie
- react-markdown
- remark-gfm

## Open questions
- EventModal.tsx appears truncated in the provided content—full edit/view mode UI and markdown rendering details are not visible
- How are calendar synchronization and timezone handling managed for event dates?
- Are there backend validation rules or permissions enforcement on Firestore event documents?
