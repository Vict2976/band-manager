# Module: app/login

The sign-in screen for the Band Manager's one shared band login. It renders an email/password form, calls the auth layer's signIn, shows a generic 'Wrong email or password.' error on failure, and redirects already-authenticated or newly signed-in users to the home route '/'.

## Key files
- `app/login/page.tsx`: Next.js App Router client page component (LoginPage) implementing the login form, loading/error state, auth-aware redirect, and submit handling via useAuth().signIn.

## Public interface
- default export LoginPage (React client component served at /login route)

## Dependencies
- react (useEffect, useState)
- next/navigation (useRouter)
- ../../lib/auth (useAuth hook providing signIn and isAuthenticated)

## Open questions
- The underlying auth provider is not visible here; lib/auth is imported but its implementation (and whether it enforces a single shared band account) is outside this module.
- All sign-in failures are collapsed into one generic error message; it is unclear whether network errors vs. bad credentials should be distinguished.
- Redirect target is hardcoded to '/'; no support for returning to a deep-linked event page after login.
- The '@uxid' comment suggests an external UX tracking convention whose consumer is not shown in this module.
