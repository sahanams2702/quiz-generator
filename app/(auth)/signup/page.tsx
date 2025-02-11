'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Email and Password Validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~\-]).{8,32}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  

  // Trim input values
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  // Field validation
  if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
    setError('All fields are required.');
    return;
  }

  if (!emailRegex.test(trimmedEmail)) {
    setError('Invalid email format.');
    return;
  }

  if (!passwordRegex.test(trimmedPassword)) {
    setError('Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8-32 characters long.');
    return;
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex w-full max-w-5xl mx-auto">
          {/* Left side - Image */}
          <div className="flex-1 hidden md:block">
            <img src="/assets/images/signup3.webp" alt="SignUp Image" className="w-full h-[600px] object-cover" />
          </div>


          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px]">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
                <div className="flex justify-center">
                  <p className="text-center">or</p>
                </div>


                {/* Social Media Login Section */}
                <div className="mt-4 space-y-4">
                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Sign up with Google</span>
                  </Button>

                  <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
                    <Github className="h-5 w-5" />
                    <span>Sign up with GitHub</span>
                  </Button>
                </div>

                <div className="text-center text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <footer />
    </div>
  );
}