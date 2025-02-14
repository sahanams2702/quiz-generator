import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {

    let res = {};
    
    const mcqQuestions = await prisma.MCQ.findMany();
    const msqQuestions = await prisma.MSQ.findMany();
    const fibQuestions = await prisma.FIB.findMany();

    res = {
        mcqQuestions,
        msqQuestions,
        fibQuestions
    };

    return NextResponse.json(res, { status: 200 });
}
