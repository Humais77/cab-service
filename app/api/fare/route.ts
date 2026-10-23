import { NextResponse } from "next/server";
import { z } from "zod";

import { getDrivingRoute } from "@/src/routing";
import { calculateFareCents } from "@/src/lib/fare";


const schema = z.object({
  pickup: z.object({
    longitude: z.number().finite().min(150).max(152),
    latitude: z.number().finite().min(-35).max(-32),
  }),
  destination: z.object({
    longitude: z.number().finite().min(150).max(152),
    latitude: z.number().finite().min(-35).max(-32),
  }),
  tripType: z.enum(["One way", "Return"]),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid pickup, destination and trip type are required." },
      { status: 400 },
    );
  }

  try {
    const { pickup, destination, tripType } = parsed.data;

    const route = await getDrivingRoute(pickup, destination);
    const fare = calculateFareCents(route.distanceMeters, tripType);

    return NextResponse.json({
      ...fare,
      durationSeconds: route.durationSeconds,
    });
  } catch (error) {
    console.error("Fare preview error:", error);

    return NextResponse.json(
      { error: "Unable to calculate the fare for this route. Please try again." },
      { status: 502 },
    );
  }
}