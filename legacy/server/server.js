// server.js
import express from "express";
import Stripe from "stripe";
const app = express();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/payment-sheet", async (req, res) => {
  const customer = await stripe.customers.create();

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" } // must match SDK version
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999, // amount in cents
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: { enabled: true },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
// node server.js 


// import cors from "cors";
// import express from "express";
// import Stripe from "stripe";

// const app = express();
// const stripe = new Stripe("sk_test_your_secret_key_here");
// app.use(cors());
// app.use(express.json());

// app.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body; // e.g. 500 = $5.00
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//     });
//     res.send({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     res.status(400).send({ error: err.message });
//   }
// });

// app.listen(4242, () => console.log("Server running on port 4242"));
