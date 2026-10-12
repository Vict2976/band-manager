# Components

Every row is an applied `// @uxid` identifier. Ids are path-derived and permanent.

| identifier | file | flow | type | description |
| --- | --- | --- | --- | --- |
| `app/events/[id]/page::EventDetail` | app/events/[id]/page.tsx | all | component | Function component. Hooks: useParams, useRouter, useState, useEffect. Renders: div, p, span, article, h1, button, Link, StatusBadge, +2 more. |
| `app/events/[id]/page::EventPage` | app/events/[id]/page.tsx | all | component | Function component. Renders: AppShell, EventDetail. |
| `app/gear/page::GearOverview` | app/gear/page.tsx | all | component | Function component. Renders: SharedNotes. |
| `app/gear/page::GearPage` | app/gear/page.tsx | all | component | Function component. Renders: div, AppShell, GearOverview, Needs. |
| `app/gear/page::NeedModal` | app/gear/page.tsx | all | component | Function component. Props: member, initial, onClose. Hooks: useState. Renders: div, h3, p, textarea, button. |
| `app/gear/page::Needs` | app/gear/page.tsx | all | component | Function component. Hooks: useState, useEffect. Renders: section, div, h2, p, button, span, NeedModal. |
| `app/layout::RootLayout` | app/layout.tsx | all | component | Function component. Props: children. Renders: html, head, link, meta, body, AuthProvider. |
| `app/login/page::LoginPage` | app/login/page.tsx | all | component | Function component. Hooks: useState, useAuth, useRouter, useEffect. Renders: div, h1, p, form, label, span. |
| `app/page::Calendar` | app/page.tsx | all | component | Function component. Hooks: useState, useEffect, useMemo. Renders: div, section, h1, span, button, h2, Legend, StatusBadge, +4 more. |
| `app/page::CalendarPage` | app/page.tsx | all | component | Function component. Renders: AppShell, Calendar. |
| `app/page::EventBody` | app/page.tsx | all | component | Function component. Props: text, eventId. Hooks: useRef, useState, useEffect. Renders: div, Markdown, Link. |
| `app/page::Legend` | app/page.tsx | all | component | Function component. Renders: div, span. |
| `app/standins/page::StandinsPage` | app/standins/page.tsx | all | component | Function component. Renders: AppShell, SharedNotes. |
| `app/upcoming/page::Upcoming` | app/upcoming/page.tsx | all | component | Function component. Hooks: useState, useEffect, useMemo. Renders: div, h1, p, ul, li, button, Link, StatusBadge, +1 more. |
| `app/upcoming/page::UpcomingPage` | app/upcoming/page.tsx | all | component | Function component. Renders: AppShell, Upcoming. |
| `lib/AppShell::AppShell` | lib/AppShell.tsx | all | component | Function component. Props: children. Hooks: useAuth, useRouter, usePathname, useEffect. Renders: div, header, span, nav, button, main, Link, Icon. |
| `lib/AppShell::CalendarIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, rect, path. |
| `lib/AppShell::ClockIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::GearIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::PeopleIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/auth::AuthProvider` | lib/auth.tsx | all | component | Function component. Props: children. Hooks: useState, useEffect. Renders: AuthContext.Provider. |
| `lib/CalendarSync::CalendarSync` | lib/CalendarSync.tsx | all | component | Function component. Hooks: useState, useEffect. Renders: section, button, span, svg, path, div. |
| `lib/EventModal::EventModal` | lib/EventModal.tsx | all | component | Function component. Props: date, event, onClose, onDeleted, initialMode. Hooks: useState. Renders: div, h3, svg, path, button, label, Link, RichTextEditor, +2 more. |
| `lib/EventModal::StatusBadge` | lib/EventModal.tsx | all | component | Function component. Props: status, compact. Renders: span. |
| `lib/Markdown::Markdown` | lib/Markdown.tsx | all | component | Function component. Props: children, className. Renders: div, a, ReactMarkdown. |
| `lib/RichTextEditor::RichTextEditor` | lib/RichTextEditor.tsx | all | component | Function component. Props: value, onChange, placeholder, minHeight, autoFocus, grow. Hooks: useRef, useEffect. Renders: strong, em, div, button, textarea. |
| `lib/SharedNotes::SaveStatus` | lib/SharedNotes.tsx | all | component | Function component. Props: status. Renders: span. |
| `lib/SharedNotes::SharedNotes` | lib/SharedNotes.tsx | all | component | Function component. Props: title, subtitle, placeholder, emptyLabel, subscribe, save. Hooks: useState, useRef, useEffect. Renders: section, div, h1, p, button, SaveStatus, RichTextEditor, Markdown. |

## Coverage

- all: 28 identifier(s)

## Design system components

28 component(s) carry a stable `@uxid`. 2 declare variants (2 axis/axes, 5 value(s) in total), read from `cva()` calls, class maps, prop unions and conditional class branches.

| @uxid | component | file | variants | states | uses | notes |
| --- | --- | --- | --- | --- | --- | --- |
| "app/events/[id]/page::EventPage" | EventPage | `app/events/[id]/page.tsx` |  | hover | 0 | Route page for a single event, addressed by its id. |
| "app/events/[id]/page::EventDetail" | EventDetail | `app/events/[id]/page.tsx` |  | hover | 0 | Shows the details of a single event within the event page. |
| "app/gear/page::GearPage" | GearPage | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Route page for the gear section. |
| "app/gear/page::GearOverview" | GearOverview | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Overview content for the gear section. |
| "app/gear/page::Needs" | Needs | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Lists gear needs on the gear page. |
| "app/gear/page::NeedModal" | NeedModal | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Modal dialog for working with a single gear need. |
| "app/layout::RootLayout" | RootLayout | `app/layout.tsx` |  |  | 0 | Root layout that wraps every page of the app. |
| "app/login/page::LoginPage" | LoginPage | `app/login/page.tsx` |  | disabled | 0 | Login screen for signing into the app. |
| "app/page::CalendarPage" | CalendarPage | `app/page.tsx` |  | hover | 0 | Home route that hosts the calendar view. |
| "app/page::Calendar" | Calendar | `app/page.tsx` |  | hover | 0 | Calendar view that displays events. |
| "app/page::EventBody" | EventBody | `app/page.tsx` |  | hover | 0 | Renders an event's content inside the calendar. |
| "app/page::Legend" | Legend | `app/page.tsx` |  | hover | 0 | Legend that explains the calendar's visual coding. |
| "app/standins/page::StandinsPage" | StandinsPage | `app/standins/page.tsx` |  |  | 0 | Route page for the stand-ins section. |
| "app/upcoming/page::UpcomingPage" | UpcomingPage | `app/upcoming/page.tsx` |  | hover | 0 | Route page for upcoming events. |
| "app/upcoming/page::Upcoming" | Upcoming | `app/upcoming/page.tsx` |  | hover | 0 | List of upcoming events. |
| "lib/AppShell::AppShell" | AppShell | `lib/AppShell.tsx` |  | hover | 5 | Shared application shell that provides navigation around page content. |
| "lib/AppShell::CalendarIcon" | CalendarIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the calendar section. |
| "lib/AppShell::ClockIcon" | ClockIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon used in the app shell, likely for upcoming events. |
| "lib/AppShell::GearIcon" | GearIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the gear section. |
| "lib/AppShell::PeopleIcon" | PeopleIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon used in the app shell, likely for stand-ins. |
| "lib/CalendarSync::CalendarSync" | CalendarSync | `lib/CalendarSync.tsx` |  | hover | 1 | Component for syncing the calendar. |
| "lib/EventModal::StatusBadge" | StatusBadge | `lib/EventModal.tsx` | initialMode (2) | disabled, hover | 3 | Badge that shows an event's status. |
| "lib/EventModal::EventModal" | EventModal | `lib/EventModal.tsx` |  | disabled, hover | 2 | Modal dialog for viewing or editing an event. |
| "lib/Markdown::Markdown" | Markdown | `lib/Markdown.tsx` |  |  | 5 | Renders Markdown content. |
| "lib/RichTextEditor::RichTextEditor" | RichTextEditor | `lib/RichTextEditor.tsx` |  |  | 2 | Rich text editing input. |
| "lib/SharedNotes::SharedNotes" | SharedNotes | `lib/SharedNotes.tsx` | status (3) | hover, placeholder | 2 | Collaborative notes area that is shared between users. |
| "lib/SharedNotes::SaveStatus" | SaveStatus | `lib/SharedNotes.tsx` |  | hover, placeholder | 0 | Indicator that shows the save state of the shared notes. |
| "lib/auth::AuthProvider" | AuthProvider | `lib/auth.tsx` |  |  | 1 | Provides authentication context to the app. |

### Variants, in full

#### StatusBadge (`lib/EventModal.tsx`:31)

| axis | value | classes | call sites |
| --- | --- | --- | --- |
| `initialMode` | `view` | _declared by the prop type only_ | 0 |
| `initialMode` | `edit` | _declared by the prop type only_ | 0 |

States targeted in this file: `disabled`, `hover`

1 conditional class branch(es) in this file are not a named variant.

Rendered 3 time(s) in 3 other file(s).

#### SharedNotes (`lib/SharedNotes.tsx`:12)

| axis | value | classes | call sites |
| --- | --- | --- | --- |
| `status` | `idle` | _declared by the prop type only_ | 0 |
| `status` | `saving` | _declared by the prop type only_ | 0 |
| `status` | `saved` | _declared by the prop type only_ | 0 |

States targeted in this file: `hover`, `placeholder`

Rendered 2 time(s) in 2 other file(s).
