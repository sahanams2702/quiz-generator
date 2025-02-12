import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import { generateQuizQuestions } from "@/services/aiService"; 

export async function POST(req) {
    try {
        const { userId, topic, difficultyLevel, numberOfQuestions, typeOfQuestions } = await req.json();

        if (!userId || !topic || !difficultyLevel || !numberOfQuestions || !typeOfQuestions) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        //const generatedQuestions = await generateQuizQuestions({ topic, difficulty_level, number_of_questions, type_of_questions });
        const generatedQuestions = [
            {
                type: "MCQ",
                questionText: "What is the capital of India?",
                option1: "Mumbai",
                option2: "Delhi",
                option3: "Kolkata",
                option4: "Chennai",
                correctAnswer: "Delhi"
            },
            {
                type: "MSQ",
                questionText: "Which of the following are programming languages?",
                option1: "HTML",
                option2: "CSS",
                option3: "Python",
                option4: "Java",
                correctAnswers: ["Python", "Java"]
            },
            {
                type: "FIB",
                questionText: "The capital of France is ___________",
                correctAnswer: "Paris"
            }
        ];

        if (!generatedQuestions || generatedQuestions.length === 0) {
            return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
        }

        // 2. Create the quiz record in the database
        const quiz = await prisma.quiz.create({
            data: {
                userId,
                topic,
                difficultyLevel,
                numberOfQuestions,
                typeOfQuestions
            }
        });

        // 3. Insert generated questions into respective tables
        const quizId = quiz.id;
        let storedQuestions = [];

        for (const question of generatedQuestions) {
            if (question.type === "MCQ") {
                const storedQuestion = await prisma.MCQ.create({
                    data: {
                        quizId,
                        questionText: question.questionText,
                        option1: question.option1,
                        option2: question.option2,
                        option3: question.option3,
                        option4: question.option4,
                        correctAnswer: question.correctAnswer
                    }
                });
                storedQuestions.push(storedQuestion);
            } else if (question.type === "MSQ") {
                const storedQuestion = await prisma.MSQ.create({
                    data: {
                        quizId,
                        questionText: question.questionText,
                        option1: question.option1,
                        option2: question.option2,
                        option3: question.option3,
                        option4: question.option4,
                        correctAnswers: question.correctAnswers
                    }
                });
                storedQuestions.push(storedQuestion);
            } else if (question.type === "FIB") {
                const storedQuestion = await prisma.FIB.create({
                    data: {
                        quizId,
                        questionText: question.questionText,
                        correctAnswer: question.correctAnswer
                    }
                });
                storedQuestions.push(storedQuestion);
            }
        }

        // 4. Return the created quiz and stored questions
        return NextResponse.json({
            message: "Quiz created successfully",
            quiz,
            questions: storedQuestions
        }, { status: 201 });

    } catch (error) {
        console.log("Create quiz error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
