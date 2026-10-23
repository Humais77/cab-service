import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/prisma/db";
import { getStripe } from "@/src/lib/stripe";

const schema = z.object({ reference: z.string().trim().min(8).max(64) });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "A valid booking reference is required." }, { status: 400 });

  try {
    // This project uses a contract ORM with .all(); if the table grows substantially,
    // replace this lookup with the indexed where/find API supported by your generated client.
    const bookings = await db.orm.public.Booking.all();
    const booking = bookings.find((item) => item.reference === parsed.data.reference);

    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    if (booking.paymentMethod !== "STRIPE") return NextResponse.json({ error: "This booking is not configured for online payment." }, { status: 400 });
    if (booking.paymentStatus === "PAID") return NextResponse.json({ error: "This booking has already been paid." }, { status: 409 });
    if (typeof booking.amountCents !== "number" || !Number.isSafeInteger(booking.amountCents) || booking.amountCents < 1) {
      return NextResponse.json({ error: "The booking does not have a valid payment amount." }, { status: 400 });
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    if (!baseUrl || !/^https?:\/\//.test(baseUrl)) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured correctly." }, { status: 500 });
    }

    // If an existing session is still open, reuse it rather than creating duplicates.
    if (booking.stripeCheckoutSessionId) {
      const existing = await stripe.checkout.sessions.retrieve(booking.stripeCheckoutSessionId);
      if (existing.status === "open" && existing.url) {
        return NextResponse.json({ url: existing.url });
      }
      if (existing.payment_status === "paid") {
        return NextResponse.json({ error: "This booking has already been paid." }, { status: 409 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Let Stripe dynamically show the methods enabled and eligible for this account.
      // Card wallets (Apple Pay / Google Pay) appear when supported by the customer setup.
      client_reference_id: booking.reference,
      customer_email: booking.customerEmail || undefined,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "aud",
          unit_amount: booking.amountCents,
          product_data: {
            name: `Cab booking ${booking.reference}`,
            description: `${booking.pickup} to ${booking.destination}`.slice(0, 500),
          },
        },
      }],
      metadata: {
        bookingReference: booking.reference,
        bookingId: String(booking.id),
      },
      payment_intent_data: {
        metadata: {
          bookingReference: booking.reference,
          bookingId: String(booking.id),
        },
      },
      success_url: `${baseUrl}/thank-you?ref=${encodeURIComponent(booking.reference)}&payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/thank-you?ref=${encodeURIComponent(booking.reference)}&payment=cancelled`,
    });

    if (!session.url) throw new Error("Stripe did not return a Checkout URL.");

    await db.orm.public.Booking.where({ id: booking.id }).update({
      stripeCheckoutSessionId: session.id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create Stripe Checkout Session error:", error);
    return NextResponse.json({ error: "Unable to start secure checkout. Your booking may already be saved; contact us with your booking reference if this continues." }, { status: 500 });
  }
}
