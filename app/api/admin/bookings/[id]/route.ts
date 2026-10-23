
import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  assignedDriverId: z.number().int().positive().nullable().optional(),

  // Only offline driver payments may be manually marked paid.
  // Stripe payments must be verified through Stripe.
  paymentStatus: z.enum(["PAID"]).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
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

    const parsed = updateSchema.safeParse(await request.json());

    if (
      !parsed.success ||
      Object.keys(parsed.data ?? {}).length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid booking update." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const bookings = await db.orm.public.Booking.all();
    const current = bookings.find((item) => item.id === bookingId);

    if (!current) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    if (
      data.paymentStatus === "PAID" &&
      current.paymentMethod !== "PAY_DRIVER"
    ) {
      return NextResponse.json(
        {
          error:
            "Only offline driver payments can be confirmed manually.",
        },
        { status: 400 },
      );
    }

    if (
      data.paymentStatus === "PAID" &&
      current.paymentStatus === "PAID"
    ) {
      return NextResponse.json(
        { error: "This booking is already marked as paid." },
        { status: 409 },
      );
    }

    // Validate the requested driver before modifying the booking.
    if (
      data.assignedDriverId !== undefined &&
      data.assignedDriverId !== null
    ) {
      const drivers = await db.orm.public.Driver.all();
      const driver = drivers.find(
        (item) => item.id === data.assignedDriverId,
      );

      if (!driver || !driver.active) {
        return NextResponse.json(
          {
            error:
              "Selected driver does not exist or is inactive.",
          },
          { status: 400 },
        );
      }
    }

    const confirmsBooking = [
      "CONFIRMED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
    ].includes(data.status ?? "");

    // IMPORTANT: reject before the database update.
    if (
      current.paymentMethod === "STRIPE" &&
      current.paymentStatus !== "PAID" &&
      (confirmsBooking ||
        data.assignedDriverId !== undefined)
    ) {
      return NextResponse.json(
        {
          error:
            "This booking cannot be confirmed or assigned until Stripe payment is verified.",
          paymentStatus: current.paymentStatus,
        },
        { status: 409 },
      );
    }

    const updateData = {
      ...data,
      ...(data.paymentStatus === "PAID"
        ? { paidAt: new Date() }
        : {}),
      ...(data.assignedDriverId != null && !data.status
        ? { status: "ASSIGNED" as const }
        : {}),
    };

    const updated = await db.orm.public.Booking
      .where({ id: bookingId })
      .update(updateData);

    return NextResponse.json({
      success: true,
      booking: updated,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    return NextResponse.json(
      { error: "Unable to update booking." },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    await db.orm.public.Booking.where({ id: bookingId }).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);

    return NextResponse.json(
      { error: "Unable to delete booking." },
      { status: 500 },
    );
  }
}
