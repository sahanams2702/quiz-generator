import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookOpen, Award, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    <div
      className="space-y-8"
      style={{
        // Path to your image in the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="container mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 to-orange-500  py-12 px-4 min-h-screen">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Card className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>

          <Card className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>

          <Card className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>

          <Card className="transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.5h</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
