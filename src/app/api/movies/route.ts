import { PrismaClient } from "@/generated/prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();
const Payload = z.object({
    title: z.string().min(1),
    year: z.coerce.number().int().min(1888).max(new Date().getFullYear() + 1),
    posterUrl: z.string().url().optional().or(z.literal("")),
    tags: z.array(z.string()).optional()
});

export async function GET() {
    const movies = await prisma.movie.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(movies);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const parse = Payload.safeParse(body);
    if (!parse.success) return NextResponse.json(parse.error.format(), { status: 400 });

    const movie = await prisma.movie.create({
        data: { ...parse.data, ownerId: (await ensureUser()).id }
    });
    return NextResponse.json(movie, { status: 201 });
}

// Demo user until auth is wired
async function ensureUser() {
    let u = await prisma.user.findFirst();
    if (!u) u = await prisma.user.create({ data: { email: "demo@local", password: "x" } });
    return u;
}
