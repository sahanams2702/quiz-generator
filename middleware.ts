// import { NextResponse } from "next/server";

// import jwt from "jsonwebtoken";



// const SECRET_KEY = "your-secret-key"; // Use env variable in production

// export function verifyToken(token: any) {
//   try {
//     return jwt.verify(token, SECRET_KEY);
//   } catch (error) {
//     return null;
//   }
// }


// export function middleware(req: { cookies: { get: (arg0: string) => any; }; }) {
//   const token = req.cookies.get("auth_token"); // Get token from cookies

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
//   }

//   const isValid = verifyToken(token.value);
//   if (!isValid) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 403 });
//   }

//   return NextResponse.next(); // Allow the request to proceed
// }

// // Apply middleware only to protected API routes
// export const config = {
//   matcher: ["/api/protected/:path*"], // Protect all API routes under /api/protected/*
// };
