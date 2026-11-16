
import { NextResponse } from "next/server";
import { db } from "@/prisma/db";

export async function GET() {
  try {
    const allVehicles = await db.orm.public.Vehicle.all();

    const vehicles = allVehicles
      .filter((vehicle) => vehicle.active)
      .map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        capacity: vehicle.capacity,
        luggageCapacity: vehicle.luggageCapacity,
      }));

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("Load booking options error:", error);

    return NextResponse.json(
      { error: "Unable to load available booking options." },
      { status: 500 },
    );
  }
}
