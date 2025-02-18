import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    // Parse JSON payload from request
    const { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic } = await req.json();
    console.log("Request Payload:", { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic });

    // Ensure questionTypes is always an array
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

    // Define variables for easy access
    const topic = subject;
    const queno = numberOfQuestions;
    const difficulty = difficultyLevel;
    const qtype = mappedQuestionTypes; // Ensure it's always an array
    console.log(qtype)
    const qadd = specificTopic;

    console.log("Processed Payload:", { topic, queno, difficulty, qtype, qadd });

    let prompt = `Generate a quiz on the topic of ${topic}. Generate ${queno} questions, ensuring each question has clear options and a correct answer.`;
    if (qadd) {
      prompt += ` The quiz should also cover the specific topic of ${qadd}.`;
    }

    if (qtype.includes("MCQ")) {
      prompt += ` create ${queno} multiple-choice questions (MCQ) with exactly 4 options and one correct answer.`;
    }

    if (qtype.includes("MSQ")) {
      prompt += ` create ${queno} multiple-selection questions (MSQ) with exactly 4 options, where multiple answers are correct.`;
    }

    if (qtype.includes("FIB")) {
      prompt += ` create ${queno} fill-in-the-blank (FIB) questions with only the correct answer and no options.`;
    }

    console.log("Final AI Prompt:", prompt);

    // Define Schema to accommodate multiple question types
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

    // Generate Quiz Questions using AI
    const result = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: QuizSchema,
      prompt: prompt,
    });

    if (!result || !result.object.questions || result.object.questions.length === 0) {
      return new Response(
        JSON.stringify({ error: "No questions generated by AI" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Generated Quiz Questions:", result.object.questions);

    // Create a quiz entry in the database
    const quiz = await prisma.quiz.create({
      data: {
        topic,
        difficultyLevel: difficulty,
        numberOfQuestions: queno,
        typeOfQuestions: qtype, // Ensure array format
      },
    });

    // Store questions based on type
    const questions = result.object.questions;

    // Insert MCQ Questions
    if (qtype.includes("MCQ")) {
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

      if (mcqData.length) await prisma.mCQ.createMany({ data: mcqData });
    }

    // Insert MSQ Questions
    const msqData = questions
    .filter(q => q.options && q.correctAnswers && q.type === "MSQ")
    .map(q => ({
      quizId: quiz.id,
      questionText: q.question,
      option1: q.options[0],
      option2: q.options[1],
      option3: q.options[2],
      option4: q.options[3],
      correctAnswers: q.correctAnswers, // Pass as array, not joined string
    }));
  
  if (msqData.length) await prisma.mSQ.createMany({ data: msqData });
  

    // Insert FIB Questions
    if (qtype.includes("FIB")) {
      const fibData = questions
        .filter(q => q.correctAnswer && q.type === "FIB")
        .map(q => ({
          quizId: quiz.id,
          questionText: q.question,
          correctAnswer: q.correctAnswer,
        }));

      if (fibData.length) await prisma.fIB.createMany({ data: fibData });
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
