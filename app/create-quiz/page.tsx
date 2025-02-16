"use client";
import React, { useState } from "react";
import {
  BookOpen,
  Brain,
  List,
  AlertCircle,
  X,
  Download,
} from "lucide-react";
import DashboardNav from "@/components/dashboard-nav";
import { generateTextAPI } from "@/services/generateformservice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect } from "react";



type QuestionType = "multiple-choice" | "multiple-selection" | "fib";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";

interface QuizForm {
  subject: string;
  numberOfQuestions: number;
  difficultyLevel: DifficultyLevel;
  questionTypes: QuestionType[];
  specificTopic: string;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  type: QuestionType;
}

function CreateQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  useEffect(() => {
    console.log("Updated Questions:", generatedQuestions);
  }, [generatedQuestions]);

  const initialValues: QuizForm = {
    subject: "",
    numberOfQuestions: 0,
    difficultyLevel: "intermediate",
    questionTypes: ["multiple-choice"],
    specificTopic: "",
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    numberOfQuestions: Yup.number()
      .min(1, "At least 1 question")
      .max(50, "Max 50 questions")
      .required("Number of questions is required"),
    difficultyLevel: Yup.string()
      .oneOf(["beginner", "intermediate", "advanced"], "Invalid difficulty level")
      .required("Difficulty level is required"),
    specificTopic: Yup.string().required("Specific topic is required"),
    questionTypes: Yup.array().min(1, "At least one question type is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: QuizForm) => {
      setIsLoading(true);
      try {
        const questions = await generateTextAPI(values);
        console.log("API Response:", questions); // Debugging

        if (questions.success && questions.questions) {
          const allQuestions = [
            ...(questions.questions.MCQ || []),
            ...(questions.questions.MSQ || []),
            ...(questions.questions.FIB || []),
          ].map((q, index) => ({
            id: index + 1,
            question: q.question,
            options: q.options || [],
            answer: q.answer || "Answer not available", // Fix for missing answers
            type: q.type || "multiple-choice",
          }));

          if (allQuestions.length > 0) {
            setGeneratedQuestions(allQuestions);
            setShowPopover(true);
          } else {
            console.error("No valid questions received.");
          }
        } else {
          console.error("Error generating quiz:", questions.error);
        }
      } catch (error) {
        console.error("Error processing API:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: "multiple-choice", label: "Multiple Choice Question" },
    { value: "multiple-selection", label: "Multiple Selection Question" },
    { value: "fib", label: "Fill in the Blank (FIB)" },
  ];

  const handleDownload = () => {
    const content = generatedQuestions
      .map((q, index) => {
        let questionText = `Question ${index + 1}: ${q.question}\n`;
        
        if (q.options) {
          questionText += `Options:\n${q.options
            .map((option, i) => `${String.fromCharCode(65 + i)}. ${option}`)
            .join("\n")}\n`;
        }
        
        questionText += `Correct Answer: ${q.answer}\n`;
        return questionText;
      })
      .join("\n");
  
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formik.values.subject.toLowerCase().replace(/\s+/g, "-")}-quiz.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      {/* Sidebar */}
      <div className="fixed">
        <DashboardNav />
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-black">Create New Quiz</h1>
              <p className="mt-2 text-black">Fill in the details to generate your quiz</p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., Java, NextJS"
                />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg">
                {isLoading ? "Generating..." : "Create Quiz"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Popover for Generated Quiz */}
      {showPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quiz: {formik.values.subject}</h2>
                <div className="flex gap-4">
                  <button onClick={handleDownload} className="text-blue-600">
                    <Download className="w-6 h-6" />
                  </button>
                  <button onClick={() => setShowPopover(false)} className="text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              {generatedQuestions.map((question, index) => (
                <div key={question.id} className="border-b pb-6">
                  <h3 className="text-lg font-semibold">{index + 1}. {question.question}</h3>
                  {question.options.length > 0 && (
  <ul>
    {question.options.map((opt, i) => (
      <li key={i}>{String.fromCharCode(65 + i)}. {opt}</li>
    ))}
  </ul>
)}

                  <p className="mt-2 text-green-600 font-medium">Correct Answer: {question.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuiz;
