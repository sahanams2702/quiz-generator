'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard-nav'; // Import your Dashboard Navbar

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed w-1/4 h-full">
        <DashboardNav />
      </div>

      {/* Content Section */}
      <div className="flex-1 ml-[25%] px-4 py-12 flex justify-center items-cebg-gradient-to-br from-blue-200 to-blue-500 nter"> {/* Added flex, justify-center, items-center */}
        <div className="container mx-auto p-8 rounded-2xl shadow-xl w-full max-w-3xl"> {/* Set max width to center cards */}
          <h1 className="text-3xl font-bold text-white mb-6 text-center">History</h1>
          
          {/* Flex layout for stacking cards vertically and centering */}
          <div className="flex flex-col gap-4 mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Past Quizzes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">80%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.5h</div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
