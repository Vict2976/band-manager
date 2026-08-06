# Design tokens

This design system is built on a token set defined in app/globals.css, organized around a primary brand color scale, a set of accent colors, and neutral surface/text tokens. Components are structured as Next.js App Router pages (events, gear, login, calendar, upcoming) supported by shared library primitives (AppShell navigation, modals, markdown/rich-text rendering, and auth context). Tokens should be referenced by catalog id only; component behavior and roles are summarized below.

_Values are extracted mechanically from the theme files (verbatim); grouping/descriptions are AI-organized._

## Primary Brand Colors

The core brand color and its tint/shade scale used for primary actions, emphasis, and interactive states.

| token | value | source |
| --- | --- | --- |
| `--primary` | `#6874f4` | `app/globals.css`:11 |
| `--primary-600` | `#4c5ae8` | `app/globals.css`:12 |
| `--primary-700` | `#3d48d4` | `app/globals.css`:13 |
| `--primary-100` | `#e4e6fd` | `app/globals.css`:14 |
| `--primary-50` | `#f0f1fe` | `app/globals.css`:15 |

## Accent Colors

Distinctive accent hues used for categorization, highlights, and decorative emphasis (e.g. event legends and tags).

| token | value | source |
| --- | --- | --- |
| `--funk` | `#ff6b35` | `app/globals.css`:18 |
| `--latina` | `#ff3d77` | `app/globals.css`:19 |
| `--gold` | `#ffc24b` | `app/globals.css`:20 |

## Surface & Structure

Neutral background, surface, and hairline tokens that define layout layering and separators.

| token | value | source |
| --- | --- | --- |
| `--bg` | `#f5f6fd` | `app/globals.css`:23 |
| `--surface` | `#ffffff` | `app/globals.css`:24 |
| `--hairline` | `#e7e8f4` | `app/globals.css`:25 |

## Text & Ink

Foreground text tokens spanning primary ink through muted and faint variants for hierarchy.

| token | value | source |
| --- | --- | --- |
| `--ink` | `#2c3147` | `app/globals.css`:26 |
| `--muted` | `#6b7187` | `app/globals.css`:27 |
| `--faint` | `#9aa0b6` | `app/globals.css`:28 |

## Theme Base Aliases

Root theme aliases mapping background and foreground to the underlying color system.

| token | value | source |
| --- | --- | --- |
| `--background` | `var(--bg)` | `app/globals.css`:30 |
| `--foreground` | `var(--ink)` | `app/globals.css`:31 |
