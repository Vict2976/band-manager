# Components

Every row is an applied `// @uxid` identifier. Ids are path-derived and permanent.

| identifier | file | flow | type | description |
| --- | --- | --- | --- | --- |
| `app/events/[id]/page::EventDetail` | app/events/[id]/page.tsx | all | component | Function component. Hooks: useParams, useRouter, useState, useEffect. Renders: div, p, span, article, h1, button, Link, Markdown, +1 more. |
| `app/events/[id]/page::EventPage` | app/events/[id]/page.tsx | all | component | Function component. Renders: AppShell, EventDetail. |
| `app/gear/page::GearOverview` | app/gear/page.tsx | all | component | Function component. Hooks: useState, useRef, useEffect. Renders: section, div, h1, p, button, SaveStatus, RichTextEditor, Markdown. |
| `app/gear/page::GearPage` | app/gear/page.tsx | all | component | Function component. Renders: div, AppShell, GearOverview, Needs. |
| `app/gear/page::NeedModal` | app/gear/page.tsx | all | component | Function component. Props: member, initial, onClose. Hooks: useState. Renders: div, h3, p, textarea, button. |
| `app/gear/page::Needs` | app/gear/page.tsx | all | component | Function component. Hooks: useState, useEffect. Renders: section, div, h2, p, button, span, NeedModal. |
| `app/gear/page::SaveStatus` | app/gear/page.tsx | all | component | Function component. Props: status. Renders: span. |
| `app/layout::RootLayout` | app/layout.tsx | all | component | Function component. Props: children. Renders: html, head, link, meta, body, AuthProvider. |
| `app/login/page::LoginPage` | app/login/page.tsx | all | component | Function component. Hooks: useState, useAuth, useRouter, useEffect. Renders: div, h1, p, form, label, span. |
| `app/page::Calendar` | app/page.tsx | all | component | Function component. Hooks: useState, useEffect, useMemo. Renders: div, section, h1, span, button, h2, Legend, Link, +2 more. |
| `app/page::CalendarPage` | app/page.tsx | all | component | Function component. Renders: AppShell, Calendar. |
| `app/page::EventBody` | app/page.tsx | all | component | Function component. Props: text, eventId. Hooks: useRef, useState, useEffect. Renders: div, Markdown, Link. |
| `app/page::Legend` | app/page.tsx | all | component | Function component. Renders: div, span. |
| `app/upcoming/page::Upcoming` | app/upcoming/page.tsx | all | component | Function component. Hooks: useState, useEffect, useMemo. Renders: div, h1, p, ul, li, button, Link, Markdown. |
| `app/upcoming/page::UpcomingPage` | app/upcoming/page.tsx | all | component | Function component. Renders: AppShell, Upcoming. |
| `lib/AppShell::AppShell` | lib/AppShell.tsx | all | component | Function component. Props: children. Hooks: useAuth, useRouter, usePathname, useEffect. Renders: div, header, span, nav, button, main, Link, Icon. |
| `lib/AppShell::CalendarIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, rect, path. |
| `lib/AppShell::ClockIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::GearIcon` | lib/AppShell.tsx | all | component | Function component. Props: active. Renders: svg, circle, path. |
| `lib/auth::AuthProvider` | lib/auth.tsx | all | component | Function component. Props: children. Hooks: useState, useEffect. Renders: AuthContext.Provider. |
| `lib/EventModal::EventModal` | lib/EventModal.tsx | all | component | Function component. Props: date, event, onClose, onDeleted, initialMode. Hooks: useState. Renders: div, h3, svg, path, button, label, Link, RichTextEditor, +1 more. |
| `lib/Markdown::Markdown` | lib/Markdown.tsx | all | component | Function component. Props: children, className. Renders: div, a, ReactMarkdown. |
| `lib/RichTextEditor::RichTextEditor` | lib/RichTextEditor.tsx | all | component | Function component. Props: value, onChange, placeholder, minHeight, autoFocus, grow. Hooks: useRef, useEffect. Renders: strong, em, div, button, textarea. |

## Coverage

- all: 23 identifier(s)
