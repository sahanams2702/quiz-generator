import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

async function middleware(req: NextRequest) {
    const userId = (await cookies()).get("user_id")?.value;
    const userRole = (await cookies()).get("user_role")?.value;
    console.log(userId, userRole);
    const protectedRoutes = ["/dashboard", "/history", "/profile", "/create-quiz", "/create-quiz-pdf"];
    const adminRoutes = ["/overview", "/adminprofile"];

    const { pathname } = req.nextUrl;
    console.log(pathname);

    if ([...protectedRoutes, ...adminRoutes].includes(pathname)) {
        if (!userId) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if (adminRoutes.includes(pathname)) {
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    if(protectedRoutes.includes(pathname)) { 
        if(userRole === "admin") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/overview", "/history", "/profile", "/admindashboard", "/adminprofile", "/create-quiz-pdf", "/create-quiz"],
};

export default middleware;