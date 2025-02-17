'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Badge } from '@/components/ui/badge';


const quizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    nameOfUser: 'John Doe',
    type: ['MCQ', 'MSQ'],  // Multiple types (MCQ and MSQ)
    level: 'Intermediate',
    questions: [
      {
        question: 'What is closure in JavaScript?',
        options: [
          'A function that has access to variables in its outer scope',
          'A way to close browser window',
          'A method to end a loop',
          'A type of variable declaration'
        ],
        correctAnswer: 0
      },
      {
        question: 'Which of these is not a JavaScript data type?',
        options: [
          'String',
          'Boolean',
          'Float',
          'Number'
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    title: 'React Hooks Deep Dive',
    nameOfUser: 'John',
    type: ['MSQ', 'FIB'],  // Multiple types (MSQ and FIB)
    level: 'Advanced',
    questions: [
      {
        question: 'Which hooks can be used for performance optimization?',
        options: [
          'useMemo',
          'useCallback',
          'useEffect',
          'useRef'
        ],
        correctAnswers: [0, 1]
      }
    ]
  },
  {
    id: 3,
    title: 'TypeScript Basics',
    nameOfUser: 'sana',
    type: ['FIB'],  // Single type (FIB)
    level: 'Easy',
    questions: [
      {
        question: 'What is the type annotation for arrays in TypeScript?',
        answer: 'type[]'
      }
    ]
  },
  {
    id: 4,
    title: 'Next.js Masterclass',
    nameOfUser: 'paddu',
    type: ['MCQ', 'FIB'],  // Multiple types (MCQ and FIB)
    level: 'Advanced',
    questions: [
      {
        question: 'What is the purpose of getStaticProps?',
        options: [
          'To fetch data at build time',
          'To fetch data on every request',
          'To fetch data on client side',
          'To fetch data periodically'
        ],
        correctAnswer: 0
      }
    ]
  }
];

export default function Quizzes() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Quizzes</h1>
          <div className="flex items-center gap-4">
          </div>
        </header>
        <main className="p-6">
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{quiz.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {quiz.nameOfUser}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{quiz.questions.length}</p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{quiz.type.join(', ')}</p>
                      <p className="text-sm text-muted-foreground">Type of questions</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl">{quiz.title}</DialogTitle>
                            
                          </div>
                        </DialogHeader>
                        <div className="mt-6">
                          <div className="flex gap-4 mb-6">
                            <Badge variant="outline" className="px-3 py-1">
                              Type: {quiz.type.join(', ')}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1">
                              Level: {quiz.level}
                            </Badge>
                          </div>
                          <div className="space-y-6">
                            {quiz.questions.map((q, index) => (
                              <div key={index} className="bg-slate-900 p-4 rounded-lg text-white">
                                <h4 className="font-medium mb-3 text-lg">{`Question ${index + 1}: ${q.question}`}</h4>
                                {'options' in q ? (
                                  <div className="space-y-2 ml-4">
                                    {q.options.map((option, optIndex) => (
                                      <div key={optIndex} className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-sm text-black">
                                          {String.fromCharCode(65 + optIndex)}
                                        </span>
                                        <span className="text-lg">{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="ml-4 text-slate-300">
                                    Fill in the blank answer: <span className="font-semibold">{q.answer}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}