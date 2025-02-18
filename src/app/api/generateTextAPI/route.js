import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"; 

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { subject } = await req.json();
console.log("Request Payload:", { subject});


    const topic = subject;
    const queno = 5; 
    const difficulty = 'intermediate';

    // Prompt for all three question types
    const finalPrompt = `
      Generate a ${difficulty} level quiz on the topic: "${topic}".
      - Create 5 Multiple Choice Questions (MCQs) with exactly 4 options each, marking one correct answer.
      - Create 5 Multiple Selection Questions (MSQs) with 4 options, where multiple answers may be correct.
      - Create 5 Fill-in-the-Blank (FIB) questions with a single correct answer.
      Ensure that the questions are clear, relevant to the topic, and appropriate for an intermediate-level audience.
    `;

    const quizSchema = z.object({
      MCQ: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctAnswer: z.string(),
          })
        ),
      }),
      MSQ: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctAnswers: z.array(z.string()).min(1),
          })
        ),
      }),
      FIB: z.object({
        questions: z.array(
          z.object({
            question: z.string(),
            correctAnswer: z.string(),
          })
        ),
      }),
    });

    const result = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: quizSchema,
      prompt: finalPrompt,
    });

    console.log("AI Response:", JSON.stringify(result.object, null, 2));

    // ✅ Save Quiz Metadata
    const userId = (await cookies()).get("user_id")?.value;
    console.log("User Id:", userId);
    console.log("QUIZ : ", userId, topic, difficulty, queno);
    const quiz = await prisma.quiz.create({
      data: {
        userId: Number(userId),
        topic,
        difficultyLevel: difficulty,
        numberOfQuestions: queno * 3, // 15 questions in total
        typeOfQuestions: ["MCQ", "MSQ", "FIB"], // Assuming your DB supports text[]
      },
    });

    // ✅ Save MCQ Questions
    if (result.object.MCQ) {
      await prisma.mCQ.createMany({
        data: result.object.MCQ.questions.map((q) => ({
          quizId: quiz.id,
          questionText: q.question,
          option1: q.options[0],
          option2: q.options[1],
          option3: q.options[2],
          option4: q.options[3],
          correctAnswer: q.correctAnswer,
        })),
      });
    }

    // ✅ Save MSQ Questions
    if (result.object.MSQ) {
      await prisma.mSQ.createMany({
        data: result.object.MSQ.questions.map((q) => ({
          quizId: quiz.id,
          questionText: q.question,
          option1: q.options[0],
          option2: q.options[1],
          option3: q.options[2],
          option4: q.options[3],
          correctAnswers: q.correctAnswers, 
        })),
      });
    }

    if (result.object.FIB) {
      await prisma.fIB.createMany({
        data: result.object.FIB.questions.map((q) => ({
          quizId: quiz.id,
          questionText: q.question,
          correctAnswer: q.correctAnswer,
        })),
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        questions: {
          MCQ: result.object.MCQ?.questions || [],
          MSQ: result.object.MSQ?.questions || [],
          FIB: result.object.FIB?.questions || [],
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
