# Design system playbook

This design system is built on a token set defined in app/globals.css, organized around a primary brand color scale, a set of accent colors, and neutral surface/text tokens. Components are structured as Next.js App Router pages (events, gear, login, calendar, upcoming) supported by shared library primitives (AppShell navigation, modals, markdown/rich-text rendering, and auth context). Tokens should be referenced by catalog id only; component behavior and roles are summarized below.

## Deviations

The deviation check scanned 18 file(s) for hardcoded colors bypassing tokens.

Found 31 hardcoded color literal(s):

- `app/globals.css`:44 — `rgba(104, 116, 244, 0.16)` — duplicates `--primary`
- `app/globals.css`:45 — `rgba(255, 61, 119, 0.10)` — duplicates `--latina`
- `app/globals.css`:46 — `rgba(255, 107, 53, 0.10)` — duplicates `--funk`
- `app/globals.css`:50 — `rgba(104, 116, 244, 0.25)` — duplicates `--primary`
- `app/globals.css`:72 — `#6874f4` — duplicates `--primary`
- `app/globals.css`:72 — `#ff6b35` — duplicates `--funk`
- `app/globals.css`:72 — `#ff3d77` — duplicates `--latina`
- `app/globals.css`:84 — `rgba(44, 49, 71, 0.04)` — duplicates `--ink`
- `app/globals.css`:84 — `rgba(44, 49, 71, 0.18)` — duplicates `--ink`
- `app/globals.css`:90 — `rgba(104, 116, 244, 0.4)` — duplicates `--primary`
- `app/globals.css`:95 — `rgba(255, 255, 255, 0.72)` — duplicates `--surface`
- `app/globals.css`:106 — `#fff` — duplicates `--surface`
- `app/globals.css`:108 — `rgba(104, 116, 244, 0.6)` — duplicates `--primary`
- `app/globals.css`:113 — `rgba(255, 61, 119, 0.55)` — duplicates `--latina`
- `app/globals.css`:119 — `rgba(255,255,255,0.4)` — duplicates `--surface`
- `app/globals.css`:135 — `#fff` — duplicates `--surface`
- `app/globals.css`:145 — `rgba(104, 116, 244, 0.15)` — duplicates `--primary`
- `app/globals.css`:152 — `#fff` — duplicates `--surface`
- `app/globals.css`:158 — `rgba(104, 116, 244, 0.15)` — duplicates `--primary`
- `app/globals.css`:179 — `#fff` — duplicates `--surface`
- `app/globals.css`:220 — `#cdd0fb`
- `app/gear/page.tsx`:16 — `#6874f4` — duplicates `--primary`
- `app/gear/page.tsx`:16 — `#ff6b35` — duplicates `--funk`
- `app/gear/page.tsx`:16 — `#ff3d77` — duplicates `--latina`
- `app/gear/page.tsx`:16 — `#ffc24b` — duplicates `--gold`
- `app/gear/page.tsx`:16 — `#4c5ae8` — duplicates `--primary-600`
- `app/gear/page.tsx`:166 — `#fff` — duplicates `--surface`
- `app/gear/page.tsx`:166 — `#fff` — duplicates `--surface`
- `app/layout.tsx`:43 — `#6874f4` — duplicates `--primary`
- `app/layout.tsx`:47 — `#6874f4` — duplicates `--primary`
- `lib/EventModal.tsx`:172 — `#fff` — duplicates `--surface`
