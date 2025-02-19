'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {deleteUser, getUsersWithQuizCount} from './action';
import swal from 'sweetalert2';

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsersWithQuizCount();
      console.log(users[2]);
      setUsers(users);
    };

    fetchUsers();
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteUser(id);
      if(res.success) {
        setUsers((prevUsers) => prevUsers.filter(user => user.id !== id)); // Remove user from state

        swal.fire({
          title: "<strong>User Deleted</strong>",
          icon: "",
          showCloseButton: false,
          showConfirmButton: false,
          showCancelButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: {
            popup: '!bg-black !text-white',
            title: 'text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text',
            timerProgressBar: 'bg-purple-500',
          },
          background: '#000',
        });
  
      }
      else {
        alert("User deletion failed");
      }
    }
    catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{user.quizCount}</p>
                      <p className="text-sm text-muted-foreground">Quizzes Generated</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(user.id)}
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
