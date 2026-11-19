# Module: (root)

Provides root build and framework configurations for the Next.js application and PostCSS styling pipeline, configuring Tailwind CSS and Next.js image loading permissions for Firebase Storage.

## Key files
- `next.config.ts`: Defines Next.js configuration including image optimization remote patterns for Firebase Storage and SVG rendering options
- `postcss.config.mjs`: Configures PostCSS to use the @tailwindcss/postcss plugin

## Public interface
- export default nextConfig (NextConfig object in next.config.ts)
- export default config (PostCSS plugin configuration object in postcss.config.mjs)

## Dependencies
- next
- @tailwindcss/postcss

## Open questions
- _none_
