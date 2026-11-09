# Design system playbook

A calendar-centered scheduling product. The UI organizes events on a monthly calendar (@app/page::CalendarPage) with a detail view per event (@app/events/[id]/page::EventPage), an upcoming list (@app/upcoming/page::UpcomingPage), a gear overview with outstanding needs (@app/gear/page::GearPage), a stand-ins page (@app/standins/page::StandinsPage), and a login screen (@app/login/page::LoginPage), all wrapped in a shared shell with icon navigation (@lib/AppShell::AppShell). Events carry a status that is surfaced through @lib/EventModal::StatusBadge and @app/page::Legend; the token set includes dedicated status colors (t9, t17), a primary scale (t3–t7), neutral surface/ink/hairline colors (t0, t1, t2, t10, t14, t15), and two named accent colors (t12, t16) whose roles are not stated in the list. Collaborative notes are supported via @lib/SharedNotes::SharedNotes with a rich-text editor and markdown rendering.

## In one screen

- **Theme lives in:** plain CSS custom properties.
- **Tokens:** 18 in 3 group(s), folded from 18 declaration(s).
- **Themes:** light only.
- **Spent:** 16 token(s) are used somewhere; 2 are declared and never used.
- **Components:** 28 declared, 0 primitives, 2 with variants (5 variant value(s)).
- **Disagreements:** 47 instance(s) in 3 kind(s). See the last section.

## Where the design is declared

| file | what it declares |
| --- | --- |
| `app/globals.css`:1 | Tailwind v4, CSS-first: the theme is this stylesheet, not a tailwind.config file. |
| `app/globals.css`:9 | 18 custom properties declared under `:root`. |
| `app/layout.tsx`:7 | `--font-geist-sans` is declared by a font loader here, not in CSS. |
| `app/layout.tsx`:12 | `--font-geist-mono` is declared by a font loader here, not in CSS. |

## Palette

Colour is written in hex (16 token(s)). 0 colour token(s) are re-declared for dark mode; 16 keep their light value.

### Surfaces (3)

| token | utility name | light | dark | uses | defined at |
| --- | --- | --- | --- | --- | --- |
| `--bg` |  | `#f5f6fd` | (same) | 3 | `app/globals.css`:27 |
| `--muted` |  | `#6b7187` | (same) | 37 | `app/globals.css`:31 |
| `--surface` |  | `#ffffff` | (same) | 1 | `app/globals.css`:28 |

### Brand (5)

| token | utility name | light | dark | uses | defined at |
| --- | --- | --- | --- | --- | --- |
| `--primary` |  | `#6874f4` | (same) | 23 | `app/globals.css`:11 |
| `--primary-100` |  | `#e4e6fd` | (same) | 4 | `app/globals.css`:14 |
| `--primary-50` |  | `#f0f1fe` | (same) | 14 | `app/globals.css`:15 |
| `--primary-600` |  | `#4c5ae8` | (same) | 1 | `app/globals.css`:12 |
| `--primary-700` |  | `#3d48d4` | (same) | 4 | `app/globals.css`:13 |

### Unclassified (10)

| token | utility name | light | dark | uses | defined at |
| --- | --- | --- | --- | --- | --- |
| `--background` |  | `#f5f6fd` | (same) | 0 | `app/globals.css`:34 |
| `--confirmed` |  | `#12b886` | (same) | 1 | `app/globals.css`:23 |
| `--faint` |  | `#9aa0b6` | (same) | 15 | `app/globals.css`:32 |
| `--foreground` |  | `#2c3147` | (same) | 0 | `app/globals.css`:35 |
| `--funk` |  | `#ff6b35` | (same) | 1 | `app/globals.css`:18 |
| `--gold` |  | `#ffc24b` | (same) | 2 | `app/globals.css`:20 |
| `--hairline` |  | `#e7e8f4` | (same) | 16 | `app/globals.css`:29 |
| `--ink` |  | `#2c3147` | (same) | 20 | `app/globals.css`:30 |
| `--latina` |  | `#ff3d77` | (same) | 9 | `app/globals.css`:19 |
| `--pending` |  | `#e8a020` | (same) | 1 | `app/globals.css`:24 |

## Scales

### Spacing

No spacing tokens are declared, so the framework default scale is in use. 16 arbitrary value(s) step off it.

### Breakpoints

No breakpoint tokens are declared, so the framework defaults are in use. Responsive variants actually used: sm (22).

### Typography

| step | size | weight | declared at |
| --- | --- | --- | --- |
| `Heading 1` | `1.3rem` | 800 | `app/globals.css`:204 |
| `Heading 2` | `1.12rem` | 700 | `app/globals.css`:205 |
| `Heading 3` | `1rem` | 700 | `app/globals.css`:206 |

## States the UI actually targets

| state | class occurrences |
| --- | --- |
| `hover` | 20 |
| `disabled` | 6 |
| `group-hover` | 1 |

## Composition

No primitives directory was found, so every component is an application component: there is an inventory here but no shared kit to build from.

## Where the app disagrees with itself

### 2 token(s) are declared and never used

No utility class and no `var()` reference spends them: --background, --foreground.

- `app/globals.css`:34: `--background: var(--bg)`
- `app/globals.css`:35: `--foreground: var(--ink)`

### 29 hardcoded colour literal(s) bypass the tokens

Written into a colour property or an arbitrary class value; 28 duplicate a token that already exists.

- `app/globals.css`:54: `::selection { background: rgba(104, 116, 244, 0.25); color: var(--ink); }`
- `app/globals.css`:76: `background: linear-gradient(100deg, #6874f4 0%, #ff6b35 50%, #ff3d77 100%);`
- `app/globals.css`:76: `background: linear-gradient(100deg, #6874f4 0%, #ff6b35 50%, #ff3d77 100%);`
- `app/globals.css`:76: `background: linear-gradient(100deg, #6874f4 0%, #ff6b35 50%, #ff3d77 100%);`
- `app/globals.css`:88: `box-shadow: 0 1px 2px rgba(44, 49, 71, 0.04), 0 10px 30px -18px rgba(44, 49, 71, 0.18);`
- `app/globals.css`:88: `box-shadow: 0 1px 2px rgba(44, 49, 71, 0.04), 0 10px 30px -18px rgba(44, 49, 71, 0.18);`
- `app/globals.css`:94: `box-shadow: 0 18px 40px -20px rgba(104, 116, 244, 0.4);`
- `app/globals.css`:99: `background: rgba(255, 255, 255, 0.72);`
- `app/globals.css`:110: `color: #fff;`
- `app/globals.css`:112: `box-shadow: 0 10px 26px -12px rgba(104, 116, 244, 0.6);`

### 16 arbitrary value(s) step off the scale

text-[11px] (7), border-[3px] (2), text-[10px] (2), border-[1.5px] (1), h-[100dvh] (1), max-h-[88vh] (1), min-h-[30vh] (1), text-[13px] (1)

- `app/events/[id]/page.tsx`:76: `text-[11px]`
- `app/page.tsx`:110: `text-[11px]`
- `app/page.tsx`:199: `text-[11px]`
- `app/events/[id]/page.tsx`:44: `border-[3px]`
- `lib/AppShell.tsx`:28: `border-[3px]`
- `app/upcoming/page.tsx`:112: `text-[10px]`
- `lib/EventModal.tsx`:37: `text-[10px]`
- `app/page.tsx`:282: `border-[1.5px]`

### Every hardcoded colour, by file

| file | literal | duplicates |
| --- | --- | --- |
| `app/globals.css`:54 | `rgba(104, 116, 244, 0.25)` | `--primary` |
| `app/globals.css`:76 | `#6874f4` | `--primary` |
| `app/globals.css`:76 | `#ff6b35` | `--funk` |
| `app/globals.css`:76 | `#ff3d77` | `--latina` |
| `app/globals.css`:88 | `rgba(44, 49, 71, 0.04)` | `--ink` |
| `app/globals.css`:88 | `rgba(44, 49, 71, 0.18)` | `--ink` |
| `app/globals.css`:94 | `rgba(104, 116, 244, 0.4)` | `--primary` |
| `app/globals.css`:99 | `rgba(255, 255, 255, 0.72)` | `--surface` |
| `app/globals.css`:110 | `#fff` | `--surface` |
| `app/globals.css`:112 | `rgba(104, 116, 244, 0.6)` | `--primary` |
| `app/globals.css`:117 | `rgba(255, 61, 119, 0.55)` | `--latina` |
| `app/globals.css`:123 | `rgba(255,255,255,0.4)` | `--surface` |
| `app/globals.css`:139 | `#fff` | `--surface` |
| `app/globals.css`:149 | `rgba(104, 116, 244, 0.15)` | `--primary` |
| `app/globals.css`:156 | `#fff` | `--surface` |
| `app/globals.css`:162 | `rgba(104, 116, 244, 0.15)` | `--primary` |
| `app/globals.css`:183 | `#fff` | `--surface` |
| `app/globals.css`:224 | `#cdd0fb` |  |
| `app/gear/page.tsx`:16 | `#6874f4` | `--primary` |
| `app/gear/page.tsx`:16 | `#ff6b35` | `--funk` |
| `app/gear/page.tsx`:16 | `#ff3d77` | `--latina` |
| `app/gear/page.tsx`:16 | `#ffc24b` | `--gold` |
| `app/gear/page.tsx`:16 | `#4c5ae8` | `--primary-600` |
| `app/gear/page.tsx`:76 | `#fff` | `--surface` |
| `app/gear/page.tsx`:76 | `#fff` | `--surface` |
| `app/layout.tsx`:43 | `#6874f4` | `--primary` |
| `app/layout.tsx`:47 | `#6874f4` | `--primary` |
| `lib/EventModal.tsx`:229 | `#fff` | `--surface` |
| `lib/EventModal.tsx`:252 | `#fff` | `--surface` |
