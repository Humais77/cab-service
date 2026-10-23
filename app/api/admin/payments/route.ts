
import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const bookings = await db.orm.public.Booking.all();

    const payments = bookings
      .filter(
        (booking) =>
          booking.paymentMethod === "STRIPE" ||
          booking.paymentMethod === "PAY_DRIVER",
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .map((booking) => ({
        id: booking.id,
        reference: booking.reference,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        pickup: booking.pickup,
        destination: booking.destination,
        createdAt: booking.createdAt,
        amountCents: booking.amountCents,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        paidAt: booking.paidAt,
        stripeCheckoutSessionId: booking.stripeCheckoutSessionId,
        stripePaymentIntentId: booking.stripePaymentIntentId,
        bookingStatus: booking.status,
      }));

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Fetch admin payments error:", error);

    return NextResponse.json(
      { error: "Unable to load payments." },
      { status: 500 },
    );
  }
}
