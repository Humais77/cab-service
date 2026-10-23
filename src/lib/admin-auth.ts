import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/prisma/db";

const COOKIE_NAME = "cab_admin_session";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be at least 32 characters.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession(userId: number) {
  return new SignJWT({ role: "ADMIN" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());
}

export async function setAdminSession(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthenticated() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;

    if (!token) return false;

    const { payload } = await jwtVerify(token, getSecret());

    if (payload.role !== "ADMIN" || !payload.sub) {
      return false;
    }

    const users = await db.orm.public.User.all();

    return users.some(
      (user: {
        id: number;
        role: string;
        active: boolean;
      }) =>
        String(user.id) === payload.sub &&
        user.role === "ADMIN" &&
        user.active,
    );
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
  }

  return null;
}