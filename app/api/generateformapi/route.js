// app/api/generateTextapi/route.js
// import { generateObject } from "ai";
// import { google } from "@ai-sdk/google";
// import { z } from "zod";
// import { PrismaClient } from "@prisma/client";
// export const dynamic = "force-dynamic"; 

// const prisma = new PrismaClient();

// export async function POST(req) {
  
//   try {
//     const { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic } = await req.json();
//     console.log("Request Payload:", { subject, numberOfQuestions, difficultyLevel, questionTypes, specificTopic });

    
//     const mappedQuestionType = questionTypes[0] === "multiple-choice" ? "MCQ" :
//                                questionTypes[0] === "multiple-selection" ? "MSQ" :
//                                questionTypes[0] === "fill-in-the-blank" ? "FIB" :
//                                questionTypes[0]; 
//     const topic = subject;
//     const queno = numberOfQuestions;
//     const difficulty = difficultyLevel;
//     const qtype = mappedQuestionType; 
//     const qadd = specificTopic;
    
//     console.log("Processed Payload:", { topic, queno, difficulty, qtype, qadd });

//     let prompt = `Generate a ${difficulty} level quiz on the topic of ${topic}. Focus the questions specifically on ${qadd ? qadd : "general aspects"} within ${topic}. Generate ${queno} ${qtype} questions.`;

//     let QuizSchema;
//     if (qtype === "MCQ") {
//       prompt += ` Each question should have 4 answer options and one correct answer clearly marked.`;
//       QuizSchema = z.object({
//         questions: z.array(
//           z.object({
//             question: z.string(),
//             options: z.array(z.string()).length(4),
//             correctAnswer: z.string(),
//           })
//         ),
//       });
//     } else if (qtype === "MSQ") {
//       prompt += ` Each question should have 4 options with multiple correct answers.`;
//       QuizSchema = z.object({
//         questions: z.array(
//           z.object({
//             question: z.string(),
//             options: z.array(z.string()).length(4),
//             correctAnswers: z.array(z.string()).min(1),
//           })
//         ),
//       });
//     } else if (qtype === "FIB") {
//       prompt += ` Each question should be a fill-in-the-blank question with a single correct answer.`;
//       QuizSchema = z.object({
//         questions: z.array(
//           z.object({
//             question: z.string(),
//             correctAnswer: z.string(),
//           })
//         ),
//       });
//     } else {
//       return new Response(JSON.stringify({ error: "Invalid question type" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const result = await generateObject({
//       model: google("gemini-1.5-pro-latest"),
//       schema: QuizSchema,
//       prompt: prompt,
//     });

//     console.log("AI Response:", JSON.stringify(result.object, null, 2));

//     const quiz = await prisma.quiz.create({
//       data: {
//         // userId,
//         topic,
//         difficultyLevel: difficulty,
//         numberOfQuestions: queno,
//         typeOfQuestions: qtype,
//       },
//     });

//     // Save Questions Based on Type
//     if (qtype === "MCQ") {
//       await prisma.mCQ.createMany({
//         data: result.object.questions.map((q) => ({
//           quizId: quiz.id,
//           questionText: q.question,
//           option1: q.options[0],
//           option2: q.options[1],
//           option3: q.options[2],
//           option4: q.options[3],
//           correctAnswer: q.correctAnswer,
//         })),
//       });
//     } else if (qtype === "MSQ") {
//       await prisma.mSQ.createMany({
//         data: result.object.questions.map((q) => ({
//           quizId: quiz.id,
//           questionText: q.question,
//           option1: q.options[0],
//           option2: q.options[1],
//           option3: q.options[2],
//           option4: q.options[3],
//           correctAnswers: q.correctAnswers, // Array type
//         })),
//       });
//     } else if (qtype === "FIB") {
//       await prisma.fIB.createMany({
//         data: result.object.questions.map((q) => ({
//           quizId: quiz.id,
//           questionText: q.question,
//           correctAnswer: q.correctAnswer,
//         })),
//       });
//     }

//     return new Response(
//       JSON.stringify({ success: true, quizId: quiz.id, questions: result.object.questions }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error generating quiz:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
  
// }


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
      type === "fill-in-the-blank" ? "FIB" :
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

    // Construct AI prompt
    let prompt = `Generate a ${difficulty} level quiz on the topic of ${topic}. 
                  Focus the questions specifically on ${qadd ? qadd : "general aspects"} within ${topic}.
                  Generate ${queno} questions of types: ${qtype.join(", ")}.`; 

    if (qtype.includes("MCQ")) {
      prompt += ` Some questions should be multiple-choice (MCQ) with 4 answer options and one correct answer.`;
    }
    if (qtype.includes("MSQ")) {
      prompt += ` Some questions should be multiple-selection (MSQ) with 4 options, where multiple answers are correct.`;
    }
    if (qtype.includes("FIB")) {
      prompt += ` Each question should be a fill-in-the-blank question with a single correct answer. The correct answer must be exactly one word.`;
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



