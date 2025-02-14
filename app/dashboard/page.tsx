'use client';
import React, { useState } from 'react';
import DashboardNav from '@/components/dashboard-nav';
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  History,
  LayoutList,
  Users,
  Send,
  X,
  Download,
} from 'lucide-react';

const Dashboard = () => {
  const [topic, setTopic] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [quizData, setQuizData] = useState<{ id: string; url: string } | null>(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [generatedQuestions, setGeneratedQuestions] = useState([]); // Store generated questions

  const quizHistory = [
    { topic: 'JavaScript Basics', participants: 45, numbers: 13 },
    { topic: 'React Hooks', participants: 32, numbers: 20 },
    { topic: 'TypeScript Advanced', participants: 28, numbers: 9 },
  ];

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: `/quiz/${Math.random().toString(36).substr(2, 9)}`,
          });
        }, 1000);
      });

      setQuizData(response as { id: string; url: string });
      setShowPopover(true);
      setTopic('');

      // Simulating generated questions for modal
      setGeneratedQuestions([
        { id: 1, question: 'What is JavaScript?', options: ['A programming language', 'A coffee', 'A library', 'A framework'] },
        { id: 2, question: 'What does JSX stand for?', options: ['JavaScript XML', 'JavaScript Extension', 'JSON Extension', 'JavaScript Expression'] },
      ]);

      setShowModal(true); // Show modal after quiz creation

      setTimeout(() => {
        setShowPopover(false);
        setQuizData(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  const handleDownload = () => {
    // Handle quiz download logic here
    console.log('Download quiz');
  };

  return (
    <div className="p-6 w-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total Quizzes</h3>
            <LayoutDashboard className="w-6 h-6 dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Topics Covered</h3>
            <BookOpen className="w-6 h-6 dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Time Spent</h3>
            <Clock className="w-6 h-6 dark:text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">4.5h</p>
        </div>
      </div>

      {/* Quick Quiz and History Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Quiz Form */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Quiz</h2>
            <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <form onSubmit={handleCreateQuiz} className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter quiz topic"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Quiz
            </button>
          </form>

          {/* Success Popover */}
          {showPopover && quizData && (
            <div className="absolute top-0 left-0 right-0 -mt-4 mx-auto w-[90%] bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-green-500 transform transition-all duration-300 ease-in-out">
              <button
                onClick={() => setShowPopover(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                  Quiz Created Successfully!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your quiz has been generated and is ready to share.
                </p>
                <button
                  onClick={() => {
                    // Handle quiz URL navigation
                    console.log('Navigate to:', quizData.url);
                  }}
                  className="mt-3 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  View Quiz → 
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz History</h2>
            <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="space-y-4">
            {quizHistory.map((quiz, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{quiz.topic}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{quiz.participants} participants</span>
                  </div>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <LayoutList className="w-4 h-4 mr-1" />
                    <span>Number of quiz: {quiz.numbers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{topic}</h2>
                  <p className="text-gray-700">Level: Intermediate</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {generatedQuestions.map((question) => (
                  <div key={question.id} className="border-b pb-4">
                    <p className="font-medium mb-2 text-gray-900">
                      {question.id}. {question.question}
                    </p>
                    {question.options && (
                      <ul className="list-none pl-6 space-y-1">
                        {question.options.map((option, index) => (
                          <li key={index} className="text-gray-800">
                            {option}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
