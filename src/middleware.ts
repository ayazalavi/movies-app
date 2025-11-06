import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes
const protectedRoutes = ["/my-movies"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    const { pathname } = req.nextUrl;

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthPage =
        pathname === "/";

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/my-movies", req.url));
    }

    return NextResponse.next();
}

// Define which routes middleware applies to
export const config = {
    matcher: ["/", "/my-movies", "/my-movies/:path*"],
};
