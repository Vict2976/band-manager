# Module: (root)

Root-level build configuration for the Band Manager Next.js app: configures Next.js image handling (allowing remote images from the project's Firebase Storage bucket) and wires Tailwind CSS into the PostCSS pipeline. These files set up the framework and styling toolchain for the band's shared tool (calendar, upcoming events, gear, stand-ins); they contain no business logic themselves.

## Key files
- `next.config.ts`: Next.js configuration. Permits next/image to load HTTPS images from firebasestorage.googleapis.com under the band-manager-d1cb7.firebasestorage.app bucket path, enables SVG images (dangerouslyAllowSVG: true), and keeps image optimization on (unoptimized: false).
- `postcss.config.mjs`: PostCSS configuration that registers the @tailwindcss/postcss plugin, enabling Tailwind CSS (v4-style plugin) for the app's styling.

## Public interface
- next.config.ts: default export `nextConfig: NextConfig` consumed by the Next.js build/runtime
- postcss.config.mjs: default export PostCSS config object with `plugins: ["@tailwindcss/postcss"]`

## Dependencies
- next (NextConfig type and config consumer)
- @tailwindcss/postcss (Tailwind CSS PostCSS plugin)
- Firebase Storage (remote image host firebasestorage.googleapis.com, bucket band-manager-d1cb7.firebasestorage.app) — external service referenced via remotePatterns

## Open questions
- Why is dangerouslyAllowSVG enabled — are user-uploaded SVGs served from Firebase Storage, and is a Content-Security-Policy configured elsewhere to mitigate the XSS risk this flag implies?
- The Firebase Storage bucket is hard-coded in next.config.ts; is there a separate bucket/config for non-production environments?
- No Tailwind config file or globals stylesheet is included in this module — where is Tailwind actually imported into the app's CSS?
- The provided files show no auth, Firestore, or calendar/ICS logic; those likely live in other modules not covered here.
