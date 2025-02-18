import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

// Initialize Prisma with logging
const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to the database!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
}

testDB();

export async function POST(req) {
  try {
    // Parse JSON payload
    const { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic } = await req.json();
    console.log("📩 Request Payload:", { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic });

    // Normalize question types
    const normalizedQuestionTypes = Array.isArray(questionTypes) ? questionTypes : [questionTypes];
    const mappedQuestionTypes = normalizedQuestionTypes.map(type =>
      type === "multiple-choice" ? "MCQ" :
      type === "multiple-selection" ? "MSQ" :
      type === "fib" ? "FIB" :
      type
    );

    if (!mappedQuestionTypes.length) {
      return new Response(JSON.stringify({ error: "Invalid question type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Construct AI Prompt
    let prompt = `Generate a quiz on the topic of ${subject}.`;
    if (specificTopic) prompt += ` The quiz should also cover the specific topic of ${specificTopic}.`;

    if (mappedQuestionTypes.includes("MCQ")) {
      prompt += ` Create ${numberOfQuestions} multiple-choice questions (MCQ) with exactly 4 options and one correct answer.`;
    }
    if (mappedQuestionTypes.includes("MSQ")) {
      prompt += ` Create ${numberOfQuestions} multiple-selection questions (MSQ) with exactly 4 options, where multiple answers should be correct correct.`;
    }
    if (mappedQuestionTypes.includes("FIB")) {
      prompt += ` Create ${numberOfQuestions} fill-in-the-blank (FIB) questions with only the correct answer and no options.`;
    }

    console.log("🎯 Final AI Prompt:", prompt);

    // Define AI Response Schema
    const QuizSchema = z.object({
      questions: z.array(
        z.object({
          question: z.string(),
          options: z.array(z.string()).optional(),
          correctAnswer: z.string().optional(),
          correctAnswers: z.array(z.string()).optional(),
          type: z.string(),
        })
      ),
    });

    // Generate AI Quiz
    const result = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: QuizSchema,
      prompt: prompt,
    });

    if (!result || !result.object.questions || result.object.questions.length === 0) {
      console.error("❌ AI did not generate any questions.");
      
    }

    console.log("✅ Generated Quiz Questions:", result.object.questions);

    // Retrieve user ID from cookies (defaulting to 1 for testing)
    const userId = cookies().get("user_id")?.value || "1";
    console.log("🆔 User ID:", userId);

    // Insert Quiz Entry in DB
    const quiz = await prisma.quiz.create({
      data: {
        userId: Number(userId),
        topic: subject,  // Fixed: Now using actual request data
        difficultyLevel: difficultyLevel,
        numberOfQuestions: numberOfQuestions,
        typeOfQuestions: mappedQuestionTypes,
      },
    });

    console.log("✅ Quiz saved:", quiz);

    // Ensure correct question type format
    const questions = result.object.questions.map(q => ({
      ...q,
      type: q.type.toUpperCase(),
    }));

    const mcqData = questions
      .filter(q => q.options && q.correctAnswer && q.type === "MCQ")
      .map(q => ({
        quizId: quiz.id,
        questionText: q.question,
        option1: q.options[0],
        option2: q.options[1],
        option3: q.options[2],
        option4: q.options[3],
        correctAnswer: q.correctAnswer,
      }));

    if (mcqData.length > 0) {
      await prisma.mCQ.createMany({ data: mcqData });
      // console.log(`✅ Inserted ${mcqData.length} MCQ questions`);
    }

    const msqData = questions
    .filter(q => q.options && q.correctAnswers && q.type === "MSQ")
    .map(q => ({
      quizId: quiz.id,
      questionText: q.question,
      option1: q.options[0],
      option2: q.options[1],
      option3: q.options[2],
      option4: q.options[3],
      correctAnswers: q.correctAnswers, // Make sure it's an array, not a string
    }));
  
  if (msqData.length > 0) {
    await prisma.mSQ.createMany({ data: msqData });
    // console.log(`✅ Inserted ${msqData.length} MSQ questions`);
  }
    const fibData = questions
      .filter(q => q.correctAnswer && q.type === "FIB")
      .map(q => ({
        quizId: quiz.id,
        questionText: q.question,
        correctAnswer: q.correctAnswer,
      }));

    if (fibData.length > 0) {
      await prisma.fIB.createMany({ data: fibData });
      // console.log(`✅ Inserted ${fibData.length} FIB questions`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ success: true, quizId: quiz.id, questions }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
