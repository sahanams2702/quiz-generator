export async function GET(req) {
    const userId = req.nextUrl.searchParams.get("userId");

    const quizzes = await prisma.quiz.findMany({ where: { user_id: userId } });

    return NextResponse.json({ quizzes }, { status: 200 });
}
