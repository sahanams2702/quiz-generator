import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const userid = Number(params.userid);
    const quiz = await prisma.quiz.findMany({
        where: {
            userId: userid
        }
    });

    return NextResponse.json(quiz, { status: 200 });
}
