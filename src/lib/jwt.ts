import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export type JWTPayload = { sub: string; email: string };

export function signJwt(payload: JWTPayload, opts?: jwt.SignOptions) {
    return jwt.sign(payload, SECRET, { algorithm: "HS256", ...opts });
}

export function verifyJwt<T = JWTPayload>(token: string): T | null {
    try {
        return jwt.verify(token, SECRET) as T;
    } catch {
        return null;
    }
}
