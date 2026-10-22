import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";


const configs = {
  vehicles: {
    model: "Vehicle",
    schema: z.object({
      name: z.string().trim().min(2).max(100),
      description: z.string().max(500).optional().nullable(),
      capacity: z.coerce.number().int().min(1).max(13),
      active: z.boolean().optional(),
    }),
  },
  drivers: {
    model: "Driver",
    schema: z.object({
      name: z.string().trim().min(2).max(100),
      phone: z.string().trim().min(7).max(25),
      active: z.boolean().optional(),
    }),
  },
  services: {
    model: "ServiceType",
    schema: z.object({
      name: z.string().trim().min(2).max(100),
      description: z.string().max(500).optional().nullable(),
      active: z.boolean().optional(),
    }),
  },
} as const;

type Resource = keyof typeof configs;

function getResource(value: string): Resource | null {
  return value in configs ? (value as Resource) : null;
}

function getModel(resource: Resource): any {
  return (db.orm.public as any)[configs[resource].model];
}

type Context = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { resource: raw } = await context.params;
  const resource = getResource(raw);

  if (!resource) {
    return NextResponse.json(
      { error: "Unknown resource." },
      { status: 404 },
    );
  }

  try {
    const items = await getModel(resource).all();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("List resource error:", error);

    return NextResponse.json(
      { error: "Unable to load resource." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { resource: raw } = await context.params;
  const resource = getResource(raw);

  if (!resource) {
    return NextResponse.json(
      { error: "Unknown resource." },
      { status: 404 },
    );
  }

  try {
    const parsed = configs[resource].schema.safeParse(
      await request.json(),
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid resource data.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const item = await getModel(resource).create(parsed.data);

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("Create resource error:", error);

    return NextResponse.json(
      { error: "Unable to create resource." },
      { status: 500 },
    );
  }
}