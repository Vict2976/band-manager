# Identifiers in this code

Every row is a `@uxid` comment in this repository: above a declaration (`// @uxid <id>`, `# @uxid <id>` in
Python), or for an element inside its opening tag (`<button /* @uxid <id> */ ...>`). Search the code for an
id to find its place, wherever the file has moved. Ids are permanent: never edit or remove one, and copy
none: a new component gets its own on Eva's next scan.

## Components (29)

| identifier | file | description |
| --- | --- | --- |
| `app/events/[id]/page::EventDetail` | app/events/[id]/page.tsx | Function component. Hooks: useParams, useRouter, useState, useEffect. Renders: div, p, span, article, h1, button, Link, StatusBadge, +2 more. |
| `app/events/[id]/page::EventPage` | app/events/[id]/page.tsx | Function component. Renders: AppShell, EventDetail. |
| `app/gear/page::GearOverview` | app/gear/page.tsx | Function component. Renders: SharedNotes. |
| `app/gear/page::GearPage` | app/gear/page.tsx | Function component. Renders: div, AppShell, GearOverview, Needs. |
| `app/gear/page::NeedModal` | app/gear/page.tsx | Function component. Props: member, initial, onClose. Hooks: useState. Renders: div, h3, p, textarea, button. |
| `app/gear/page::Needs` | app/gear/page.tsx | Function component. Hooks: useState, useEffect. Renders: section, div, h2, p, button, span, NeedModal. |
| `app/layout::RootLayout` | app/layout.tsx | Function component. Props: children. Renders: html, head, link, meta, body, script, AuthProvider. |
| `app/login/page::LoginPage` | app/login/page.tsx | Function component. Hooks: useState, useAuth, useRouter, useEffect. Renders: div, h1, p, form, label, span. |
| `app/page::Calendar` | app/page.tsx | Function component. Hooks: useState, useEffect, useMemo. Renders: div, section, h1, span, button, h2, Legend, StatusBadge, +4 more. |
| `app/page::CalendarPage` | app/page.tsx | Function component. Renders: AppShell, Calendar. |
| `app/page::EventBody` | app/page.tsx | Function component. Props: text, eventId. Hooks: useRef, useState, useEffect. Renders: div, Markdown, Link. |
| `app/page::Legend` | app/page.tsx | Function component. Renders: div, span. |
| `app/standins/page::StandinsPage` | app/standins/page.tsx | Function component. Renders: AppShell, SharedNotes. |
| `app/upcoming/page::Upcoming` | app/upcoming/page.tsx | Function component. Hooks: useState, useEffect, useMemo. Renders: div, h1, p, ul, li, button, Link, StatusBadge, +1 more. |
| `app/upcoming/page::UpcomingPage` | app/upcoming/page.tsx | Function component. Renders: AppShell, Upcoming. |
| `lib/AppShell::AppShell` | lib/AppShell.tsx | Function component. Props: children. Hooks: useAuth, useRouter, usePathname, useEffect. Renders: div, header, span, nav, button, main, Link, ChatWidget, +1 more. |
| `lib/AppShell::CalendarIcon` | lib/AppShell.tsx | Function component. Props: active. Renders: svg, rect, path. |
| `lib/AppShell::ClockIcon` | lib/AppShell.tsx | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::GearIcon` | lib/AppShell.tsx | Function component. Props: active. Renders: svg, circle, path. |
| `lib/AppShell::PeopleIcon` | lib/AppShell.tsx | Function component. Props: active. Renders: svg, circle, path. |
| `lib/auth::AuthProvider` | lib/auth.tsx | Function component. Props: children. Hooks: useState, useEffect. Renders: AuthContext.Provider. |
| `lib/CalendarSync::CalendarSync` | lib/CalendarSync.tsx | Function component. Hooks: useState, useEffect. Renders: section, button, span, svg, path, div. |
| `lib/ChatWidget::ChatWidget` | lib/ChatWidget.tsx | Function component. Hooks: useAuth, useState, useRef, useEffect. Renders: div, span, p, button, form, textarea, Markdown. |
| `lib/EventModal::EventModal` | lib/EventModal.tsx | Function component. Props: date, event, onClose, onDeleted, initialMode. Hooks: useState. Renders: div, h3, svg, path, button, label, Link, RichTextEditor, +2 more. |
| `lib/EventModal::StatusBadge` | lib/EventModal.tsx | Function component. Props: status, compact. Renders: span. |
| `lib/Markdown::Markdown` | lib/Markdown.tsx | Function component. Props: children, className. Renders: div, a, ReactMarkdown. |
| `lib/RichTextEditor::RichTextEditor` | lib/RichTextEditor.tsx | Function component. Props: value, onChange, placeholder, minHeight, autoFocus, grow. Hooks: useRef, useEffect. Renders: strong, em, div, button, textarea. |
| `lib/SharedNotes::SaveStatus` | lib/SharedNotes.tsx | Function component. Props: status. Renders: span. |
| `lib/SharedNotes::SharedNotes` | lib/SharedNotes.tsx | Function component. Props: title, subtitle, placeholder, emptyLabel, subscribe, save. Hooks: useState, useRef, useEffect. Renders: section, div, h1, p, button, SaveStatus, RichTextEditor, Markdown. |

## Interactive elements (buttons, inputs, links), each inside a component (76)

| identifier | file | in | description |
| --- | --- | --- | --- |
| `app/events/[id]/page::EventDetail.button` | app/events/[id]/page.tsx | `app/events/[id]/page::EventDetail` | Button. labelled "Edit". Handlers: onClick. |
| `app/events/[id]/page::EventDetail.eventmodal` | app/events/[id]/page.tsx | `app/events/[id]/page::EventDetail` | <EventModal> component. Handlers: onClose, onDeleted. |
| `app/events/[id]/page::EventDetail.link` | app/events/[id]/page.tsx | `app/events/[id]/page::EventDetail` | <Link> component. href "/", labelled "← Back to calendar". |
| `app/events/[id]/page::EventDetail.link-2` | app/events/[id]/page.tsx | `app/events/[id]/page::EventDetail` | <Link> component. href "/", labelled "Calendar". |
| `app/gear/page::NeedModal.button` | app/gear/page.tsx | `app/gear/page::NeedModal` | Button. can be disabled, labelled "Cancel". Handlers: onClick. |
| `app/gear/page::NeedModal.button-2` | app/gear/page.tsx | `app/gear/page::NeedModal` | Button. can be disabled, labelled "Saving… / Save". Handlers: onClick. |
| `app/gear/page::NeedModal.div` | app/gear/page.tsx | `app/gear/page::NeedModal` | <div> element. Handlers: onClick. |
| `app/gear/page::NeedModal.div-2` | app/gear/page.tsx | `app/gear/page::NeedModal` | <div> element. Handlers: onClick. |
| `app/gear/page::NeedModal.textarea` | app/gear/page.tsx | `app/gear/page::NeedModal` | Multi-line text field. placeholder "e.g. guitar combo amp, 2× DI boxes, mic + stand, monitor mix…". Handlers: onChange. |
| `app/gear/page::Needs.button` | app/gear/page.tsx | `app/gear/page::Needs` | Button. Handlers: onClick. |
| `app/gear/page::Needs.needmodal` | app/gear/page.tsx | `app/gear/page::Needs` | <NeedModal> component. Handlers: onClose. |
| `app/layout::RootLayout.link` | app/layout.tsx | `app/layout::RootLayout` | <link> element. href "/favicon.ico". |
| `app/layout::RootLayout.link-2` | app/layout.tsx | `app/layout::RootLayout` | <link> element. type=image/png, href "/logo.png". |
| `app/layout::RootLayout.link-3` | app/layout.tsx | `app/layout::RootLayout` | <link> element. type=image/png, href "/logo.png". |
| `app/layout::RootLayout.link-4` | app/layout.tsx | `app/layout::RootLayout` | <link> element. href "/logo.png". |
| `app/layout::RootLayout.link-5` | app/layout.tsx | `app/layout::RootLayout` | <link> element. href "/manifest.json". |
| `app/login/page::LoginPage.button` | app/login/page.tsx | `app/login/page::LoginPage` | Button. type=submit, can be disabled, labelled "Signing in… / Sign in". |
| `app/login/page::LoginPage.email` | app/login/page.tsx | `app/login/page::LoginPage` | Email input. Handlers: onChange. |
| `app/login/page::LoginPage.form` | app/login/page.tsx | `app/login/page::LoginPage` | Form. Handlers: onSubmit. |
| `app/login/page::LoginPage.label` | app/login/page.tsx | `app/login/page::LoginPage` | Field label. |
| `app/login/page::LoginPage.label-2` | app/login/page.tsx | `app/login/page::LoginPage` | Field label. |
| `app/login/page::LoginPage.password` | app/login/page.tsx | `app/login/page::LoginPage` | Password input. Handlers: onChange. |
| `app/page::Calendar.button` | app/page.tsx | `app/page::Calendar` | Button. labelled "Today". Handlers: onClick. |
| `app/page::Calendar.button-2` | app/page.tsx | `app/page::Calendar` | Button. labelled "Previous month". Handlers: onClick. |
| `app/page::Calendar.button-3` | app/page.tsx | `app/page::Calendar` | Button. labelled "Next month". Handlers: onClick. |
| `app/page::Calendar.button-4` | app/page.tsx | `app/page::Calendar` | Button. Handlers: onClick. |
| `app/page::Calendar.button-5` | app/page.tsx | `app/page::Calendar` | Button. labelled "+ Add event". Handlers: onClick. |
| `app/page::Calendar.button-6` | app/page.tsx | `app/page::Calendar` | Button. labelled "Add a gig or rehearsal". Handlers: onClick. |
| `app/page::Calendar.div` | app/page.tsx | `app/page::Calendar` | <div> element. Handlers: onClick, onKeyDown. |
| `app/page::Calendar.eventmodal` | app/page.tsx | `app/page::Calendar` | <EventModal> component. Handlers: onClose. |
| `app/page::Calendar.link` | app/page.tsx | `app/page::Calendar` | <Link> component. labelled "Open full page". Handlers: onClick. |
| `app/page::EventBody.link` | app/page.tsx | `app/page::EventBody` | <Link> component. labelled "Show more →". Handlers: onClick. |
| `app/upcoming/page::Upcoming.button` | app/upcoming/page.tsx | `app/upcoming/page::Upcoming` | Button. Handlers: onClick. |
| `app/upcoming/page::Upcoming.link` | app/upcoming/page.tsx | `app/upcoming/page::Upcoming` | <Link> component. href "/", labelled "Add something on the calendar →". |
| `app/upcoming/page::Upcoming.link-2` | app/upcoming/page.tsx | `app/upcoming/page::Upcoming` | <Link> component. labelled "Open full page". |
| `lib/AppShell::AppShell.button` | lib/AppShell.tsx | `lib/AppShell::AppShell` | Button. labelled "Sign out". Handlers: onClick. |
| `lib/AppShell::AppShell.link` | lib/AppShell.tsx | `lib/AppShell::AppShell` | <Link> component. href "/". |
| `lib/AppShell::AppShell.link-2` | lib/AppShell.tsx | `lib/AppShell::AppShell` | <Link> component. |
| `lib/AppShell::AppShell.link-3` | lib/AppShell.tsx | `lib/AppShell::AppShell` | <Link> component. |
| `lib/CalendarSync::CalendarSync.button` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Button. Handlers: onClick. |
| `lib/CalendarSync::CalendarSync.button-2` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Button. labelled "Copied / Copy". Handlers: onClick. |
| `lib/CalendarSync::CalendarSync.button-3` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Button. labelled "Make a new link". Handlers: onClick. |
| `lib/CalendarSync::CalendarSync.input` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Text input field. labelled "Calendar subscription link". Handlers: onFocus. |
| `lib/CalendarSync::CalendarSync.link` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Link. labelled "Open in iPhone / Mac Calendar". Handlers: onClick. |
| `lib/CalendarSync::CalendarSync.link-2` | lib/CalendarSync.tsx | `lib/CalendarSync::CalendarSync` | Link. labelled "Add to Google Calendar". |
| `lib/ChatWidget::ChatWidget.button` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Button. labelled "Ryd". Handlers: onClick. |
| `lib/ChatWidget::ChatWidget.button-2` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Button. labelled "Luk". Handlers: onClick. |
| `lib/ChatWidget::ChatWidget.button-3` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Button. Handlers: onClick. |
| `lib/ChatWidget::ChatWidget.button-4` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Button. type=submit, can be disabled, labelled "Send". |
| `lib/ChatWidget::ChatWidget.button-5` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Button. Handlers: onClick. |
| `lib/ChatWidget::ChatWidget.div` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | <div> element. labelled "Band-assistent". |
| `lib/ChatWidget::ChatWidget.form` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Form. Handlers: onSubmit. |
| `lib/ChatWidget::ChatWidget.textarea` | lib/ChatWidget.tsx | `lib/ChatWidget::ChatWidget` | Multi-line text field. placeholder "Skriv et spørgsmål…". Handlers: onChange, onKeyDown. |
| `lib/EventModal::EventModal.button` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. labelled "Close". Handlers: onClick. |
| `lib/EventModal::EventModal.button-2` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. Handlers: onClick. |
| `lib/EventModal::EventModal.button-3` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. labelled "Confirmed / Being figured out". Handlers: onClick. |
| `lib/EventModal::EventModal.button-4` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. can be disabled, labelled "Delete". Handlers: onClick. |
| `lib/EventModal::EventModal.button-5` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. can be disabled, labelled "Cancel". Handlers: onClick. |
| `lib/EventModal::EventModal.button-6` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. can be disabled, labelled "Saving… / Save". Handlers: onClick. |
| `lib/EventModal::EventModal.button-7` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Button. labelled "Edit event". Handlers: onClick. |
| `lib/EventModal::EventModal.date` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Date picker. Handlers: onChange. |
| `lib/EventModal::EventModal.div` | lib/EventModal.tsx | `lib/EventModal::EventModal` | <div> element. Handlers: onClick. |
| `lib/EventModal::EventModal.div-2` | lib/EventModal.tsx | `lib/EventModal::EventModal` | <div> element. Handlers: onClick. |
| `lib/EventModal::EventModal.input` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Text input. placeholder "e.g. Loppen, Christiania". Handlers: onChange. |
| `lib/EventModal::EventModal.label` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Field label. |
| `lib/EventModal::EventModal.label-2` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Field label. |
| `lib/EventModal::EventModal.label-3` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Field label. |
| `lib/EventModal::EventModal.link` | lib/EventModal.tsx | `lib/EventModal::EventModal` | <Link> component. labelled "Full page". Handlers: onClick. |
| `lib/EventModal::EventModal.richtexteditor` | lib/EventModal.tsx | `lib/EventModal::EventModal` | <RichTextEditor> component. placeholder "What's happening? e.g. load-in 18:00, bring the small PA…". Handlers: onChange. |
| `lib/EventModal::EventModal.time` | lib/EventModal.tsx | `lib/EventModal::EventModal` | Time input. Handlers: onChange. |
| `lib/Markdown::Markdown.link` | lib/Markdown.tsx | `lib/Markdown::Markdown` | Link. |
| `lib/RichTextEditor::RichTextEditor.button` | lib/RichTextEditor.tsx | `lib/RichTextEditor::RichTextEditor` | Button. type=button. Handlers: onMouseDown, onClick. |
| `lib/RichTextEditor::RichTextEditor.textarea` | lib/RichTextEditor.tsx | `lib/RichTextEditor::RichTextEditor` | Multi-line text field. Handlers: onChange, onKeyDown. |
| `lib/SharedNotes::SharedNotes.button` | lib/SharedNotes.tsx | `lib/SharedNotes::SharedNotes` | Button. labelled "Done / Edit". Handlers: onClick. |
| `lib/SharedNotes::SharedNotes.button-2` | lib/SharedNotes.tsx | `lib/SharedNotes::SharedNotes` | Button. Handlers: onClick. |
| `lib/SharedNotes::SharedNotes.richtexteditor` | lib/SharedNotes.tsx | `lib/SharedNotes::SharedNotes` | <RichTextEditor> component. Handlers: onChange. |

## The code on the way to the AI: endpoint handlers and functions that call a model (8)

| identifier | file | description |
| --- | --- | --- |
| `app/api/calendar/[token]/route::GET` | app/api/calendar/[token]/route.ts | Exported Function 'GET'. Params: req, {…}. |
| `app/api/calendar/[token]/route::tokensMatch` | app/api/calendar/[token]/route.ts | Function 'tokensMatch'. Params: a, b. |
| `app/api/chat/route::buildKnowledge` | app/api/chat/route.ts | Function 'buildKnowledge'. |
| `app/api/chat/route::POST` | app/api/chat/route.ts | Exported Function 'POST'. Params: req. |
| `app/api/chat/route::sanitize` | app/api/chat/route.ts | Function 'sanitize'. Params: raw. |
| `app/api/chat/route::systemPrompt` | app/api/chat/route.ts | Function 'systemPrompt'. Params: knowledge. |
| `app/api/chat/route::today` | app/api/chat/route.ts | Function 'today'. |
| `app/api/chat/route::weekday` | app/api/chat/route.ts | Function 'weekday'. Params: dateKey. |

## Instructions sent to a model (2)

| identifier | file | description |
| --- | --- | --- |
| `app/api/chat/route::buildKnowledge.prompt` | app/api/chat/route.ts | Prompt returned by 'buildKnowledge' (175 chars). |
| `app/api/chat/route::systemPrompt.prompt` | app/api/chat/route.ts | Prompt returned by 'systemPrompt' (872 chars). |
