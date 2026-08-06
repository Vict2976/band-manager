# Design system components

Each component is cross-referenced to the code via its `@uxid` identifier.

| @uxid | component | file | notes |
| --- | --- | --- | --- |
| `app/events/[id]/page::EventPage` | EventPage | `app/events/[id]/page.tsx` | Dynamic route entry for a single event detail page. |
| `app/events/[id]/page::EventDetail` | EventDetail | `app/events/[id]/page.tsx` | Detailed presentation of a single event's information. |
| `app/gear/page::GearPage` | GearPage | `app/gear/page.tsx` | Gear route entry composing the gear management view. |
| `app/gear/page::GearOverview` | GearOverview | `app/gear/page.tsx` | Summary overview of gear items and their status. |
| `app/gear/page::SaveStatus` | SaveStatus | `app/gear/page.tsx` | Indicator communicating save/persistence state of gear edits. |
| `app/gear/page::Needs` | Needs | `app/gear/page.tsx` | List of gear needs requiring attention or fulfillment. |
| `app/gear/page::NeedModal` | NeedModal | `app/gear/page.tsx` | Modal dialog for creating or editing a gear need. |
| `app/layout::RootLayout` | RootLayout | `app/layout.tsx` | Top-level HTML document layout that establishes global theme tokens and wraps all pages. |
| `app/login/page::LoginPage` | LoginPage | `app/login/page.tsx` | Login route entry that renders the authentication form. |
| `app/page::CalendarPage` | CalendarPage | `app/page.tsx` | Calendar route entry composing the calendar view. |
| `app/page::Calendar` | Calendar | `app/page.tsx` | Grid calendar rendering events across dates. |
| `app/page::EventBody` | EventBody | `app/page.tsx` | Renders the inline body/summary of an event within a calendar cell. |
| `app/page::Legend` | Legend | `app/page.tsx` | Color-coded legend keying event categories to accent colors. |
| `app/upcoming/page::UpcomingPage` | UpcomingPage | `app/upcoming/page.tsx` | Upcoming route entry composing the upcoming list view. |
| `app/upcoming/page::Upcoming` | Upcoming | `app/upcoming/page.tsx` | List of upcoming events ordered chronologically. |
| `lib/AppShell::AppShell` | AppShell | `lib/AppShell.tsx` | Persistent application shell providing navigation chrome around routed page content. |
| `lib/AppShell::CalendarIcon` | CalendarIcon | `lib/AppShell.tsx` | Navigation icon for the calendar section within the app shell. |
| `lib/AppShell::ClockIcon` | ClockIcon | `lib/AppShell.tsx` | Navigation icon representing upcoming/time-based views. |
| `lib/AppShell::GearIcon` | GearIcon | `lib/AppShell.tsx` | Navigation icon for the gear section within the app shell. |
| `lib/EventModal::EventModal` | EventModal | `lib/EventModal.tsx` | Modal dialog for viewing or editing event details. |
| `lib/Markdown::Markdown` | Markdown | `lib/Markdown.tsx` | Renderer converting markdown source into formatted content. |
| `lib/RichTextEditor::RichTextEditor` | RichTextEditor | `lib/RichTextEditor.tsx` | Editable rich-text input for authoring formatted content. |
| `lib/auth::AuthProvider` | AuthProvider | `lib/auth.tsx` | Context provider supplying authentication state to descendant components. |
