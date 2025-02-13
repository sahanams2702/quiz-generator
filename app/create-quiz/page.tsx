'use client'

import React, { useState } from 'react';
import { BookOpen, Brain, List, AlertCircle } from 'lucide-react'; 
import DashboardNav from '@/components/dashboard-nav'; 

type QuestionType = 'multiple-choice' | 'multiple-selection' | 'fib';  
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface QuizForm {
  subject: string;
  numberOfQuestions: number;
  difficultyLevel: DifficultyLevel;
  questionTypes: QuestionType[];
}

function App() {
  const [formData, setFormData] = useState<QuizForm>({
    subject: '',
    numberOfQuestions: 10,
    difficultyLevel: 'intermediate',
    questionTypes: ['multiple-choice'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const questionTypeOptions: { value: QuestionType; label: string }[] = [
    { value: 'multiple-choice', label: 'Multiple Choice Question' },
    { value: 'multiple-selection', label: 'Multiple Selection Question' },
    { value: 'fib', label: 'Fill in the Blank (FIB)' },
  ];

  const handleQuestionTypeChange = (type: QuestionType) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed">
        <DashboardNav />
      </div>

      {/* Content Section (quiz form) */}
      <div className="bg-gradient-to-br  bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        {/* Adjusted margin-left to account for the fixed navbar */}
        <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            {/* Cancel Button */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold justify-center mb-4 text-black">Create New Quiz</h1>
                <p className="mt-2 text-black">Fill in the details to generate your quiz</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subject Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Mathematics, History, Science"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <List className="w-4 h-4 mr-2 text-blue-600" />
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Brain className="w-4 h-4 mr-2 text-blue-600" />
                  Difficulty Level
                </label>
                <select
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficultyLevel: e.target.value as DifficultyLevel }))} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Question Types */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
                  Question Types
                </label>
                <div className="space-y-2">
                  {questionTypeOptions.map((type) => (
                    <label key={type.value} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.questionTypes.includes(type.value)}
                        onChange={() => handleQuestionTypeChange(type.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition hover:scale-[1.02]"
              >
                Create Quiz
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
