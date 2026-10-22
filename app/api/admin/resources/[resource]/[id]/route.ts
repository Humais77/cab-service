import { requireAdmin } from "@/src/lib/admin-auth";
import { db } from "@/prisma/db";
import { NextResponse } from "next/server";
import { z } from "zod";


const configs = {
  vehicles: {
    model: "Vehicle",
    schema: z.object({
      name: z.string().trim().min(2).max(100).optional(),
      description: z.string().max(500).nullable().optional(),
      capacity: z.coerce.number().int().min(1).max(13).optional(),
      active: z.boolean().optional(),
    }),
  },
  drivers: {
    model: "Driver",
    schema: z.object({
      name: z.string().trim().min(2).max(100).optional(),
      phone: z.string().trim().min(7).max(25).optional(),
      active: z.boolean().optional(),
    }),
  },
  services: {
    model: "ServiceType",
    schema: z.object({
      name: z.string().trim().min(2).max(100).optional(),
      description: z.string().max(500).nullable().optional(),
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
  params: Promise<{ resource: string; id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { resource: raw, id } = await context.params;
  const resource = getResource(raw);
  const itemId = Number(id);

  if (!resource || !Number.isInteger(itemId) || itemId <= 0) {
    return NextResponse.json(
      { error: "Invalid resource or ID." },
      { status: 400 },
    );
  }

  try {
    const parsed = configs[resource].schema.safeParse(
      await request.json(),
    );

    if (
      !parsed.success ||
      Object.keys(parsed.data ?? {}).length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid update data." },
        { status: 400 },
      );
    }

    const item = await getModel(resource)
      .where({ id: itemId })
      .update(parsed.data);

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Update resource error:", error);

    return NextResponse.json(
      { error: "Unable to update resource." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { resource: raw, id } = await context.params;
  const resource = getResource(raw);
  const itemId = Number(id);

  if (!resource || !Number.isInteger(itemId) || itemId <= 0) {
    return NextResponse.json(
      { error: "Invalid resource or ID." },
      { status: 400 },
    );
  }

  try {
    await getModel(resource).where({ id: itemId }).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete resource error:", error);

    return NextResponse.json(
      { error: "Unable to delete resource." },
      { status: 500 },
    );
  }
}