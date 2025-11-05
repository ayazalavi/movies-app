import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
const prisma = new PrismaClient();

const Payload = z.object({
    title: z.string().min(1),
    year: z.coerce.number().int(),
    posterUrl: z.string().url().optional().or(z.literal("")),
    tags: z.array(z.string()).optional()
});

export async function PUT(
    _: NextRequest,
    ctx: { params: Promise<{ id: string }> }   // 👈 new typing
) {
    const body = await _.json();
    const parse = Payload.safeParse(body);
    if (!parse.success) return NextResponse.json(parse.error.format(), { status: 400 });

    const updated = await prisma.movie.update({ where: { id: (await ctx.params).id }, data: parse.data });
    return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    await prisma.movie.delete({ where: { id: (await ctx.params).id } });
    return NextResponse.json({ ok: true });
}
