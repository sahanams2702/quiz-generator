'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, Github, Mail, Eye, EyeOff } from 'lucide-react';  // Add Eye and EyeOff from lucide-react
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
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
  const [passwordStrength, setPasswordStrength] = useState('');
  const [suggestedPassword, setSuggestedPassword] = useState('');

  // Visibility toggles for password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\-]).{8,16}$/;

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]:;<>,.?/~-';
    let strongPassword = '';
    for (let i = 0; i < 16; i++) {
      strongPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return strongPassword;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    getPasswordStrength(newPassword);

    if (!passwordRegex.test(newPassword)) {
      setSuggestedPassword(generateStrongPassword());
    } else {
      setSuggestedPassword('');
    }
  };

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

  const handleUseSuggestedPassword = () => {
    setPassword(suggestedPassword);
    setSuggestedPassword('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (!passwordRegex.test(trimmedPassword)) {
      setError('Password must be 8-16 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      setIsLoading(false);
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some((user: any) => user.email === trimmedEmail);

    if (userExists) {
      setError('User already exists.');
      setIsLoading(false);
      return;
    }

    const newUser = { name: trimmedName, email: trimmedEmail, password: trimmedPassword };
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    setIsLoading(false);

    toast({
      title: 'Success',
      description: 'Account created successfully!',
    });

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
                  <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} />
                  <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />

                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">{passwordStrength}</div>
                  {suggestedPassword && (
                    <div className="text-sm text-gray-500 mt-2">
                      Suggested Strong Password: <span className="font-bold">{suggestedPassword}</span>
                      <Button
                        type="button"
                        onClick={handleUseSuggestedPassword}
                        className="ml-2 bg-blue-500  px-2 py-1 rounded"
                      >
                        Use this password
                      </Button>
                    </div>
                  )}

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className=" h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </Button>
                  </div>

                  {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                  <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
                <div className="flex justify-center mt-4">
                  <p className="text-center">or</p>
                </div>
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
                  Already have an account? <Link href="/signin" className="text-purple-500 hover:underline">Sign in</Link>
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
