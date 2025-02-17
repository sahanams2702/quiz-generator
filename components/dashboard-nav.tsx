'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  Brain,
  LayoutDashboard,
  PlusCircle,
  History,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Quiz', href: '/create-quiz', icon: PlusCircle },
  { name: 'Create Quiz PDF', href: '/create-quiz-pdf', icon: PlusCircle },
  { name: 'History', href: '/history', icon: History },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  const handleLogout = () => {
    // You can clear any authentication tokens or user data here if needed
    router.push('/'); // Redirect to the main page (page.tsx)
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-primary" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed h-screen w-64 flex-col border-r bg-card z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0' // Always show on desktop
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 bg-clip-text">
              QuizEZ
            </span>
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
                  onClick={() => isMobile && setIsOpen(false)}
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
    </>
  );
}