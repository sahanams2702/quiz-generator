'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';
import { getQuizzes, getQuestions } from './action';
import axios from 'axios';
import { Sidebar } from '@/components/dashboard/sidebar';

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

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<{ [quizId: number]: Question[] }>({});
  const [editedQuestions, setEditedQuestions] = useState<{ [key: string]: Question }>({});
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

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

  const fetchQuestions = async (quizId: number) => {
    try {
      const questionData: Question[] = await getQuestions(quizId);
      setQuestions((prev) => ({
        ...prev,
        [quizId]: questionData,
      }));
      setEditedQuestions({}); // Reset edited questions state
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      setQuizzes((quizzes) => quizzes.filter((q) => q.id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeleteQuestion = async (quizId: number, question: Question) => {
    try {
      await axios.delete(`/api/questions/${question.id}?type=${question.type}`);
      setQuestions((prev) => {
        const updatedQuestions = prev[quizId].filter(q => q.id !== question.id);
        return { ...prev, [quizId]: updatedQuestions };
      });
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditChange = (question: Question, field: keyof Question, value: string | string[]) => {
    const updatedEditedQuestions = { ...editedQuestions };
    updatedEditedQuestions[`${question.type}-${question.id}`] = {
      ...question,
      [field]: value,
    };
    setEditedQuestions(updatedEditedQuestions);
  };

  const handleSaveChanges = async (question: Question) => {
    try {
      await axios.put(`/api/questions/${question.id}?type=${question.type}`, editedQuestions[`${question.type}-${question.id}`]);
      setQuestions((prev) => ({
        ...prev,
        [selectedQuiz!.id]: prev[selectedQuiz!.id].map((q) =>
          q.id === question.id ? { ...q, ...editedQuestions[`${question.type}-${question.id}`] } : q
        ),
      }));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="fixed w-64 h-full">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[20%] px-4 py-12 flex justify-center items-center">
        <div className="container mx-auto p-8 rounded-2xl shadow-xl w-full max-w-3xl bg-white">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">History</h1>

          <div className="flex flex-col gap-4 mt-8">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id} className="relative w-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-bold">{quiz.topic}</CardTitle>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-4 items-center">
                    <Badge variant="outline" className="px-3 py-1">Level: {quiz.difficultyLevel}</Badge>
                    <Badge variant="outline" className="px-3 py-1">Questions: {quiz.numberOfQuestions}</Badge>
                    <Dialog>
                      <Badge variant="outline" className="px-3 py-1">Type: {quiz.typeOfQuestions.join(', ')}</Badge>
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
        <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedQuiz.topic}</DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              <div className="space-y-6">
                {questions[selectedQuiz.id] && questions[selectedQuiz.id].length > 0 ? (
                  questions[selectedQuiz.id].map((question) => (
                    <div key={question.id} className="border p-4 rounded-lg mt-2 bg-white shadow">
                      <Input
                        value={editedQuestions[`${question.type}-${question.id}`]?.questionText || question.questionText}
                        onChange={(e) => handleEditChange(question, 'questionText', e.target.value)}
                      />
                      <Textarea
                        value={editedQuestions[`${question.type}-${question.id}`]?.correctAnswer || question.correctAnswer || question.correctAnswers}
                        onChange={(e) => handleEditChange(question, 'correctAnswer', e.target.value)}
                      />
                      {/* <div className="flex justify-between mt-2">
                        <Button variant="secondary" size="sm" onClick={() => handleSaveChanges(question)}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(selectedQuiz.id, question)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div> */}
                    </div>
                  ))
                ) : (
                  <p>No questions found.</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
