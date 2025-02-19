"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  History,
  LayoutList,
  Send,
  X,
  Download,
} from "lucide-react";
import DashboardNav from "@/components/dashboard-nav";
import { getQuizzes } from "./action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateTopicAPI } from "@/services/generateTextService";

function App() {
  const [showPopover, setShowPopover] = useState(false);
  const [questions, setQuestions] = useState<
    Array<{ question: string; options: string[]; answer: string }>
  >([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { subject: "" },
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const data = await generateTopicAPI(values);
        console.log("API Response:", data);

        if (data && data.questions) {
          const allQuestions = [
            ...(data.questions.FIB || []).map((q) => ({
              question: q.question,
              options: [],
              answer: q.correctAnswer,
            })),
            ...(data.questions.MCQ || []).map((q) => ({
              question: q.question,
              options: q.options || [],
              answer: q.correctAnswer,
            })),
            ...(data.questions.MSQ || []).map((q) => ({
              question: q.question,
              options: q.options || [],
              answer: q.correctAnswers.join(", "), // Handle multiple correct answers
            })),
          ];
          setQuestions(allQuestions);
          setShowPopover(true);
        } else {
          setQuestions([]);
          console.error("Invalid API response format:", data);
        }
      } catch (error) {
        console.error("Error generating quiz:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDownload = () => {
    const quizContent = `
Quiz subject: ${formik.values.subject}

${questions
  .map(
    (q, index) => `Question ${index + 1}: ${q.question}
Options:
${q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n")}
Correct Answer: ${q.answer}`
  )
  .join("\n")}
`;

    const blob = new Blob([quizContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formik.values.subject.toLowerCase().replace(/\s+/g, "-")}-quiz.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [numberOfQuizzesOfUser, setNumberOfQuizzesOfUser] = useState(0);
  const [quizzesOfUser, setQuizzesOfUser] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  const [lastQuizDate, setLastQuizDate] = useState();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await getQuizzes();
        setNumberOfQuizzesOfUser(quizData.data.length);
        setQuizzesOfUser(quizData.data);
        setNumberOfQuestions(quizData.data.reduce((total, quiz) => total + quiz.numberOfQuestions, 0));
        console.log(quizData.data.length);
        setLastQuizDate(quizData.data[quizData.data.length - 1].topic);
        console.log(quizData.data[Number(quizData.data.length) - 1]);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className="w-64 border-r fixed">
        <DashboardNav />
      </div>
      <div className="p-6 ml-[20%] w-full px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Total Quizzes", value: numberOfQuizzesOfUser, icon: <LayoutDashboard className="w-6 h-6" /> },
            { title: "Questions Generated", value: numberOfQuestions, icon: <BookOpen className="w-6 h-6" /> },
            { title: "Last Quiz Generated", value: lastQuizDate, icon: <Clock className="w-6 h-6" /> },
          ].map((card, index) => (
            <div key={index} className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{card.title}</h3>
                {card.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Quiz & History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Quick Quiz Form */}
          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-xl font-bold mb-6">Quick Quiz</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...formik.getFieldProps("subject")}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter quiz subject"
                />
                {formik.touched.subject && formik.errors.subject && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.subject}</div>
                )}
              </div>
              <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-lg">
                {loading ? "Generating..." : "Create Quiz"}
              </button>
            </form>
          </div>

          {/* User History */}
          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <h2 className="text-xl font-bold mb-6">Recent Quizzes</h2>
            <div className="space-y-4">
              {quizzesOfUser.length > 0 ? (
                quizzesOfUser.map((quiz, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <span className="font-bold">{quiz.topic}</span>
                    <div className="text-sm text-blue-600">
                      <LayoutList className="w-4 h-4 mr-1 inline" />
                      {quiz.numberOfQuestions} Questions
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No quizzes available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
