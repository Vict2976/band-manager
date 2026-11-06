# Module: lib

Core client and server library providing authentication, state persistence, Firestore database operations (events, gear, stand-ins, calendar feed config), iCalendar RFC 5545 generation, and shared UI components (AppShell, modal dialogs, Markdown viewers, rich text editors).

## Key files
- `lib/firebase.ts`: Initializes client-side Firebase app, Firestore, Auth, and configures persistent authentication storage
- `lib/firebaseAdmin.ts`: Initializes server-side Firebase Admin SDK Firestore instance using service account credentials
- `lib/auth.tsx`: Provides AuthProvider React context, Firebase authentication state listener, and sign-in/sign-out logic
- `lib/sessionService.ts`: Manages browser cookies for persistent session identification across page loads
- `lib/eventService.ts`: Manages Firestore subscriptions and CRUD operations for gig and rehearsal events
- `lib/calendarFeedService.ts`: Manages generation and rotation of unguessable calendar feed access tokens in Firestore
- `lib/ics.ts`: Generates RFC 5545 compliant iCalendar (.ics) feed strings with timezone support and line folding
- `lib/gearService.ts`: Provides Firestore subscriptions and updates for shared band gear notes and per-member needs
- `lib/standinService.ts`: Provides Firestore subscriptions and updates for the shared substitute/stand-in musician list
- `lib/AppShell.tsx`: App layout shell component with responsive navigation bars, route protection, and sign-out controls
- `lib/EventModal.tsx`: Portal-based modal for creating, editing, and deleting calendar events
- `lib/RichTextEditor.tsx`: Markdown-formatting textarea with keyboard shortcuts and toolbar controls
- `lib/SharedNotes.tsx`: Generic auto-saving markdown document editor component
- `lib/Markdown.tsx`: Markdown renderer component utilizing react-markdown and remark-gfm
- `lib/CalendarSync.tsx`: UI component with instructions, webcal triggers, and copyable links for calendar subscription
- `lib/eventText.ts`: Helper utilities for parsing fallback titles and normalizing event dates

## Public interface
- AuthProvider ({ children }) and useAuth()
- AppShell ({ children })
- EventModal ({ date, event, onClose, onDeleted, initialMode })
- StatusBadge ({ status, compact })
- CalendarSync ()
- SharedNotes ({ title, subtitle, placeholder, emptyLabel, subscribe, save })
- RichTextEditor ({ value, onChange, placeholder, minHeight, autoFocus, grow })
- Markdown ({ children, className })
- subscribeToEvents(onChange, onError)
- subscribeToEvent(id, onChange, onError)
- createEvent(data)
- updateEvent(id, data)
- deleteEvent(id)
- subscribeToGear(onChange, onError)
- saveGear(text)
- subscribeToNeeds(onChange, onError)
- saveNeed(member, text)
- BAND_MEMBERS
- subscribeToStandins(onChange, onError)
- saveStandins(text)
- getOrCreateFeedToken()
- rotateFeedToken()
- feedUrl(token, origin)
- buildCalendar(events, opts)
- titleFor(e)
- adminDb()
- sessionService
- db
- auth
- authPersistenceReady
- resolveTitle(title, text, type)
- firstLine(text)
- normalizeDate(raw)
- isDateKey(s)

## Dependencies
- react
- react-dom
- next/navigation
- next/link
- firebase/app
- firebase/firestore
- firebase/auth
- firebase-admin/app
- firebase-admin/firestore
- js-cookie
- react-markdown
- remark-gfm
- fs
- path

## Open questions
- _none_
