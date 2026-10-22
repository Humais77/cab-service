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
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await context.params;
    const bookingId = Number(id);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        { error: "Invalid booking ID." },
        { status: 400 },
      );
    }

    const parsed = updateSchema.safeParse(await request.json());

    if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
      return NextResponse.json(
        { error: "Invalid booking update." },
        { status: 400 },
      );
    }

    const data = parsed.data;

    if (data.assignedDriverId) {
      const drivers = await db.orm.public.Driver.all();
      const driver = drivers.find(
        (item) => item.id === data.assignedDriverId,
      );

      if (!driver || !driver.active) {
        return NextResponse.json(
          { error: "Selected driver does not exist or is inactive." },
          { status: 400 },
        );
      }

      // Assigning a driver also moves the booking to ASSIGNED,
      // unless the admin explicitly chose another status.
      if (!data.status) data.status = "ASSIGNED";
    }

    const updated = await db.orm.public.Booking
      .where({ id: bookingId })
      .update(data);

    return NextResponse.json({ success: true, booking: updated });
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

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        { error: "Invalid booking ID." },
        { status: 400 },
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