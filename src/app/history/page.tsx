"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Trash2, ChevronDown, ChevronUp, Save } from "lucide-react";
import DashboardNav from "@/components/dashboard-nav";
import { getQuizzes, getQuestions } from "./action";
import axios from "axios";

// Define types
interface Quiz {
  id: number;
  createdAt: string;
  topic: string;
  difficultyLevel: string;
  numberOfQuestions: number;
  typeOfQuestions: string[];
}

interface Question {
  id: number;
  questionText: string;
  type: "MCQ" | "MSQ" | "FIB";
  correctAnswer?: string;
  correctAnswers?: string[];
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
}

export default function History() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<{
    [quizId: number]: { [key: string]: Question };
  }>({});
  const [editedQuestions, setEditedQuestions] = useState<{
    [key: string]: Question;
  }>({});
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const quizData: Quiz[] = await getQuizzes();
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const fetchQuestions = async (quizId: number) => {
    if (!questions[quizId]) {
      try {
        const questionData: Question[] = await getQuestions(quizId);
        const structuredQuestions = questionData.reduce((acc, q) => {
          const key = `${q.type}-${q.id}`;
          acc[key] = { ...q, type: q.type };
          return acc;
        }, {} as { [key: string]: Question });

        setQuestions((prev) => ({ ...prev, [quizId]: structuredQuestions }));
        setEditedQuestions(structuredQuestions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      setQuizzes((quizzes) => quizzes.filter((q) => q.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleEditChange = (
    key: string,
    field: keyof Question,
    value: string | string[]
  ) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className="fixed w-1/4 h-full">
        <DashboardNav />
      </div>

      <div className="flex-1 ml-[20%] px-4 py-12 flex justify-center items-center">
        <div className="container mx-auto p-8 rounded-2xl shadow-xl w-full max-w-4xl bg-white">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">
            History
          </h1>

          <div className="flex flex-col gap-4 mt-8">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id} className="relative w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">
                      {quiz.topic}
                    </CardTitle>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-5 gap-4 items-center">
                    <Badge variant="outline" className="px-3 py-1">
                      Level: {quiz.difficultyLevel}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      Questions: {quiz.numberOfQuestions}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1">
                      Type: {quiz.typeOfQuestions.join(", ")}
                    </Badge>

                    {/* View Details Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedQuiz(quiz);
                            fetchQuestions(quiz.id);
                          }}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                    </Dialog>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-[60%]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div>No quizzes found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Details Dialog */}
      {selectedQuiz && (
        <Dialog
          open={!!selectedQuiz}
          onOpenChange={() => setSelectedQuiz(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-gray-900">
                {selectedQuiz.topic}
              </DialogTitle>
              <p className="text-gray-600 text-sm">
                Difficulty:{" "}
                <span className="font-semibold">
                  {selectedQuiz.difficultyLevel}
                </span>{" "}
                | Questions:{" "}
                <span className="font-semibold">
                  {selectedQuiz.numberOfQuestions}
                </span>{" "}
                | Type:{" "}
                <span className="font-semibold">
                  {selectedQuiz.typeOfQuestions.join(", ")}
                </span>
              </p>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {questions[selectedQuiz.id] &&
              Object.values(questions[selectedQuiz.id]).length > 0 ? (
                Object.values(questions[selectedQuiz.id]).map((question) => {
                  const key = `${question.type}-${question.id}`;

                  return (
                    <div
                      key={key}
                      className="border rounded-lg p-5 bg-white shadow-sm"
                    >
                      {/* Question Text */}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {question.questionText}
                      </h3>

                      {/* Options for MCQ & MSQ */}
                      {(question.type === "MCQ" || question.type === "MSQ") && (
                        <div className="mt-3 space-y-2">
                          {[1, 2, 3, 4].map((num) => {
                            const optionKey = `option${num}` as keyof Question;
                            return (
                              question[optionKey] && (
                                <p
                                  key={optionKey}
                                  className="text-gray-700 p-2 rounded-md border bg-gray-50"
                                >
                                  {`Option ${num}:`}{" "}
                                  <span className="font-medium">
                                    {question[optionKey]}
                                  </span>
                                </p>
                              )
                            );
                          })}
                        </div>
                      )}

                      {/* Correct Answer(s) */}
                      <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500">
                        <h4 className="text-green-700 font-semibold">
                          {question.type === "MSQ"
                            ? "Correct Answers:"
                            : "Correct Answer:"}
                        </h4>
                        <p className="text-gray-900 font-medium">
                          {question.type === "MSQ"
                            ? question.correctAnswers?.join(", ")
                            : question.correctAnswer}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600">No questions found.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
