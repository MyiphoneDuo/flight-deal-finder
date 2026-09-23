# Flight Price Notifier v1

## Build
- Create a polished dark bilingual landing page at `/` with the exact product copy, three feature cards, sign-in call to action, and footer.
- Add dedicated email/password sign-in and sign-up pages, with immediate access after registration.
- Add a protected `/app` dashboard shell that greets the authenticated user by email and contains the requested bilingual placeholder.
- Add safe sign-out behavior and redirect unauthenticated visitors to sign in.

## Design
- Use a near-black palette with violet accents, Inter typography, restrained glow, fine borders, and subtle entrance motion.
- Keep layouts fully responsive and accessible across mobile and desktop.

## Technical details
- Use Lovable Cloud authentication only; create no custom tables.
- Keep authentication state synchronized at the root and protect the app route before rendering.
- Add unique page metadata for every public-facing route.
- Verify sign-up, sign-in, protected routing, sign-out, and responsive presentation.
