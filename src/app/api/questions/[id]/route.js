import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const id = Number(params.id);
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        console.log("GET question id:", id);
        console.log("GET question type:", type);
        console.log("params:", params);

        if (!id || !type) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        let question;
        if (type === "MCQ") {
            question = await prisma.MCQ.findUnique({ where: { id } });
        } else if (type === "MSQ") {
            question = await prisma.MSQ.findUnique({ where: { id } });
        } else if (type === "FIB") {
            question = await prisma.FIB.findUnique({ where: { id } });
        } else {
            return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
        }

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        return NextResponse.json(question, { status: 200 });

    } catch (error) {
        console.error("GET question error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const id = Number(params.id);
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        if (!id || !type) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        let deletedQuestion;
        if (type === "MCQ") {
            deletedQuestion = await prisma.MCQ.delete({ where: { id } });
        } else if (type === "MSQ") {
            deletedQuestion = await prisma.MSQ.delete({ where: { id } });
        } else if (type === "FIB") {
            deletedQuestion = await prisma.FIB.delete({ where: { id } });
        } else {
            return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
        }

        return NextResponse.json({ message: "Question deleted successfully", deletedQuestion }, { status: 200 });

    } catch (error) {
        console.error("DELETE question error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const id = Number(params.id);
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        const body = await req.json();
        const { questionText, option1, option2, option3, option4, correctAnswer, correctAnswers } = body;

        if (!id || !type) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        let updatedQuestion;
        if (type === "MCQ") {
            updatedQuestion = await prisma.MCQ.update({
                where: { id },
                data: { questionText, option1, option2, option3, option4, correctAnswer }
            });
        } else if (type === "MSQ") {
            updatedQuestion = await prisma.MSQ.update({
                where: { id },
                data: { questionText, option1, option2, option3, option4, correctAnswers }
            });
        } else if (type === "FIB") {
            updatedQuestion = await prisma.FIB.update({
                where: { id },
                data: { questionText, correctAnswer }
            });
        } else {
            return NextResponse.json({ error: "Invalid question type" }, { status: 400 });
        }

        return NextResponse.json(updatedQuestion, { status: 200 });

    } catch (error) {
        console.error("PUT question error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
