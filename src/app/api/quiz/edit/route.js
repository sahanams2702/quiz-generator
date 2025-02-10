export async function PUT(req) {
    const { quizId, questions } = await req.json();

    for (let question of questions) {
        if (question.type === "MCQ") {
            await prisma.mcq_table.update({
                where: { id: question.id },
                data: { question_text: question.text, correct_answer: question.correct }
            });
        }
    }

    return NextResponse.json({ message: "Quiz updated" }, { status: 200 });
}
