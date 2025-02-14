'use client';
import React, { useState } from 'react';
import { BookOpen, Upload, Download, X } from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';

type QuestionType = 'multiple-choice' | 'multiple-selection' | 'fib';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface QuizForm {
  url: string;
  file: File | null;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  answer: string;
  type: QuestionType;
}

function createquizpdf() {
  const [formData, setFormData] = useState<QuizForm>({
    url: '',
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock generated questions
      const questions: Question[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        question: `Sample question ${i + 1} based on URL or file input`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
        type: 'multiple-choice',
      }));

      setGeneratedQuestions(questions);
      setIsLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const handleDownload = () => {
    const content = generatedQuestions
      .map((q, index) => {
        let questionText = `${index + 1}. ${q.question}\n`;
        if (q.options) {
          questionText += q.options.map(opt => `   - ${opt}\n`).join('');
        }
        questionText += `Answer: ${q.answer}\n\n`;
        return questionText;
      })
      .join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-quiz.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed">
        <DashboardNav />
      </div>

      {/* Content Section (quiz form) */}
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <h1 className="text-3xl font-bold justify-center mb-4 text-black">Create New Quiz</h1>
                <p className="mt-2 text-black">Fill in the details to generate your quiz</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
             
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Upload className="w-4 h-4 mr-2 text-blue-600" />
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files ? e.target.files[0] : null }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Generate Quiz Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Create Quiz'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal for Generated Quiz */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Generated Quiz</h2>
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
}

export default createquizpdf;
