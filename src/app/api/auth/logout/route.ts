// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    (await cookies()).delete("token");
    return NextResponse.json({ ok: true });
}
