'use client';

import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Users: 150 },
  { name: 'Feb', Users: 180 },
  { name: 'Mar', Users: 220 },
  { name: 'Apr', Users: 250 },
  { name: 'May', Users: 280 },
];

const recentQuizzes = [
  { name: 'JavaScript Fundamentals', noOfQuestions: 45, avgScore: '78%', username: 'John Doe' },
  { name: 'React Hooks Deep Dive', noOfQuestions: 32, avgScore: '82%', username: 'Jane Doe' },
  { name: 'TypeScript Basics', noOfQuestions: 28, avgScore: '75%', username: 'John Doe' },
  { name: 'Next.js Masterclass', noOfQuestions: 38, avgScore: '80%', username: 'Jane Doe' },
];

const CustomXAxis = ({ tick = true, ...props }) => <XAxis tick={tick} {...props} />;
const CustomYAxis = ({ tick = true, ...props }) => <YAxis tick={tick} {...props} />;

export default function Home() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          {/* <ThemeToggle /> */}
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Quizzes</h3>
              <p className="mt-2 text-3xl font-bold">56</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <p className="mt-2 text-3xl font-bold">827</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">User Sign UP (This Week)</h3>
              <p className="mt-2 text-3xl font-bold">15</p>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quiz Analytics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="quizzes" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Users" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

            <Card className="p-6">
              <h3 className="mb-4 text-lg font-medium">Recent Quizzes</h3>
              <div className="space-y-4">
                {recentQuizzes.map((quiz) => (
                  <div
                    key={quiz.name}
                    className="flex items-center justify-between rounded-lg bg-muted p-4"
                  >
                    <div>
                      <p className="font-medium">{quiz.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.username}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{quiz.noOfQuestions}</p>
                      <p className="text-sm text-muted-foreground">No. of Questions</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}