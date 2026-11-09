Code from the earlier shop/payments prototype (Stripe payment sheet, PayPal edge function, packages,
lesson purchases, fake checkout screens, Mux video player, Numecis assets). None of it is imported by
the app. Hard-coded Stripe keys were removed from `server/server.js` — it now reads
`STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` from the environment.
