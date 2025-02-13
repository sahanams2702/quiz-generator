import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    const id = Number(params.id);
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: id
        }
    });

    if(!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    
    return NextResponse.json(quiz, { status: 200 });
}

export async function DELETE(req, { params }) {
    const id = Number(params.id);
    const quiz = await prisma.quiz.delete({
        where: {
            id: id
        }
    });

    return NextResponse.json(quiz, { status: 200 });
}