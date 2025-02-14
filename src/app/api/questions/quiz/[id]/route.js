import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const questions = []

    const quizId = Number(params.id);
    const mcqQuestions = await prisma.mcq.findMany({
        where: {
            quizId
        }
    });

    const msqQuestions = await prisma.msq.findMany({
        where: {
            quizId
        }
    });

    const fibQuestions = await prisma.fib.findMany({
        where: {
            quizId
        }
    });

    questions.push(...mcqQuestions, ...msqQuestions, ...fibQuestions);

    return NextResponse.json(questions, { status: 200 });
}