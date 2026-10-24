import { getDrivingRoute } from "@/src/routing";
import { NextResponse } from "next/server";
import { z } from "zod";

const coordinateSchema = z.object({
  longitude: z.number().finite().min(-180).max(180),
  latitude: z.number().finite().min(-90).max(90),
});


const routeSchema = z.object({
  pickup: coordinateSchema,
  destination: coordinateSchema,
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = routeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Valid pickup and destination coordinates are required." },
      { status: 400 }
    );
  }

  try {
    const route = await getDrivingRoute(
      parsed.data.pickup,
      parsed.data.destination
    );

    return NextResponse.json({
      distanceMeters: route.distanceMeters,
      distanceKm: Number((route.distanceMeters / 1000).toFixed(2)),
      durationSeconds: route.durationSeconds,
      geometry: route.geometry,
    });
  } catch (error) {
    console.error("Route calculation error:", error);
    return NextResponse.json(
      { error: "Could not calculate a driving route for these locations." },
      { status: 502 }
    );
  }
}
