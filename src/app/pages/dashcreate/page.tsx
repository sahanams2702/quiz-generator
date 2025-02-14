// pages/dashboard/create.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function CreateQuiz() {
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [numQuestions, setNumQuestions] = useState('');
  const [questionType, setQuestionType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Quiz Created:', { subject, level, numQuestions, questionType });
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">Create a New Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter the subject of the quiz"
            required
          />
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <Select
            value={level}
            onValueChange={(value: string) => setLevel(value)}
            required
          >
            <option value="">Select Level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="numQuestions">Number of Questions</Label>
          <Input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            placeholder="Enter the number of questions"
            required
          />
        </div>
        <div>
          <Label htmlFor="questionType">Question Type</Label>
          <Select
            value={questionType}
            onValueChange={(value: string) => setQuestionType(value)}
            required
          >
            <option value="">Select Question Type</option>
            <option value="mcq">Multiple Choice</option>
            <option value="msq">Multiple Select</option>
            <option value="nqt">Numerical Question Type</option>
          </Select>
        </div>
        <div className="mt-6">
          <Button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Create Quiz
          </Button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link href="/dashboard">
          <a className="text-blue-600 hover:text-blue-800 underline">Back to Dashboard</a>
        </Link>
      </div>
    </div>
  );
}
