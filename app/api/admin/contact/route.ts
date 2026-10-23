import { NextResponse } from "next/server";
import { db } from "@/prisma/db";
import { requireAdmin } from "@/src/lib/admin-auth";


export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const enquiries = await db.orm.public.ContactEnquiry.all();

    enquiries.sort(
      (a: { createdAt: Date }, b: { createdAt: Date }) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Failed to load contact enquiries:", error);

    return NextResponse.json(
      { error: "Unable to load contact enquiries." },
      { status: 500 },
    );
  }
}