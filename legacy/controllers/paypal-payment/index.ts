import { encode } from 'https://deno.land/std/encoding/base64.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')!;
const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET')!;

// Helper: get PayPal access token
const getPayPalToken = async () => {
  const creds = encode(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
};

// Helper: verify PayPal order
const verifyOrder = async (orderId: string) => {
  const token = await getPayPalToken();
  const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data;
};

// 🚀 Main Function
serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Only POST allowed', { status: 405 });
  }

  const { user_id, package_id, order_id } = await req.json();

  if (!user_id || !package_id || !order_id) {
    return new Response(JSON.stringify({ error: 'Missing parameters' }), { status: 400 });
  }

  try {
    // ✅ Verify PayPal order
    const order = await verifyOrder(order_id);
    if (order.status !== 'COMPLETED') {
      return new Response(JSON.stringify({ error: 'Payment not completed' }), { status: 400 });
    }

    // ✅ Log purchase to Supabase
    const { error } = await supabase.from('purchases').insert({
      user_id,
      package_id,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('PayPal verification error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
