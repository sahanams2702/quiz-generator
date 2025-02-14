'use client';
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  History,
  LayoutList,
  Send,
  X,
} from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';

const Dashboard = () => {
  const [topic, setTopic] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [quizData, setQuizData] = useState<{ id: string; url: string } | null>(null);

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

      setTimeout(() => {
        setShowPopover(false);
        setQuizData(null);
      }, 5000);
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed">
        <DashboardNav />
      </div>

      <div className="p-6 w-full bg-gradient-to-br ml-[20%] px-8 py-12 from-purple-500 via-pink-500 to-orange-500">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total Quizzes</h3>
              <LayoutDashboard className="w-6 h-6 dark:text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
          </div>

          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Topics Covered</h3>
              <BookOpen className="w-6 h-6 dark:text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">5</p>
          </div>

          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
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
          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Quiz</h2>
              <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <form onSubmit={handleCreateQuiz} className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
          <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Quizzes</h2>
              <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-4">
              {quizHistory.map((quiz, index) => (
                <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                  <span className="font-bold text-gray-800 dark:text-gray-200 mb-0">{quiz.topic}</span>
                  <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-600">
                    <div className="flex items-center">
                   
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <LayoutList className="w-4 h-4 mr-1" />
                      <span>Number of questions: {quiz.numbers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
