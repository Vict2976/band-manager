# Module: (root)

Root-level build configuration for the band web app's Next.js project: the Next config permits optimized images served from the project's Firebase Storage bucket (e.g. member or gig images) and allows SVGs, while the PostCSS config wires in Tailwind CSS for styling the gig and availability screens.

## Key files
- `next.config.ts`: Next.js configuration; whitelists https://firebasestorage.googleapis.com under the band-manager-d1cb7 bucket path for next/image remote patterns, enables dangerouslyAllowSVG, keeps image optimization on.
- `postcss.config.mjs`: PostCSS configuration registering the @tailwindcss/postcss plugin so Tailwind utilities are processed in the build.

## Public interface
- next.config.ts: default export nextConfig (NextConfig)
- postcss.config.mjs: default export config (PostCSS plugins list)

## Dependencies
- next (NextConfig type)
- @tailwindcss/postcss
- Firebase Storage (remote image host firebasestorage.googleapis.com, bucket band-manager-d1cb7.firebasestorage.app)

## Open questions
- Which images are actually loaded from the Firebase Storage bucket (member avatars, gig posters?) — not visible in these files.
- dangerouslyAllowSVG is enabled; is a contentSecurityPolicy for images set elsewhere to mitigate SVG risks?
- The Stack block mentions app/api/calendar/[token]/ route handlers, but no such files are included in this module, so their behavior cannot be confirmed here.
