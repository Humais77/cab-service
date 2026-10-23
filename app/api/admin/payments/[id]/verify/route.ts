import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { getStripe } from "@/src/lib/stripe";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const bookingId = Number(id);

    if (!Number.isSafeInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        { error: "Invalid booking ID." },
        { status: 400 },
      );
    }

    const bookings = await db.orm.public.Booking.all();
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    if (booking.paymentMethod !== "STRIPE") {
      return NextResponse.json(
        {
          error:
            "Stripe verification is only available for Stripe payments.",
        },
        { status: 400 },
      );
    }

    if (!booking.stripeCheckoutSessionId) {
      return NextResponse.json(
        {
          error: "This booking has no Stripe Checkout Session.",
          paymentStatus: booking.paymentStatus,
        },
        { status: 409 },
      );
    }

    if (
      typeof booking.amountCents !== "number" ||
      !Number.isSafeInteger(booking.amountCents) ||
      booking.amountCents <= 0
    ) {
      return NextResponse.json(
        { error: "The booking amount is invalid." },
        { status: 409 },
      );
    }

    // Narrowed to `number` for the rest of the handler.
    const expectedAmountCents = booking.amountCents;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(
      booking.stripeCheckoutSessionId,
    );

    // Never trust a frontend-provided payment status.
    // Verify the actual Stripe session against the saved booking.
    if (
      session.amount_total !== expectedAmountCents ||
      session.currency?.toLowerCase() !== "aud"
    ) {
      console.error("Stripe session does not match booking:", {
        bookingId,
        sessionId: session.id,
        expectedAmount: expectedAmountCents,
        actualAmount: session.amount_total,
        currency: session.currency,
      });

      return NextResponse.json(
        {
          error:
            "The Stripe session amount or currency does not match this booking. No payment status was changed.",
        },
        { status: 409 },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        success: true,
        verified: false,
        paymentStatus: booking.paymentStatus,
        stripePaymentStatus: session.payment_status,
        checkoutStatus: session.status,
        message:
          "Stripe has not confirmed payment. The saved payment status was not changed.",
      });
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const updated = await db.orm.public.Booking
      .where({ id: bookingId })
      .update({
        paymentStatus: "PAID",
        stripePaymentIntentId: paymentIntentId,
        paidAt: booking.paidAt ?? new Date(),
      });

    return NextResponse.json({
      success: true,
      verified: true,
      paymentStatus: "PAID",
      stripePaymentStatus: session.payment_status,
      booking: updated,
      message: "Stripe confirms that this payment has been paid.",
    });
  } catch (error) {
    console.error("Admin Stripe verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify the Stripe payment." },
      { status: 500 },
    );
  }
}