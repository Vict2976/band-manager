# Module: app

Serves as the root UI shell and main calendar view for the Band Manager application, providing global page metadata, font configuration, authentication wrapping, and interactive monthly event scheduling.

## Key files
- `app/layout.tsx`: Defines root layout, global styles, metadata, PWA headers, and wraps the app in AuthProvider.
- `app/page.tsx`: Implements the main calendar page component, rendering a monthly date grid and managing event selection, navigation, and modal triggers.

## Public interface
- export const metadata: Metadata
- export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element
- export default function CalendarPage(): JSX.Element

## Dependencies
- next
- next/font/google
- next/link
- react
- ./globals.css
- ../lib/auth
- ../lib/AppShell
- ../lib/Markdown
- ../lib/EventModal
- ../lib/CalendarSync
- ../lib/eventService

## Open questions
- app/page.tsx is truncated, obscuring the remainder of the event card actions, Legend component, and modal integration logic.
