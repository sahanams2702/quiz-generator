import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const questions = []

    const quizId = Number(params.id);
    const mcqQuestions = await prisma.MCQ.findMany({
        where: {
            quizId
        }
    });

    const msqQuestions = await prisma.MSQ.findMany({
        where: {
            quizId
        }
    });

    const fibQuestions = await prisma.FIB.findMany({
        where: {
            quizId
        }
    });

    questions.push(...mcqQuestions, ...msqQuestions, ...fibQuestions);

    return NextResponse.json(questions, { status: 200 });
}