import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/prisma/db";


const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your details and try again.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, message } = parsed.data;

    const enquiry = await db.orm.public.ContactEnquiry.create({
      name,
      email,
      phone,
      message,
      status: "NEW",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been submitted successfully.",
        enquiryId: enquiry.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact enquiry submission failed:", error);

    return NextResponse.json(
      { error: "Unable to submit your enquiry. Please try again." },
      { status: 500 },
    );
  }
}