import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
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
    const qadd = specificTopic;

    console.log("Processed Payload:", { topic, queno, difficulty, qtype, qadd });
    let prompt = `
    Generate a quiz on the topic of ${topic}. 
    Generate ${queno} questions, ensuring each question has clear options and a correct answer.`;
    if (qadd) {
      prompt += ` The quiz should also cover the specific topic of ${qadd}.`;
    }

    if (qtype.includes("MCQ")) {
      prompt += `
      Include multiple-choice questions (MCQ) with exactly 4 options and one correct answer. 
      For each MCQ question, make sure to include 4 options and one correct answer. The answer should be one of the options.`;
    }

    if (qtype.includes("MSQ")) {
      prompt += `
      Include multiple-selection questions (MSQ) with exactly 4 options, where multiple answers are correct.
      Make sure to clearly indicate which answers are correct, but allow to make sure of selecting multiple correct options.`;
    }

    if (qtype.includes("FIB")) {
      prompt += `
      Include fill-in-the-blank (FIB) questions with only the correct answer and no options. The correct answer must be a single word.`;
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
        })
      ),
    });

    // Generate Quiz Questions using AI
    const result = await generateObject({
      model: google("gemini-1.5-pro-latest"),
      schema: QuizSchema,
      prompt: prompt,
    });

    // console.log("AI Response:", JSON.stringify(result.object, null, 2));
    console.log("Generated Quiz Questions:\n");

    result.object.questions.forEach((q, index) => {
      console.log(`Q${index + 1}: ${q.question}\n`);

      if (q.options) {
        q.options.forEach((option, i) => {
          const optionLabel = String.fromCharCode(65 + i); // Convert 0 → A, 1 → B, 2 → C, 3 → D
          console.log(`  ${optionLabel}. ${option}`);
        });
      }

      if (q.correctAnswer) {
        console.log(`\n✅ Correct Answer: ${q.correctAnswer}\n`);
      }

      if (q.correctAnswers) {
        console.log(`\n✅ Correct Answers: ${q.correctAnswers.join(", ")}\n`);
      }

      console.log("-".repeat(50)); // Separator line
    });

    // Create a quiz entry in the database
    const userId = await (await cookies()).get
    console.log("User ID:", userId);
    const quiz = await prisma.quiz.create({
      data: {
        userId,
        topic,
        difficultyLevel: difficulty,
        numberOfQuestions: queno,
        typeOfQuestions: qtype, // Ensure array format
      },
    });

    // Store questions based on type
    const questions = result.object.questions;

    if (qtype.includes("MCQ")) {
      const mcqData = questions
        .filter(q => q.options && q.correctAnswer)
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

    if (qtype.includes("MSQ")) {
      const msqData = questions
        .filter(q => q.options && q.correctAnswers)
        .map(q => ({
          quizId: quiz.id,
          questionText: q.question,
          option1: q.options[0],
          option2: q.options[1],
          option3: q.options[2],
          option4: q.options[3],
          correctAnswers: q.correctAnswers,
        }));
      if (msqData.length) await prisma.mSQ.createMany({ data: msqData });
    }

    if (qtype.includes("FIB")) {
      const fibData = questions
        .filter(q => q.correctAnswer)
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
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
