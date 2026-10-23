
import { NextResponse } from "next/server";
import { db } from "@/prisma/db";


export async function GET() {
  try {
    const [allVehicles, allServices] = await Promise.all([
      db.orm.public.Vehicle.all(),
      db.orm.public.ServiceType.all(),
    ]);

    const vehicles = allVehicles
      .filter((vehicle) => vehicle.active)
      .map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        capacity: vehicle.capacity,
      }));

    const services = allServices
      .filter((service) => service.active)
      .map((service) => ({
        id: service.id,
        name: service.name,
      }));

    return NextResponse.json({ vehicles, services });
  } catch (error) {
    console.error("Load booking options error:", error);

    return NextResponse.json(
      { error: "Unable to load available booking options." },
      { status: 500 },
    );
  }
}
