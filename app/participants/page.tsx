'use client';

import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const participants = [
  { id: 1, name: 'John Doe', email: 'john@example.com', quizzesgenerated: 8,  },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', quizzesgenerated: 12, },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', quizzesgenerated: 5,  },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', quizzesgenerated: 15, },
  { id: 5, name: 'David Brown', email: 'david@example.com', quizzesgenerated: 7,  },
];

export default function Participants() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <h1 className="text-2xl font-semibold">Users</h1>
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
                      <p className="text-2xl font-bold">{participant.quizzesgenerated}</p>
                      <p className="text-sm text-muted-foreground">Quizzes generated</p>
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