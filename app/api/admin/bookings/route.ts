import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";


export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const bookings = await db.orm.public.Booking.all();

    bookings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    return NextResponse.json(
      { error: "Unable to load bookings." },
      { status: 500 },
    );
  }
}