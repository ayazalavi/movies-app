// lib/current-user.ts
import { cookies } from "next/headers";
import { verifyJwt, JWTPayload } from "./jwt";

export async function getTokenFromCookies(): Promise<string | undefined> {
    return (await cookies()).get("token")?.value;
}
