import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (!existingUser) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }

        if (existingUser.password !== password) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const isAdmin = existingUser.isAdmin;

        // Store authentication & role in cookies
        cookies().set("user_id", existingUser.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        cookies().set("user_role", isAdmin ? "admin" : "user", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return NextResponse.json({ 
            message: "Login successful", 
            user: { id: existingUser.id, email: existingUser.email, isAdmin }
        }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
