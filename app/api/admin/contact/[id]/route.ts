import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/prisma/db";
import { requireAdmin } from "@/src/lib/admin-auth";


const statusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESOLVED"]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;
    const enquiryId = Number(id);

    if (!Number.isSafeInteger(enquiryId) || enquiryId <= 0) {
      return NextResponse.json(
        { error: "Invalid enquiry ID." },
        { status: 400 },
      );
    }

    const parsed = statusSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid enquiry status." },
        { status: 400 },
      );
    }

    const enquiries = await db.orm.public.ContactEnquiry.all();
    const existing = enquiries.find(
      (item: { id: number }) => item.id === enquiryId,
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Enquiry not found." },
        { status: 404 },
      );
    }

    await db.orm.public.ContactEnquiry.where({
      id: enquiryId,
    }).update({
      status: parsed.data.status,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry status updated.",
    });
  } catch (error) {
    console.error("Failed to update enquiry:", error);

    return NextResponse.json(
      { error: "Unable to update enquiry status." },
      { status: 500 },
    );
  }
}