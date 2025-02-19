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
import { signupUser } from './action';

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // Email and Password Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,32}$/;

  // Email Validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    if (!value) {
      setEmailError('Email is required.');
    } else if (!emailRegex.test(value)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError('');
    }
  };

  // Password Strength Checker
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError('Password is required.');
      setPasswordStrength('');
    } else if (!passwordRegex.test(value)) {
      setPasswordError('Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
      setPasswordStrength('Weak');
    } else if (value.length >= 12) {
      setPasswordError('');
      setPasswordStrength('Strong');
    } else {
      setPasswordError('');
      setPasswordStrength('Moderate');
    }
  };

  // Confirm Password Validation
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (!value) {
      setConfirmPasswordError('Confirm password is required.');
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Final Validation Check before Submission
    if (!name || emailError || passwordError || confirmPasswordError) {
      setIsLoading(false);
      return;
    }

    const userData = { name, email, password };

    try {
      const res = await signupUser(userData);
      if (res.error) {
        setIsLoading(false);
        return;
      }
    } catch {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    toast({ title: 'Success', description: 'Account created successfully!' });
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-screen flex items-center justify-center pt-10 pb-10">
        <div className="flex w-full max-w-5xl mx-auto">
          <div className="flex-1 hidden md:block">
            <img src="/assets/images/SiUp.png" alt="SignUp Image" className="w-full h-[600px] object-cover" />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[500px] p-4">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                  Create an account
                </CardTitle>
                <CardDescription className="text-center">Enter your details to create your account</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      disabled={isLoading}
                    />
                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                    />
                    {passwordStrength && (
                      <p className={`text-sm ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {passwordStrength} Password
                      </p>
                    )}
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  </div>

                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                      disabled={isLoading}
                    />
                    {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
                
                <div className="text-center text-sm mt-4">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-purple-500 hover:underline">
                    Sign in
                  </Link>
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
