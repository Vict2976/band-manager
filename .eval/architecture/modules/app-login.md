# Module: app/login

The sign-in page for the band's web app. Band members enter the email and password of the shared band account; on success they are sent to the home page where upcoming gigs are listed. Already-authenticated visitors are redirected to '/' immediately.

## Key files
- `app/login/page.tsx`: Client-side Next.js page component (LoginPage) rendering the email/password form, calling signIn from the auth hook, showing a 'Wrong email or password.' error on failure, and redirecting to '/' on success or when already authenticated.

## Public interface
- default export LoginPage (React component, Next.js app route at /login)

## Dependencies
- react (useEffect, useState)
- next/navigation (useRouter)
- ../../lib/auth (useAuth hook providing signIn and isAuthenticated) — imported but not included in the provided files

## Open questions
- How does lib/auth implement signIn — what backend or auth provider is used and how is the session persisted?
- The page says 'Sign in to the shared band account', implying a single shared credential rather than per-member accounts; how are individual members then identified when marking availability?
- Is there a sign-out or password-reset flow elsewhere, since none exists in this module?
