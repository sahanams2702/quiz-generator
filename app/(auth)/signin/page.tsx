'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const emailRegex = /^(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email format
    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please follow the correct format (example@domain.com).');
      setIsLoading(false);
      return;
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      setError('Password must be 8-32 characters long and include 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character.');
      setIsLoading(false);
      return;
    }

    // Check if user exists in localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData') || 'null');

    if (!storedUserData || storedUserData.email !== email) {
      setIsLoading(false);
      alert('Oops! You haven’t registered yet.');
      return;
    }

    // Check password
    if (storedUserData.password !== password) {
      setError('Incorrect password.');
      setIsLoading(false);
      return;
    }

    // Successful login
    setIsLoading(false);
    toast({
      title: 'Success',
      description: 'Signed in successfully',
    });
    router.push('/dashboard');
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
            <img src="/assets/images/signIn1.png" alt="SignIn Image" className="w-full h-full object-cover" />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px] p-4">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center text-sm">
                  Enter your details to sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 text-center">{error}</div>
                  )}
                  <Button className="w-full py-2" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center text-sm mt-3">
                  <Link href="/forgot-password" className="text-primary hover:underline">
                    Forgot Password?
                  </Link>
                </div>

                <div className="text-center text-sm mt-3">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-primary hover:underline">
                    Create an account
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer section, if needed */}
      <Footer />
    </div>
  );
}
