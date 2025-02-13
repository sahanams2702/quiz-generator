'use client';

import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const participants = [
  { id: 1, name: 'John Doe', email: 'john@example.com', quizzesTaken: 8, avgScore: '82%', lastActive: '2024-03-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', quizzesTaken: 12, avgScore: '78%', lastActive: '2024-03-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', quizzesTaken: 5, avgScore: '85%', lastActive: '2024-03-13' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', quizzesTaken: 15, avgScore: '90%', lastActive: '2024-03-12' },
  { id: 5, name: 'David Brown', email: 'david@example.com', quizzesTaken: 7, avgScore: '75%', lastActive: '2024-03-11' },
];

export default function Participants() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Participants</h1>
          <ThemeToggle />
        </header>
        <main className="p-6">
          <div className="grid gap-4">
            {participants.map((participant) => (
              <Card key={participant.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {participant.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{participant.name}</h3>
                      <p className="text-sm text-muted-foreground">{participant.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{participant.quizzesTaken}</p>
                      <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{participant.avgScore}</p>
                      <p className="text-sm text-muted-foreground">Avg. Score</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(participant.lastActive).toLocaleDateString()}
                      </p>
                    </div>
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