import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { quizId, questions } = await req.json();

        for (let question of questions) {
            if (question.type === "MCQ") {
                await prisma.mcq_table.create({
                    data: { quiz_id: quizId, question_text: question.text, option1: question.options[0], option2: question.options[1], option3: question.options[2], option4: question.options[3], correct_answer: question.correct }
                });
            } else if (question.type === "MSQ") {
                await prisma.msq_table.create({
                    data: { quiz_id: quizId, question_text: question.text, option1: question.options[0], option2: question.options[1], option3: question.options[2], option4: question.options[3], correct_answers: question.correct }
                });
            } else {
                await prisma.fib_table.create({
                    data: { quiz_id: quizId, question_text: question.text, correct_answer: question.correct }
                });
            }
        }

        return NextResponse.json({ message: "Questions generated and stored" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }
}
