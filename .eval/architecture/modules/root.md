# Module: (root)

Root-level build configuration for the Next.js application, wiring up image loading from Firebase Storage and enabling the Tailwind CSS PostCSS pipeline.

## Key files
- `next.config.ts`: Defines Next.js configuration, including allowed remote image host (Firebase Storage) and image optimization/SVG settings.
- `postcss.config.mjs`: Configures PostCSS to use the Tailwind CSS plugin for styling.

## Public interface
- export default nextConfig (NextConfig object from next.config.ts)
- export default config (PostCSS plugin config from postcss.config.mjs)

## Dependencies
- next
- @tailwindcss/postcss
- firebasestorage.googleapis.com (remote image host)

## Open questions
- Why is dangerouslyAllowSVG enabled for remote images—what SVG content is expected to be loaded from Firebase Storage?
- Why is unoptimized explicitly set to false rather than left as default?
- Is the firebasestorage.googleapis.com path pattern (/v0/b/band-manager-d1cb7.firebasestorage.app/**) tied to a single Firebase project only, with no staging/alternate environment configured here?
