'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Award, Clock } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard-nav'; // Import your Dashboard Navbar

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex">
      <div className="fixed w-1/4 h-full">
        <DashboardNav />
      </div>

      <div className="flex-1 ml-[20%] px-4 py-12 flex justify-center items-center bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500"> {/* Added flex, justify-center, items-center */}
        <div className="container mx-auto p-8 rounded-2xl shadow-xl w-full max-w-3xl bg-white">
          <h1 className="text-3xl font-bold text-black mb-6 text-center">History</h1>

          {/* Flex layout for stacking cards vertically and centering */}
          <div className="flex flex-col gap-4 mt-8">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">JavaScript Fundamentals</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between space-x-4 py-2">
                <div className="flex flex-col">
                  <div className="text-lg font-bold">John Doe</div>
                  <div className="text-sm text-muted">User</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm">No of Questions</div>
                  <div className="text-lg font-bold">20</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm">Type of Questions</div>
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
