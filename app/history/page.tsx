'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard-nav';

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-purple-400 via-pink-500 to-orange-500 flex">
      {/* Fixed Dashboard Navbar */}
      <div className="fixed">
        <DashboardNav />
      </div>

      {/* Content Section */}
      <div className="flex-1 ml-[10%] px-8 py-12 flex justify-center items-center">
      <div className="bg-white  rounded-2xl shadow-xl p-8 space-y-8 w-full ml-[10%] sm:w-[300px] md:w-[500px] lg:w-[600px]">
          
          <h1 className="text-3xl font-bold text-black mb-6 text-center">History</h1>

          {/* Flex layout for stacking cards vertically and centering */}
          <div className="flex flex-col gap-4 mt-8">
            <Card className="w-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">JavaScript Fundamentals</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between space-x-4 py-2">
                <div className="flex flex-col">
                <div className="text-sm text-gray-600">User</div>
                <div className="text-lg font-bold">John Doe</div>
                  
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-600">No of Questions</div>
                  <div className="text-lg font-bold">20</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-600">Type of Questions</div>
                  <div className="text-lg font-bold">Multiple Choice</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}