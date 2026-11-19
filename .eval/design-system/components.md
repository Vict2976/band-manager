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
| `lib/AppShell::AppShell` | lib/AppShell.tsx | all | component | Function component. Props: children. Hooks: useAuth, useRouter, usePathname, useEffect. Renders: div, header, span, nav, button, main, Link, ChatWidget, +1 more. |
| `lib/AppShell::CalendarIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, rect, path. |
| `lib/AppShell::ClockIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::GearIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::PeopleIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/auth::AuthProvider` | lib/auth.tsx | all | component | Function component. Props: children. Hooks: useState, useEffect. Renders: AuthContext.Provider. |
| `lib/CalendarSync::CalendarSync` | lib/CalendarSync.tsx | all | component | Function component. Hooks: useState, useEffect. Renders: section, button, span, svg, path, div. |
| `lib/ChatWidget::ChatWidget` | lib/ChatWidget.tsx | all | component | Function component. Hooks: useAuth, useState, useRef, useEffect. Renders: div, span, p, button, form, textarea, Markdown. |
| `lib/EventModal::EventModal` | lib/EventModal.tsx | all | component | Function component. Props: date, event, onClose, onDeleted, initialMode. Hooks: useState. Renders: div, h3, svg, path, button, label, Link, RichTextEditor, +2 more. |
| `lib/EventModal::StatusBadge` | lib/EventModal.tsx | all | component | Function component. Props: status, compact. Renders: span. |
| `lib/Markdown::Markdown` | lib/Markdown.tsx | all | component | Function component. Props: children, className. Renders: div, a, ReactMarkdown. |
| `lib/RichTextEditor::RichTextEditor` | lib/RichTextEditor.tsx | all | component | Function component. Props: value, onChange, placeholder, minHeight, autoFocus, grow. Hooks: useRef, useEffect. Renders: strong, em, div, button, textarea. |
| `lib/SharedNotes::SaveStatus` | lib/SharedNotes.tsx | all | component | Function component. Props: status. Renders: span. |
| `lib/SharedNotes::SharedNotes` | lib/SharedNotes.tsx | all | component | Function component. Props: title, subtitle, placeholder, emptyLabel, subscribe, save. Hooks: useState, useRef, useEffect. Renders: section, div, h1, p, button, SaveStatus, RichTextEditor, Markdown. |

## Coverage

- all: 115 identifier(s)

## Design system components

29 component(s) carry a stable `@uxid`. 3 declare variants (3 axis/axes, 7 value(s) in total), read from `cva()` calls, class maps, prop unions and conditional class branches.

| @uxid | component | file | variants | states | uses | notes |
| --- | --- | --- | --- | --- | --- | --- |
| "app/events/[id]/page::EventPage" | EventPage | `app/events/[id]/page.tsx` |  | hover | 0 | Route page for a single event, addressed by id; hosts the event detail view. |
| "app/events/[id]/page::EventDetail" | EventDetail | `app/events/[id]/page.tsx` |  | hover | 0 | Presents the full details of one event on its dedicated page. |
| "app/gear/page::GearPage" | GearPage | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Route page for the gear section. |
| "app/gear/page::GearOverview" | GearOverview | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Summary view of gear on the gear page. |
| "app/gear/page::Needs" | Needs | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Lists outstanding gear needs on the gear page. |
| "app/gear/page::NeedModal" | NeedModal | `app/gear/page.tsx` |  | disabled, group-hover, hover | 0 | Modal dialog for viewing or editing a single gear need. |
| "app/layout::RootLayout" | RootLayout | `app/layout.tsx` |  |  | 0 | Top-level Next.js layout that wraps every page; the place global styles and providers are mounted. |
| "app/login/page::LoginPage" | LoginPage | `app/login/page.tsx` |  | disabled | 0 | Route page where users sign in. |
| "app/page::CalendarPage" | CalendarPage | `app/page.tsx` |  | hover | 0 | Home route; hosts the calendar view. |
| "app/page::Calendar" | Calendar | `app/page.tsx` |  | hover | 0 | The main calendar grid showing events by date. |
| "app/page::EventBody" | EventBody | `app/page.tsx` |  | hover | 0 | Compact rendering of an event's content inside a calendar cell. |
| "app/page::Legend" | Legend | `app/page.tsx` |  | hover | 0 | Key explaining the colors or markers used in the calendar. |
| "app/standins/page::StandinsPage" | StandinsPage | `app/standins/page.tsx` |  |  | 0 | Route page for managing stand-ins (people who cover for others). |
| "app/upcoming/page::UpcomingPage" | UpcomingPage | `app/upcoming/page.tsx` |  | hover | 0 | Route page for the upcoming-events view. |
| "app/upcoming/page::Upcoming" | Upcoming | `app/upcoming/page.tsx` |  | hover | 0 | Chronological list of upcoming events. |
| "lib/AppShell::AppShell" | AppShell | `lib/AppShell.tsx` |  | hover | 5 | Shared application frame with primary navigation that surrounds page content. |
| "lib/AppShell::CalendarIcon" | CalendarIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the calendar section. |
| "lib/AppShell::ClockIcon" | ClockIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the upcoming section. |
| "lib/AppShell::GearIcon" | GearIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the gear section. |
| "lib/AppShell::PeopleIcon" | PeopleIcon | `lib/AppShell.tsx` |  | hover | 0 | Navigation icon for the stand-ins section. |
| "lib/CalendarSync::CalendarSync" | CalendarSync | `lib/CalendarSync.tsx` |  | hover | 1 | Control for syncing events with an external calendar. |
| "lib/ChatWidget::ChatWidget" | ChatWidget | `lib/ChatWidget.tsx` | role (2) | disabled, hover | 1 | Embedded chat panel available across the app. |
| "lib/EventModal::StatusBadge" | StatusBadge | `lib/EventModal.tsx` | initialMode (2) | disabled, hover | 3 | Small label showing an event's status; pairs naturally with the confirmed and pending tokens (@t9, @t17). |
| "lib/EventModal::EventModal" | EventModal | `lib/EventModal.tsx` |  | disabled, hover | 2 | Modal dialog for viewing or editing an event without leaving the current page. |
| "lib/Markdown::Markdown" | Markdown | `lib/Markdown.tsx` |  |  | 6 | Renders markdown text as formatted content. |
| "lib/RichTextEditor::RichTextEditor" | RichTextEditor | `lib/RichTextEditor.tsx` |  |  | 2 | Editable rich-text input used for authoring notes. |
| "lib/SharedNotes::SharedNotes" | SharedNotes | `lib/SharedNotes.tsx` | status (3) | hover, placeholder | 2 | Collaborative notes area shared between users. |
| "lib/SharedNotes::SaveStatus" | SaveStatus | `lib/SharedNotes.tsx` |  | hover, placeholder | 0 | Indicator showing whether shared notes have been saved. |
| "lib/auth::AuthProvider" | AuthProvider | `lib/auth.tsx` |  |  | 1 | Context provider that supplies authentication state to the app. |

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

#### ChatWidget (`lib/ChatWidget.tsx`:21)

| axis | value | classes | call sites |
| --- | --- | --- | --- |
| `role` | `user` | _declared by the prop type only_ | 0 |
| `role` | `assistant` | _declared by the prop type only_ | 0 |

States targeted in this file: `disabled`, `hover`

1 conditional class branch(es) in this file are not a named variant.

Rendered 1 time(s) in 1 other file(s).
