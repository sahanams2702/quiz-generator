import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId, topic, difficulty, numQuestions, questionTypes } = await req.json();

        const quiz = await prisma.quiz.create({
            data: { user_id: userId, topic, difficulty_level: difficulty, number_of_questions: numQuestions, type_of_questions: questionTypes }
        });

        return NextResponse.json({ message: "Quiz created", quiz }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Quiz creation failed" }, { status: 500 });
    }
}
