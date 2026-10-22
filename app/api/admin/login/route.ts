import { createAdminSession, setAdminSession } from "@/src/lib/admin-auth";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");

    const adminUsername = process.env.ADMIN_USERNAME;
    const passwordHash = "$2b$12$G52Xdbax66FO7rHFcCVDweAVXDmQZ/ooBdpNfSR12AEBAhYn3gu6S";

    if (!adminUsername || !passwordHash) {
  console.error("Admin environment check:", {
    usernameLoaded: Boolean(adminUsername),
    passwordHashLoaded: Boolean(passwordHash),
    cwd: process.cwd(),
  });

  return NextResponse.json(
    { error: "Admin credentials are not configured." },
    { status: 500 },
  );
}

    if (
      username !== adminUsername ||
      !(await compare(password, passwordHash))
    ) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const token = await createAdminSession();
    await setAdminSession(token);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 400 },
    );
  }
}