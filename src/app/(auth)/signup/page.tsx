'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {signupUser} from './action'

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');


  // Email and Password Validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~\-]).{8,32}$/;


  const getPasswordStrength = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength('Too short');
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]/.test(password)) {
      setPasswordStrength('Weak password');
    } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]/.test(password)) {
      setPasswordStrength('Strong password');
    } else {
      setPasswordStrength('Moderate password');
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Trim input values
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    // Field validation
    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError('Invalid email format.');
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(trimmedPassword)) {
      setError('Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8-32 characters long.');
      setIsLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    // Store user data in localStorage if all validation passes
    const userData = {
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    };

    try {
      const res = await signupUser(userData);
      console.log(res);
      if (res.error) {  // Handle API errors
        setError(res.error);
        setIsLoading(false);
        return;
      }
    }catch {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

    toast({
      title: 'Success',
      description: 'Account created successfully!',
    });
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center pt-10 pb-10"> {/* Added padding bottom here */}
        <div className="flex w-full max-w-5xl mx-auto">
          {/* Left side - Image */}
          <div className="flex-1 hidden md:block">
            <img src="/assets/images/SiUp.png" alt="SignUp Image" className="w-full h-[600px] object-cover" />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[500px] p-4">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                Create an account</CardTitle>
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500 text-center">{error}</div>
                  )}
                  <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50" 
                  type="submit" 
                  disabled={isLoading}>{isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>

                </form>
                <div className="flex justify-center mt-4">
                  <p className="text-center">or</p>
                </div>

                {/* Social Media Login Section (Side-by-side) */}
                <div className="mt-4 flex space-x-4">
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
                  <Link href="/signin" className="text-purple-500 hover:underline"> Sign in </Link>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
