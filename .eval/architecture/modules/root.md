# Module: (root)

Root configuration module for a Next.js application with Tailwind CSS styling and Firebase Storage image optimization

## Key files
- `next.config.ts` — NextConfig export defining image handling, remote patterns for Firebase, and optimization settings
- `postcss.config.mjs` — PostCSS configuration enabling Tailwind CSS processing

## Public interface
- NextConfig object exported from next.config.ts
- PostCSS plugin configuration exported from postcss.config.mjs

## Dependencies
- next
- @tailwindcss/postcss
- Firebase Storage (firebasestorage.googleapis.com)

## Open questions
- What is the purpose of disabling image optimization (unoptimized: false) while still applying remote patterns?
- Are there additional Next.js middleware or API routes defined elsewhere in the application?
- What specific Tailwind CSS customizations are applied beyond the default @tailwindcss/postcss plugin?
