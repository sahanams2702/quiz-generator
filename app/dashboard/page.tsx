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
  Download,
} from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';

function Dashboard() {
  const [topic, setTopic] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [questions, setQuestions] = useState<Array<{ question: string; options: string[]; answer: string }>>([]);

  // Mock questions generator based on topic
  const generateQuestions = (topic: string) => {
    // This is a mock implementation. In a real app, you'd fetch from an API
    const mockQuestions = [
      {
        question: `What is the main concept of ${topic}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A'
      },
      {
        question: `How does ${topic} work in practice?`,
        options: ['Implementation 1', 'Implementation 2', 'Implementation 3', 'Implementation 4'],
        answer: 'Implementation 2'
      },
      {
        question: `Why is ${topic} important?`,
        options: ['Reason 1', 'Reason 2', 'Reason 3', 'Reason 4'],
        answer: 'Reason 3'
      }
    ];
    return mockQuestions;
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedQuestions = generateQuestions(topic);
    setQuestions(generatedQuestions);
    setShowPopover(true);
  };

  const handleDownload = () => {
    const quizContent = `
Quiz Topic: ${topic}

${questions.map((q, index) => `
Question ${index + 1}: ${q.question}
Options:
${q.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}
Correct Answer: ${q.answer}
`).join('\n')}
    `;

    const blob = new Blob([quizContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic.toLowerCase().replace(/\s+/g, '-')}-quiz.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const quizHistory = [
    { topic: 'JavaScript Basics', participants: 45, numbers: 13 },
    { topic: 'React Hooks', participants: 32, numbers: 20 },
    { topic: 'TypeScript Advanced', participants: 28, numbers: 9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className=" fixed">
        <DashboardNav />
      </div>
      <div className="p-6 ml-[20%] w-full bg-gradient-to-br px-8 py-12 from-purple-500 via-pink-500 to-orange-500 ">
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Total no.of Questions Generated</h3>
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
          </div>

          {/* User History */}
{/* <div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Quizzes</h2>
    <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
  </div>
  <div className="space-y-4">
    {quizHistory.length === 0 ? (
      <div className="text-center text-gray-600 dark:text-gray-400">
        <span role="img" aria-label="sad" className="text-3xl">😞</span>
        <p>No Recent Quizzes</p>
      </div>
    ) : (
      quizHistory.map((quiz, index) => (
        <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
          <span className="font-bold text-gray-800 dark:text-gray-200 mb-0">{quiz.topic}</span>
          <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-600">
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <LayoutList className="w-4 h-4 mr-1" />
              <span>Number of questions: {quiz.numbers}</span>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</div>
</div>  */}
{/* User History */}
<div className="relative bg-white dark:bg-black rounded-xl p-6 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Quizzes</h2>
    <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
  </div>
  <div className="text-center text-gray-600 dark:text-gray-400">
    <span role="img" aria-label="sad" className="text-3xl">😞</span>
    <p>No Recent Quizzes</p>
  </div>
</div>
</div>


        {/* Questions Popup */}
        {showPopover && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quiz: {topic}
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Download Quiz"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setShowPopover(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((q, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Question {index + 1}: {q.question}
                      </h3>
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                          >
                            <span className="text-gray-700 dark:text-gray-300">
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-green-600 dark:text-green-400 font-medium">
                        Correct Answer: {q.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;