'use client';
import React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/header';
import { loginUser } from '@/services/authService';

export default function SignIn() {
  const {} = useToast();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginUser({ email: trimmedEmail, password: trimmedPassword });
      console.log(res);
      setIsLoading(false);
      if(res.error) {
        setError(res.error);
        return;
      }
      router.push('/dashboard');
    } catch (error) {
      setError('Invalid credentials.');
      setIsLoading(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex w-full max-w-5xl mx-auto">
          {/* Left side - Image */}
          <div className="flex-1 hidden md:block">
            <img src="/assets/images/signin.avif" alt="SignIn Image" className="w-full h-full object-cover" />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px]">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                  Enter your email to sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer section, if needed */}
      <footer />
    </div>
  );
}
