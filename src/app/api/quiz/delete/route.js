export async function DELETE(req) {
    const quizId = req.nextUrl.searchParams.get("quizId");

    await prisma.quiz.delete({ where: { id: quizId } });

    return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
}
