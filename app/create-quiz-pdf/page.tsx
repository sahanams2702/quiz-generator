'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { generatePDFAPI } from '@/services/generatepdfservice';
import { Upload, Download, X } from 'lucide-react';
import DashboardNav from '@/components/dashboard-nav';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface Question {
  id?: number;
  question: string;
  options?: string[];
  answer: string;
  type: 'multiple-choice' | 'multiple-selection' | 'fib';
}

function CreateQuizPDF() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const formik = useFormik({
    initialValues: { file: null as File | null },
    validationSchema: Yup.object({ file: Yup.mixed().required('A PDF file is required') }),
    onSubmit: async (values) => {
      if (!values.file) {
        console.error('No file selected!');
        return;
      }
      setIsLoading(true);
      try {
        const extractedText = await extractTextFromPDF(values.file);
        const response = await generatePDFAPI({ pdfContent: extractedText });

        if (response.success && response.questions) {
          const allQuestions = [
            ...(response.questions.MCQ || []),
            ...(response.questions.MSQ || []),
            ...(response.questions.FIB || []),
          ];
          setGeneratedQuestions(allQuestions);
          setShowPopover(true);
        } else {
          console.error('Error generating quiz:', response.error);
        }
      } catch (error) {
        console.error('Error processing PDF:', error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const pdf = await getDocument({ data: event.target?.result }).promise;
          let extractedText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            extractedText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }
          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-500 flex">
      <div className="fixed">
        <DashboardNav />
      </div>

      <div className="flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8 w-[600px]">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-black">Create New Quiz</h1>
              <p className="mt-2 text-black">Upload a PDF to generate a quiz</p>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Upload className="w-4 h-4 mr-2 text-blue-600" /> Upload PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => formik.setFieldValue('file', e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {formik.errors.file && formik.touched.file && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.file}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700"
              >
                {isLoading ? 'Generating...' : 'Create Quiz'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Questions Popover (Appears Automatically After Quiz Generation) */}
      {showPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Generated Quiz</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => console.log('Downloading...')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    title="Download Quiz"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setShowPopover(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {generatedQuestions.map((q, index) => (
                  <div key={index} className="border-b pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {q.question}
                    </h3>
                    {q.options && (
                      <ul className="list-disc list-inside space-y-2">
                        {q.options.map((option, idx) => (
                          <li key={idx} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {String.fromCharCode(65 + idx)}. {option}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Correct Answer: {q.correctAnswer}
                    </p>
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

export default CreateQuizPDF;
