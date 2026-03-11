import { NextRequest, NextResponse } from "next/server";

// Stripe checkout session creation
// In production: import Stripe from 'stripe'; const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PLAN_PRICES: Record<string, { name: string; priceId: string; amount: number }> = {
  starter: { name: "Starter", priceId: "price_starter_one_time", amount: 49700 },
  growth: { name: "Growth", priceId: "price_growth_one_time", amount: 199700 },
  scale: { name: "Scale", priceId: "price_scale_one_time", amount: 499700 },
  "starter-monthly": { name: "Starter Monthly", priceId: "price_starter_monthly", amount: 9700 },
  "growth-monthly": { name: "Growth Monthly", priceId: "price_growth_monthly", amount: 29700 },
  "scale-monthly": { name: "Scale Monthly", priceId: "price_scale_monthly", amount: 49700 },
};

export async function POST(request: NextRequest) {
  const { plan, email } = await request.json();

  const planConfig = PLAN_PRICES[plan];
  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // In production, create a Stripe Checkout Session:
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: [{ price: planConfig.priceId, quantity: 1 }],
  //   mode: plan.includes('monthly') ? 'subscription' : 'payment',
  //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/success?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
  //   customer_email: email,
  //   metadata: { plan },
  // });
  // return NextResponse.json({ url: session.url });

  // Demo mode: simulate checkout by redirecting to success
  return NextResponse.json({
    url: `/auth/success?plan=${plan}&demo=true`,
    demo: true,
    plan: planConfig.name,
    amount: planConfig.amount,
  });
}
