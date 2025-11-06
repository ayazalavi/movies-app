// lib/current-user.ts
import { cookies } from "next/headers";
import { verifyJwt, JWTPayload } from "./jwt";

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    return verifyJwt<JWTPayload>(token);
}
