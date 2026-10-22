import { clearAdminSession } from "@/src/lib/admin-auth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAdminSession();

  return NextResponse.json({ success: true });
}