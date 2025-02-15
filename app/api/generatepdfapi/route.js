import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic"; 

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { pdfContent } = await req.json();
    console.log("Received PDF Content:", pdfContent.substring(0, 500)); // Log first 500 chars for debugging

    if (!pdfContent) {
      return new Response(JSON.stringify({ error: "PDF content is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 1: Extract Topic Dynamically
    const topicPrompt = `
      Analyze the following content and extract the main topic concisely in a single sentence.
      Content: """${pdfContent}"""
    `;

    const topicResult = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: z.object({ topic: z.string() }),
      prompt: topicPrompt,
    });

    const topic = topicResult.object?.topic || "General Knowledge";
    console.log("Detected Topic:", topic);

    // Step 2: Generate Quiz Questions Based on the Topic
    const difficulty = 'intermediate';

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

    console.log("AI Generated Quiz:", JSON.stringify(result.object, null, 2));

    // ✅ Save Quiz Metadata
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        difficultyLevel: difficulty,
        numberOfQuestions: 15, // 5 MCQ + 5 MSQ + 5 FIB
        typeOfQuestions: ["MCQ", "MSQ", "FIB"],
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

    // ✅ Save FIB Questions
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
        topic,
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
