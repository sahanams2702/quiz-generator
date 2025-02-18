'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Users, Settings, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

import {

  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/overview', icon: BarChart2 },
  { name: 'Quizzes', href: '/quizzes', icon: BookOpen },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'profile', href: '/adminprofile', icon: Settings },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    }
    catch (error) {
      console.error('Error logging out:', error);
    }

    // TODO: Implement logout logic
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center gap-2 px-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">QuizEZ</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}