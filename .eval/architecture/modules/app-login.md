# Module: app/login

Provides the sign-in page for the shared band account, letting a user authenticate with email and password to access the Band Manager app ('Keep the login and calendar link inside the band; anyone with them can see the schedule').

## Key files
- `app/login/page.tsx`: Renders the login form (email/password), handles submission via the auth hook, shows errors, and redirects authenticated users away from the login page

## Public interface
- LoginPage (default export, route component for /login)

## Dependencies
- ../../lib/auth
- next/navigation

## Open questions
- What does useAuth's signIn function do internally (API call, token storage) — not shown in this file
- Is there a corresponding sign-out or session persistence mechanism elsewhere in the app?
