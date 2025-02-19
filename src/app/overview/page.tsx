'use client';

import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import {getRecentQuizzes, getUsers, getUsersSignedUpThisWeek} from './action'
import { getUsersPerMonth } from "./action";


const data = [
  { name: 'Jan', Users: 150 },
  { name: 'Feb', Users: 180 },
  { name: 'Mar', Users: 220 },
  { name: 'Apr', Users: 250 },
  { name: 'May', Users: 280 },
];

const CustomXAxis = ({ tick = true, ...props }) => <XAxis tick={tick} {...props} />;
const CustomYAxis = ({ tick = true, ...props }) => <YAxis tick={tick} {...props} />;

export default function Home() {


  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [numberOfQuizzes, setNumberOfQuizzes] = useState(0);
  const [usersThisWeek, setUsersThisWeek] = useState(0);
  const [usersPerMonth, setUsersPerMonth] = useState([]);


  useEffect(() => {
    const fetchRecentQuizzes = async () => {
      const quizzes = await getRecentQuizzes();
      setNumberOfQuizzes(quizzes.length);
      // Sort by most recent and take only the top 5
      const sortedQuizzes = quizzes
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setRecentQuizzes(sortedQuizzes);
    };

    const fetchUsers = async () => {
      const users = await getUsers();
      setNumberOfUsers(users.length);
    }
    const fetchUserThisWeek = async () => {
      const count = await getUsersSignedUpThisWeek();
      setUsersThisWeek(count);
    };
    const fetchData = async () => {
      const data = await getUsersPerMonth();
      setUsersPerMonth(data);
    };
    fetchData();
    fetchUserThisWeek();
    fetchUsers();
    fetchRecentQuizzes();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
          {/* <ThemeToggle /> */}
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Quizzes</h3>
              <p className="mt-2 text-3xl font-bold">{numberOfQuizzes}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <p className="mt-2 text-3xl font-bold">{numberOfUsers}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground">User Sign UP (This Week)</h3>
              <p className="mt-2 text-3xl font-bold">{usersThisWeek}</p>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">User Growth Analytics</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={usersPerMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
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
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between rounded-lg bg-muted p-4"
                  >
                    <div>
                      <p className="font-medium">{quiz.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        Created on {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{quiz.numberOfQuestions}</p>
                      <p className="text-sm text-muted-foreground">Questions</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent quizzes found.</p>
              )}
            </div>
          </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
