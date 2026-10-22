import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/prisma/db";
import { getDrivingRoute } from "@/src/routing";


const bookingSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  customerPhone: z.string().trim().min(7).max(25),
  pickup: z.string().trim().min(2).max(200),
  destination: z.string().trim().min(2).max(200),

  // Coordinates are constrained to the currently configured Sydney service area.
  pickupLat: z.number().finite().min(-35).max(-32),
  pickupLng: z.number().finite().min(150).max(152),
  destinationLat: z.number().finite().min(-35).max(-32),
  destinationLng: z.number().finite().min(150).max(152),

  // Accepted for compatibility only. The server recalculates and saves the route.
  distanceMeters: z.number().finite().nonnegative().optional(),
  durationSeconds: z.number().finite().nonnegative().optional(),

  tripType: z.enum(["One way", "Return"]),
  journeyDate: z.string().min(1).max(50),
  journeyTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  returnDate: z.string().max(50).optional(),
  returnTime: z.string().max(20).optional(),
  vehicleName: z.string().trim().min(1).max(100),
  passengerCount: z.coerce.number().int().min(1).max(13),
  serviceType: z.string().trim().min(1).max(100),
  specialInstructions: z.string().trim().max(2000).optional(),
});

function validDate(value: string) {
  return !Number.isNaN(new Date(value).getTime());
}

function validTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check your booking details.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (!validDate(data.journeyDate)) {
    return NextResponse.json({ error: "Please provide a valid journey date." }, { status: 400 });
  }

  if (!validTime(data.journeyTime)) {
    return NextResponse.json({ error: "Please provide a valid pickup time." }, { status: 400 });
  }

  if (data.tripType === "Return") {
    if (
      !data.returnDate ||
      !validDate(data.returnDate) ||
      !data.returnTime ||
      !validTime(data.returnTime)
    ) {
      return NextResponse.json(
        { error: "A valid return date and return time are required." },
        { status: 400 }
      );
    }

    const outbound = new Date(data.journeyDate);
    const inbound = new Date(data.returnDate);

    if (inbound < outbound || (inbound.getTime() === outbound.getTime() && data.returnTime < data.journeyTime)) {
      return NextResponse.json(
        { error: "Return date and time cannot be earlier than the outbound journey." },
        { status: 400 }
      );
    }
  }

  let route: Awaited<ReturnType<typeof getDrivingRoute>>;

  try {
    route = await getDrivingRoute(
      { longitude: data.pickupLng, latitude: data.pickupLat },
      { longitude: data.destinationLng, latitude: data.destinationLat }
    );
  } catch (error) {
    console.error("OSRM route calculation failed:", error);
    return NextResponse.json(
      { error: "We could not calculate the driving route. Please check your locations and try again." },
      { status: 502 }
    );
  }

  try {
    const reference = `CAB-${randomBytes(4).toString("hex").toUpperCase()}`;

    const booking = await db.orm.public.Booking.create({
      reference,
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      customerPhone: data.customerPhone,
      pickup: data.pickup,
      destination: data.destination,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      destinationLat: data.destinationLat,
      destinationLng: data.destinationLng,
      distanceMeters: route.distanceMeters,
      durationSeconds: route.durationSeconds,
      tripType: data.tripType,
      journeyDate: new Date(data.journeyDate),
      journeyTime: data.journeyTime,
      returnDate: data.tripType === "Return" && data.returnDate ? new Date(data.returnDate) : null,
      returnTime: data.tripType === "Return" ? data.returnTime || null : null,
      vehicleName: data.vehicleName,
      passengerCount: data.passengerCount,
      serviceType: data.serviceType,
      specialInstructions: data.specialInstructions || null,
      status: "PENDING",
      assignedDriverId: null,
    });

    return NextResponse.json(
      {
        success: true,
        reference: booking.reference,
        distanceKm: Number((route.distanceMeters / 1000).toFixed(2)),
        durationSeconds: route.durationSeconds,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { error: "We could not save your booking. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Use the protected admin bookings endpoint." },
    { status: 405 }
  );
}
