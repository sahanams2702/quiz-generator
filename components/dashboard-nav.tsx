'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Brain,
  LayoutDashboard,
  PlusCircle,
  History,
  UserCircle,
  LogOut,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Quiz', href: '/create-quiz', icon: PlusCircle },
  { name: 'History', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push('/about');

    // TODO: Implement logout logic
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold">QuizeZ</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

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