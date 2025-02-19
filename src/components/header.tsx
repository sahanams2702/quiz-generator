'use client'; // This makes sure the component is client-side only
import Link from 'next/link'; // Import Link for client-side routing
import { Brain } from 'lucide-react'; // Import the Brain icon
import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { ThemeToggle } from '@/components/theme-toggle'; // Assuming you have a ThemeToggle component

const Header = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-5">
      <div className="container mx-auto flex h-16 items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            QuizEZ
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-lg">
          {/* Use Link for client-side routing */}
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About Us
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
