"use client";
import React, { useState } from "react";
import { BookOpen, Brain, List, AlertCircle, X, Download } from "lucide-react";
import DashboardNav from "@/components/dashboard-nav";
import { generateTextAPI } from "@/services/generateformservice";
import * as Yup from "yup";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";

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
      .oneOf(
        ["beginner", "intermediate", "advanced"],
        "Invalid difficulty level"
      )
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
        console.log("Fetched Questions:", questions); // Log the questions data to inspect it
    
        // Check if 'questions' exists in the response and is an array
        if (questions && Array.isArray(questions.questions)) {
          setGeneratedQuestions(questions.questions); // Directly set the questions
          // Show success SweetAlert with Continue button
          await Swal.fire({
            title: "Quiz Generated!",
            text: "Your quiz has been generated successfully. Click continue to view the quiz.",
            icon: "success",
            confirmButtonText: "Continue",
            confirmButtonColor: "#2d3748", 
            customClass: {
              confirmButton: "bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            },
          }).then(() => {
            setShowPopover(true);
          });
        } else {
          console.error("Error generating quiz: No questions found in the response");
        }
      } catch (error) {
        console.error("Error processing quiz generation:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
  });

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: "multiple-choice", label: "Multiple Choice Question" },
    { value: "multiple-selection", label: "Multiple Selection Question" },
    { value: "fib", label: "Fill in the Blank (FIB)" },
  ];

  const downloadQuizPDF = () => {
    if (!generatedQuestions.length) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Generated Quiz", 10, 10);

    let yPosition = 20; // Initial position

    generatedQuestions.forEach((q, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20; // Reset position for new page
      }

      doc.setFontSize(12);
      doc.text(`${index + 1}. ${q.question}`, 10, yPosition);
      yPosition += 7;

      if (q.options && q.options.length) {
        q.options.forEach((option, idx) => {
          doc.text(
            `  ${String.fromCharCode(65 + idx)}. ${option}`,
            15,
            yPosition
          );
          yPosition += 6;
        });
      }

      let correctAnsText = Array.isArray(q.answer)
        ? q.answer.join(", ")
        : q.answer;
      doc.setTextColor(0, 128, 0); 
      doc.text(`✔ Correct Answer: ${correctAnsText}`, 10, yPosition);
      doc.setTextColor(0, 0, 0); 

      yPosition += 10; 
    });

    doc.save("quiz.pdf");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      {/* Fixed Dashboard Navigation */}
      <div className="fixed">
        <DashboardNav />
      </div>

      {/* Main Content: Quiz Form */}
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-black">
                Create New Quiz
              </h1>
              <p className="mt-2 text-black">
                Fill in the details to generate your quiz
              </p>
            </div>

            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {/* Subject Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Subject Name
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Java, NextJS"
                />
                {formik.touched.subject && formik.errors.subject && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.subject}
                  </div>
                )}
              </div>

              {/* Number of Questions */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <List className="w-4 h-4 mr-2 text-blue-600" />
                  Number of Questions
                </label>
                <input
                  type="number"
                  name="numberOfQuestions"
                  value={formik.values.numberOfQuestions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min="1"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {formik.touched.numberOfQuestions &&
                  formik.errors.numberOfQuestions && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.numberOfQuestions}
                    </div>
                  )}
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Brain className="w-4 h-4 mr-2 text-blue-600" />
                  Difficulty Level
                </label>
                <select
                  name="difficultyLevel"
                  value={formik.values.difficultyLevel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {formik.touched.difficultyLevel &&
                  formik.errors.difficultyLevel && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.difficultyLevel}
                    </div>
                  )}
              </div>

              {/* Question Types */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Question Types
                </label>
                <div className="space-y-2">
                  {questionTypeOptions.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={formik.values.questionTypes.includes(
                          type.value
                        )}
                        onChange={() => {
                          const newTypes = formik.values.questionTypes.includes(
                            type.value
                          )
                            ? formik.values.questionTypes.filter(
                                (t) => t !== type.value
                              )
                            : [...formik.values.questionTypes, type.value];
                          formik.setFieldValue("questionTypes", newTypes);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.questionTypes &&
                  formik.errors.questionTypes && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.questionTypes}
                    </div>
                  )}
              </div>

              {/* Specific Topic */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Specific Topic
                </label>
                <input
                  type="text"
                  name="specificTopic"
                  value={formik.values.specificTopic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Exception Handling"
                />
                {formik.touched.specificTopic &&
                  formik.errors.specificTopic && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.specificTopic}
                    </div>
                  )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Create Quiz"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quiz: {formik.values.subject}
                </h2>
                <div className="flex gap-4">
                <button
                  onClick={downloadQuizPDF}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" /> Download Quiz
                </button>
                  <button
                    onClick={() => setShowPopover(false)}
                    className="text-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {generatedQuestions.length > 0 ? (
                  generatedQuestions.map((question, index) => (
                    <div key={index} className="border-b pb-6">
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {question.question}
                      </h3>
                      {question.options && question.options.length > 0 ? (
                        <ul className="list-disc list-inside space-y-2">
                          {question.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600"></p>
                      )}
                      <p className="mt-2 text-green-600 font-medium">
                        Correct Answer:{" "}
                        {question.type.toLowerCase() === "multiple-selection" ||
                        question.type.toLowerCase() === "msq"
                          ? question.correctAnswers?.join(", ")
                          : question.correctAnswer}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-red-600">
                    No questions generated yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuiz;
