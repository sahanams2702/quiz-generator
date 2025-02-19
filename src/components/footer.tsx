import Link from 'next/link';
import { Brain, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">QuizEZ</span>

            </div>
            <p className="text-xs text-muted-foreground">
  Unlock instant, AI-powered quizzes and challenge your brain like never before!
</p>

            <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">Quick Links</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3 bg-clip-text text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">Contact</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>quizez12@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+919876543210</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuizGenius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
