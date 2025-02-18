import {NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const {email, password} = await req.json();
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (!existingUser) {
            return NextResponse.json({error: "User does not exist"}, {status: 400});
        }
        if (existingUser.password !== password) {
            return NextResponse.json({error: "Invalid password"}, {status: 400});
        }
        return NextResponse.json({message: "Login successful", user: existingUser}, {status: 200});
    }
    catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}