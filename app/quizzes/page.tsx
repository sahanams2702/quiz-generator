'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Plus } from 'lucide-react';

const quizzes = [
  { id: 1, title: 'JavaScript Fundamentals', participants: 45, avgScore: '78%', createdAt: '2024-03-15' },
  { id: 2, title: 'React Hooks Deep Dive', participants: 32, avgScore: '82%', createdAt: '2024-03-14' },
  { id: 3, title: 'TypeScript Basics', participants: 28, avgScore: '75%', createdAt: '2024-03-13' },
  { id: 4, title: 'Next.js Masterclass', participants: 38, avgScore: '80%', createdAt: '2024-03-12' },
  { id: 5, title: 'CSS Grid & Flexbox', participants: 55, avgScore: '85%', createdAt: '2024-03-11' },
  { id: 6, title: 'Node.js Essentials', participants: 42, avgScore: '77%', createdAt: '2024-03-10' },
  { id: 7, title: 'GraphQL Fundamentals', participants: 25, avgScore: '73%', createdAt: '2024-03-09' },
  { id: 8, title: 'Vue.js Basics', participants: 30, avgScore: '79%', createdAt: '2024-03-08' },
];

export default function Quizzes() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Quizzes</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
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
                      Created on {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{quiz.participants}</p>
                      <p className="text-sm text-muted-foreground">Participants</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{quiz.avgScore}</p>
                      <p className="text-sm text-muted-foreground">Avg. Score</p>
                    </div>
                    <Button variant="outline">View Details</Button>
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