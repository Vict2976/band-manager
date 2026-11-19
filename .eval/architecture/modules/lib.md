# Module: lib

Provides core shared services, client/server authentication, Firestore data access for events, gear, and stand-ins, iCalendar generation, rich text/markdown UI components, and the application shell layout.

## Key files
- `lib/AppShell.tsx`: Top-level responsive navigation shell with authentication gating and chat widget inclusion.
- `lib/auth.tsx`: React authentication context and provider wrapping Firebase client auth with persistent session management.
- `lib/firebase.ts`: Client Firebase app initialization and persistence configuration.
- `lib/firebaseAdmin.ts`: Server-side Firebase Admin SDK initialization using service account credentials.
- `lib/verifyIdToken.ts`: Native Node crypto-based Firebase ID token JWT verification without ESM dependencies.
- `lib/eventService.ts`: Firestore service for querying, creating, updating, and deleting band calendar events.
- `lib/gearService.ts`: Firestore operations for shared band gear documents and per-member gear need notes.
- `lib/standinService.ts`: Firestore service for managing the shared band stand-ins list.
- `lib/calendarFeedService.ts`: Generates, rotates, and fetches calendar feed subscription tokens.
- `lib/ics.ts`: RFC 5545 iCalendar feed builder for calendar synchronization.
- `lib/ChatWidget.tsx`: Floating AI band assistant chat interface with streaming SSE support.
- `lib/EventModal.tsx`: Modal dialog for viewing, creating, editing, and deleting events.
- `lib/SharedNotes.tsx`: Debounced auto-saving markdown and rich text editor for shared band notes.
- `lib/RichTextEditor.tsx`: Markdown-powered text area with inline formatting and list shortcut tools.
- `lib/Markdown.tsx`: Client markdown renderer using react-markdown and remark-gfm.
- `lib/CalendarSync.tsx`: Component for sharing and managing webcal and Google Calendar subscription links.
- `lib/sessionService.ts`: Cookie-based session persistence helper.
- `lib/eventText.ts`: Text parsing utilities for extracting titles and normalising event date strings.

## Public interface
- AppShell({ children })
- AuthProvider({ children })
- useAuth(): AuthContextType
- subscribeToEvents(onChange, onError): () => void
- subscribeToEvent(id, onChange, onError): () => void
- createEvent(data: NewEvent): Promise<void>
- updateEvent(id: string, data: NewEvent): Promise<void>
- deleteEvent(id: string): Promise<void>
- subscribeToGear(onChange, onError): () => void
- saveGear(text: string): Promise<void>
- subscribeToNeeds(onChange, onError): () => void
- saveNeed(member: string, text: string): Promise<void>
- BAND_MEMBERS: readonly string[]
- subscribeToStandins(onChange, onError): () => void
- saveStandins(text: string): Promise<void>
- getOrCreateFeedToken(): Promise<string>
- rotateFeedToken(): Promise<string>
- feedUrl(token: string, origin: string): string
- buildCalendar(events, opts): string
- verifyIdToken(token: string): Promise<string>
- adminDb(): Firestore
- sessionService.setSession(user, rememberMe)
- sessionService.getSession()
- sessionService.clearSession()
- sessionService.isAuthenticated(): boolean
- sessionService.getUser(): SessionUser | null
- ChatWidget()
- CalendarSync()
- EventModal({ date, event, onClose, onDeleted, initialMode })
- SharedNotes({ title, subtitle, placeholder, emptyLabel, subscribe, save })
- RichTextEditor({ value, onChange, placeholder, minHeight, autoFocus, grow })
- Markdown({ children, className })
- resolveTitle(title, text, type): string
- normalizeDate(raw): string

## Dependencies
- react
- react-dom
- next/navigation
- next/link
- firebase/app
- firebase/auth
- firebase/firestore
- firebase-admin/app
- firebase-admin/firestore
- js-cookie
- react-markdown
- remark-gfm
- crypto
- fs
- path

## AI touchpoints [AI]
- `lib/ChatWidget.tsx`

## Open questions
- _none_
