# FlowState Learning

Expo (SDK 58) + Expo Router + Supabase e-learning app. Runs on iOS, Android and web.

## Run it

```bash
npm install
npm start          # then press i / a / w, or scan the QR code with Expo Go
npm run web        # browser
npm run typecheck && npm run lint
```

Supabase credentials come from `.env` (see `.env.example`). If unset, the app falls back to the
project's existing public anon key, so it works out of the box.

## Structure

```
src/app/            routes (Expo Router)
  (auth)/           login, register
  (tabs)/           Learn, Library, Profile
  course/[id].tsx   course player (lessons / resources / reviews)
  pdf, account, notifications, privacy, terms, help, about
src/components/ui/  design-system primitives (Button, Input, Card, Sheet, ...)
src/providers/      AuthProvider, ToastProvider
src/theme/          colour, spacing, type tokens
legacy/             old shop / Stripe / PayPal / lessons code, kept for reference (not bundled)
```

Auth is handled by `<Stack.Protected>` in `src/app/_layout.tsx`: signing in/out redirects automatically.

## Supabase tables used

`courses`, `course_enrollments`, `course_videos`, `course_pdfs`, `course_reviews`, `profiles`,
`notifications_settings`, `user_consents`, `support_requests`, storage bucket `avatars`.
