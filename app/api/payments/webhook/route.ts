import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { getStripe } from "@/src/lib/stripe";


async function updateSessionPayment(session: Stripe.Checkout.Session, status: "PAID" | "PROCESSING" | "FAILED" | "EXPIRED") {
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? null;

  const update = {
    paymentStatus: status,
    ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
    ...(status === "PAID" ? { paidAt: new Date() } : {}),
  };

  await db.orm.public.Booking.where({ stripeCheckoutSessionId: session.id }).update(update);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook signature configuration is missing." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await updateSessionPayment(session, session.payment_status === "paid" ? "PAID" : "PROCESSING");
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        await updateSessionPayment(event.data.object as Stripe.Checkout.Session, "PAID");
        break;
      }
      case "checkout.session.async_payment_failed": {
        await updateSessionPayment(event.data.object as Stripe.Checkout.Session, "FAILED");
        break;
      }
      case "checkout.session.expired": {
        await updateSessionPayment(event.data.object as Stripe.Checkout.Session, "EXPIRED");
        break;
      }
      default:
        // Acknowledge unrelated event types so Stripe does not keep retrying them.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
