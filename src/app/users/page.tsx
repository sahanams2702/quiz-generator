'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const initialParticipants = [
  { id: 1, name: 'John Doe', email: 'john@example.com', quizzesGenerated: 8  },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', quizzesGenerated: 12 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', quizzesGenerated: 5  },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', quizzesGenerated: 15  },
  { id: 5, name: 'David Brown', email: 'david@example.com', quizzesGenerated: 7 },
];

export default function Users() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id: number) => {
    setParticipants(participants.filter(participant => participant.id !== id));
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      <div className="w-64 border-r">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-semibold">Users</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="grid gap-4">
            {filteredParticipants.map((participant) => (
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
                      <p className="text-2xl font-bold">{participant.quizzesGenerated}</p>
                      <p className="text-sm text-muted-foreground">Quizzes Generated</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(participant.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
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
