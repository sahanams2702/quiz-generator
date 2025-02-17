'use client'

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { generatePDFAPI } from "@/services/generatepdfservice";
import { Upload, Download, X } from "lucide-react";
import DashboardNav from "@/components/dashboard-nav";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";  // Import SweetAlert2

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Question {
  id?: number;
  question: string;
  options?: string[];
  answer: string | string[];
  type: "multiple-choice" | "multiple-selection" | "fib";
}

function CreateQuizPDF() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [googleFormLink, setGoogleFormLink] = useState("");

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
      doc.setTextColor(0, 128, 0); // Set green color for correct answer
      doc.text(`✔ Correct Answer: ${correctAnsText}`, 10, yPosition);
      doc.setTextColor(0, 0, 0); // Reset text color to black

      yPosition += 10; // Space before next question
    });

    doc.save("quiz.pdf");
  };

  const formik = useFormik({
    initialValues: { file: null as File | null },
    validationSchema: Yup.object({
      file: Yup.mixed().required("A PDF file is required"),
    }),
    onSubmit: async (values) => {
      if (!values.file) {
        console.error("No file selected!");
        return;
      }
      setIsLoading(true);
      try {
        const extractedText = await extractTextFromPDF(values.file);
        const response = await generatePDFAPI({ pdfContent: extractedText });

        const allQuestions = [
          ...(response.questions.MCQ || []).map((q) => {
            return {
              question: q.question,
              options: q.options || [],
              answer: q.correctAnswer || q.answer || "",
              type: "multiple-choice",
            };
          }),

          ...(response.questions.MSQ || []).map((q) => {
            return {
              question: q.question,
              options: q.options || [],
              answer: Array.isArray(q.correctAnswers) ? q.correctAnswers : [],
              type: "multiple-selection",
            };
          }),

          ...(response.questions.FIB || []).map((q) => {
            return {
              question: q.question,
              answer: q.correctAnswer || q.answer || "",
              type: "fib",
            };
          }),
        ];

        setGeneratedQuestions(allQuestions);

        Swal.fire({
          title: "Quiz Generated!",
          text: "Your quiz has been generated successfully. Click continue to view the quiz.",
          icon: "success",
          confirmButtonText: "Continue",
          confirmButtonColor: '#2d3748', // Dark background color (gray-800)
          customClass: {
            confirmButton: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }
        }).then(() => {
          setShowPopover(true); // Show popover when the user clicks Continue
        });
        

        createGoogleForm(allQuestions);
      } catch (error) {
        console.error("Error processing PDF:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const createGoogleForm = async (questions: Question[]) => {
    if (!questions.length) return;

    const apiUrl =
      "https://script.google.com/macros/s/AKfycbzjUouIv_H3wubcvCCO5yWL5qGh6hLgrV6tJ0vDvD8/dev";
    const quizData = {
      title: "AI-Generated Quiz",
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options || [],
        correctIndex: q.options
          ? Array.isArray(q.answer)
            ? q.answer
                .map((ans) => q.options?.indexOf(ans))
                .filter((i) => i !== -1)
            : q.options.indexOf(q.answer)
          : -1,
      })),
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(quizData),
      });
      const data = await response.json();
      if (data.success) {
        setGoogleFormLink(data.url);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const pdf = await getDocument({ data: event.target?.result }).promise;
          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText +=
              textContent.items.map((item: any) => item.str).join(" ") + "\n";
          }
          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className="fixed">
        <DashboardNav />
      </div>

      <div className="flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-black">
                Create New Quiz
              </h1>
              <p className="mt-2 text-black">Upload a PDF to generate a quiz</p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Upload className="w-4 h-4 mr-2 text-blue-600" /> Upload PDF
                  File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    formik.setFieldValue("file", e.target.files?.[0] || null);
                    formik.handleBlur(e);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                {formik.errors.file && formik.touched.file && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.file}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-800 text-white py-3 px-6 rounded-lg hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Generated Quiz
                </h2>
                <button
                  onClick={downloadQuizPDF}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" /> Download Quiz
                </button>

                <button
                  onClick={() => setShowPopover(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {generatedQuestions.map((q, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <h3 className="text-lg font-semibold">{q.question}</h3>
                    {q.options && (
                      <ul className="list-disc list-inside space-y-2">
                        {q.options.map((option, idx) => (
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-green-600 font-medium">
                      Correct Answer:{" "}
                      {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
                    </p>
                  </div>
                ))}
                {googleFormLink && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-100 text-center">
                    <p className="text-lg font-semibold text-gray-800">
                      Google Form Created!
                    </p>
                    <a
                      href={googleFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Open Google Form
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuizPDF;
