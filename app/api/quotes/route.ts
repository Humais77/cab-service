
import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateFareCents } from "@/src/lib/fare";


const quoteSchema = z.object({
  distanceMeters: z.number().finite().min(0).max(500_000),
  durationSeconds: z.number().finite().min(0).max(86_400),
  vehicleName: z.string().trim().min(1).max(100),
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

  const parsed = quoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid route and journey details are required." },
      { status: 400 },
    );
  }

  try {
    const fare = calculateFareCents(
      parsed.data.distanceMeters,
      parsed.data.tripType,
    );

    return NextResponse.json({
      fareCents: fare.amountCents,
      currency: fare.currency,
      distanceKm: fare.distanceKm,
    });
  } catch (error) {
    console.error("Quote calculation failed:", error);

    return NextResponse.json(
      { error: "Could not calculate the fare." },
      { status: 500 },
    );
  }
}
