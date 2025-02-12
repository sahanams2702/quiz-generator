import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}