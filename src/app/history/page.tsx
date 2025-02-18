'use client'
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';
import { getQuizzes, getQuestions } from './action';
import axios from 'axios';

export default function History() {
  const [quizzes, setQuizzes] = useState([]);
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [questions, setQuestions] = useState({});
  const [editedQuestions, setEditedQuestions] = useState({});

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const quizData = await getQuizzes();
      setQuizzes(quizData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const toggleQuizQuestions = async (quiz) => {
    if (expandedQuiz === quiz.id) {
      setExpandedQuiz(null);
    } else {
      setExpandedQuiz(quiz.id);
      if (!questions[quiz.id]) {
        try {
          const questionData = await getQuestions(quiz.id);
          setQuestions(prev => ({ ...prev, [quiz.id]: questionData }));
          setEditedQuestions(questionData.reduce((acc, q) => ({ ...acc, [q.id]: q }), {}));
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
      setExpandedQuiz(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    try {
      await axios.delete(`/api/questions/${questionId}`);
      setQuestions(prev => ({
        ...prev,
        [quizId]: prev[quizId].filter(q => q.id !== questionId)
      }));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditedQuestions(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSaveChanges = async (question) => {
    try {
      await axios.put(`/api/questions/${question.id}`, editedQuestions[question.id]);
      setQuestions(prev => ({
        ...prev,
        [expandedQuiz]: prev[expandedQuiz].map(q => 
          q.id === question.id ? editedQuestions[question.id] : q
        )
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
                  <Card className="relative w-full cursor-pointer" onClick={() => toggleQuizQuestions(quiz)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {new Date(quiz.createdAt).toLocaleString()}
                      </CardTitle>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex flex-row items-center justify-between space-x-4 py-2">
                      <div className="flex flex-col">
                        <div className="text-lg font-bold">{quiz.topic}</div>
                        <div className="text-sm text-muted">{quiz.difficultyLevel}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm">No of Questions</div>
                        <div className="text-lg font-bold">{quiz.numberOfQuestions}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm">Type of Questions</div>
                        <div className="text-lg font-bold">
                          {quiz.typeOfQuestions.join(', ')}
                        </div>
                      </div>
                      <div className="text-gray-600">
                        {expandedQuiz === quiz.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="absolute top-3 right-3">
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteQuiz(quiz.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {expandedQuiz === quiz.id && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
                      <h2 className="text-lg font-bold">Questions</h2>
                      {questions[quiz.id] && questions[quiz.id].length > 0 ? (
                        questions[quiz.id].map((question) => (
                          <div className="border p-2 rounded-lg mt-2 bg-white">
                            <Input
                              value={editedQuestions[question.id]?.question_text || ''}
                              onChange={(e) => handleEditChange(question.id, 'question_text', e.target.value)}
                            />
                            {question.option1 && (
                              <Textarea
                                value={editedQuestions[question.id]?.correct_answer || ''}
                                onChange={(e) => handleEditChange(question.id, 'correct_answer', e.target.value)}
                              />
                            )}
                            <div className="flex justify-between mt-2">
                              <Button variant="secondary" size="sm" onClick={() => handleSaveChanges(question)}>Save</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(quiz.id, question.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No questions found.</p>
                      )}
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
