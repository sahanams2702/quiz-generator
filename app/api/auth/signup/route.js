import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: { name, email, password },
        });

        return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
