// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
// import { prisma } from "@/lib/prisma"  // if using Prisma

export async function POST(req: Request) {
    const { email, password, remember }: { email: string; password: string; remember?: boolean } =
        await req.json();

    // 1) Look up user (replace with your DB)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2) Issue JWT (short expiry is fine; cookie lifetime controls persistence)
    const token = signJwt({ sub: user.id, email: user.email }, { expiresIn: "8h" });

    // 3) Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}), // 30 days vs. session cookie
    });

    return NextResponse.json({ ok: true });
}
