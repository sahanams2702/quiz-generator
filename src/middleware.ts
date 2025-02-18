import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

async function middleware(req: NextRequest) {
    const userId = (await cookies()).get("user_id")?.value;
    const userRole = (await cookies()).get("user_role")?.value;

    const protectedRoutes = ["/dashboard", "/history", "/profile"];
    const adminRoutes = ["/overview", "/admin/users", "/admin/analytics"];

    const { pathname } = req.nextUrl;

    // Redirect to login if accessing protected routes without authentication
    if ([...protectedRoutes, ...adminRoutes].includes(pathname)) {
        if (!userId) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    // Redirect to "Not Authorized" if a normal user tries to access admin routes
    if (adminRoutes.includes(pathname)) {
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/not-authorized", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/history", "/profile", "/admin/:path*"],
};

export default middleware;