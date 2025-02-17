'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Users, Settings, BookOpen, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import {LogOut} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/overview', icon: BarChart2 },
  { name: 'Quizzes', href: '/quizzes', icon: BookOpen },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Profile', href: '/adminprofile', icon: Settings },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Show sidebar by default on large screens
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
        <div className="flex h-16 items-center gap-2 px-6">
  <Link href="/" passHref>
    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
      QuizEZ
    </h1>
  </Link>
</div>


        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setIsOpen(false)} // Close on mobile click
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

      {/* Optional Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-background/80 z-40" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
