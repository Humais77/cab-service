import {
  createAdminSession,
  setAdminSession,
} from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const users = await db.orm.public.User.all();

    const user = users.find(
      (item: {
        username: string;
        role: string;
        active: boolean;
      }) =>
        item.username === body.data.username &&
        item.role === "ADMIN" &&
        item.active,
    );

    if (!user || !(await compare(body.data.password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    const token = await createAdminSession(user.id);
    await setAdminSession(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      { error: "Unable to log in. Please try again." },
      { status: 500 },
    );
  }
}