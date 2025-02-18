'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';
import { getQuizzes, getQuestions } from './action';
import axios from 'axios';

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
  type: 'MCQ' | 'MSQ' | 'FIB';
  correctAnswer?: string;
  correctAnswers?: string[];
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
}

export default function History() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);
  const [questions, setQuestions] = useState<{ [quizId: number]: { [key: string]: Question } }>({});
  const [editedQuestions, setEditedQuestions] = useState<{ [key: string]: Question }>({});

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const quizData: Quiz[] = await getQuizzes();
      setQuizzes(quizData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const toggleQuizQuestions = async (quiz: Quiz) => {
    if (expandedQuiz === quiz.id) {
      setExpandedQuiz(null);
    } else {
      setExpandedQuiz(quiz.id);
      if (!questions[quiz.id]) {
        try {
          const questionData: Question[] = await getQuestions(quiz.id);

          // Structure questions with unique keys
          const structuredQuestions = questionData.reduce((acc, q) => {
            const key = `${q.type}-${q.id}`;
            acc[key] = { ...q, type: q.type };
            return acc;
          }, {} as { [key: string]: Question });

          setQuestions((prev) => ({ ...prev, [quiz.id]: structuredQuestions }));
          setEditedQuestions(structuredQuestions);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      setQuizzes((quizzes) => quizzes.filter((q) => q.id !== quizId));
      setExpandedQuiz(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeleteQuestion = async (quizId: number, question: Question) => {
    try {
      await axios.delete(`/api/questions/${question.id}?type=${question.type}`);
      setQuestions((prev) => {
        const updatedQuestions = { ...prev[quizId] };
        delete updatedQuestions[`${question.type}-${question.id}`];
        return { ...prev, [quizId]: updatedQuestions };
      });
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditChange = (key: string, field: keyof Question, value: string | string[]) => {
    setEditedQuestions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleSaveChanges = async (question: Question) => {
    const key = `${question.type}-${question.id}`;
    try {
      await axios.put(`/api/questions/${question.id}?type=${question.type}`, editedQuestions[key]);
      setQuestions((prev) => ({
        ...prev,
        [expandedQuiz!]: {
          ...prev[expandedQuiz!],
          [key]: editedQuestions[key],
        },
      }));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className="fixed w-1/4 h-full">
        <DashboardNav />
      </div>

      <div className="flex-1 ml-[20%] px-4 py-12 flex justify-center items-center bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500">
        <div className="container mx-auto p-8 rounded-2xl shadow-xl w-full max-w-3xl bg-white">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">History</h1>

          <div className="flex flex-col gap-4 mt-8">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="w-full">
                  {/* Quiz Card */}
                  <Card className="relative w-full cursor-pointer" onClick={() => toggleQuizQuestions(quiz)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {new Date(quiz.createdAt).toLocaleString()}
                      </CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex flex-row items-center justify-between space-x-4 py-2">
                      <div className="text-lg font-bold">{quiz.topic}</div>
                      <div className="text-sm">{quiz.difficultyLevel}</div>
                      <div className="text-lg font-bold">{quiz.numberOfQuestions}</div>
                      <div className="text-lg font-bold">{quiz.typeOfQuestions.join(', ')}</div>
                      <div className="text-gray-600">
                        {expandedQuiz === quiz.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expanded Questions Div */}
                  {expandedQuiz === quiz.id && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                      <h2 className="text-lg font-bold">Questions</h2>
                      {questions[quiz.id] && Object.values(questions[quiz.id]).length > 0 ? (
                        Object.values(questions[quiz.id]).map((question) => {
                          const key = `${question.type}-${question.id}`;
                          return (
                            <div key={key} className="border p-4 rounded-lg mt-2 bg-white shadow">
                              <Input
                                value={editedQuestions[key]?.questionText || ''}
                                onChange={(e) => handleEditChange(key, 'questionText', e.target.value)}
                              />
                              <Textarea
                                value={editedQuestions[key]?.correctAnswer || ''}
                                onChange={(e) => handleEditChange(key, 'correctAnswer', e.target.value)}
                              />
                              <div className="flex justify-between mt-2">
                                <Button variant="secondary" size="sm" onClick={() => handleSaveChanges(question)}>
                                  <Save className="h-4 w-4 mr-1" /> Save
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(quiz.id, question)}>
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>No questions found.</p>
                      )}
                      <div className="flex justify-end mt-4">
                        <Button variant="destructive" onClick={() => handleDeleteQuiz(quiz.id)}>
                          <Trash2 className="h-5 w-5 mr-1" /> Delete Quiz
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>No quizzes found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
