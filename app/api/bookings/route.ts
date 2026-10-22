import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { z } from "zod";
import { db } from "@/prisma/db";


const bookingSchema = z.object({
    customerName: z.string().trim().min(2).max(100),
    customerEmail: z
        .union([z.string().trim().email().max(254), z.literal("")])
        .optional(),
    customerPhone: z.string().trim().min(7).max(25),
    pickup: z.string().trim().min(2).max(200),
    destination: z.string().trim().min(2).max(200),
    tripType: z.enum(["One way", "Return"]),
    journeyDate: z.string().min(1),
    journeyTime: z.string().min(1).max(20),
    returnDate: z.string().optional(),
    returnTime: z.string().optional(),
    vehicleName: z.string().trim().min(1).max(100),
    passengerCount: z.coerce.number().int().min(1).max(13),
    serviceType: z.string().trim().min(1).max(100),
    specialInstructions: z.string().trim().max(2000).optional(),
});

function validDate(value: string) {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = bookingSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Please check your booking details.",
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const data = parsed.data;

        if (!validDate(data.journeyDate)) {
            return NextResponse.json(
                { error: "Please provide a valid journey date." },
                { status: 400 },
            );
        }

        if (
            data.tripType === "Return" &&
            (!data.returnDate || !validDate(data.returnDate) || !data.returnTime)
        ) {
            return NextResponse.json(
                { error: "Return date and time are required for return trips." },
                { status: 400 },
            );
        }

        // Store names as submitted so existing bookings remain understandable.
        const reference =
            "CAB-" + randomBytes(4).toString("hex").toUpperCase();

        const booking = await db.orm.public.Booking.create({
    reference,
    customerName: data.customerName,
    customerEmail: data.customerEmail || null,
    customerPhone: data.customerPhone,
    pickup: data.pickup,
    destination: data.destination,
    tripType: data.tripType,
    journeyDate: new Date(data.journeyDate),
    journeyTime: data.journeyTime,
    returnDate:
        data.tripType === "Return" && data.returnDate
            ? new Date(data.returnDate)
            : null,
    returnTime:
        data.tripType === "Return" ? data.returnTime || null : null,
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
    },
    { status: 201 },
);
    } catch (error) {
        console.error("Create booking error:", error);

        return NextResponse.json(
            { error: "We could not save your booking. Please try again." },
            { status: 500 },
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { error: "Use the protected admin bookings endpoint." },
        { status: 405 },
    );
}