'use client';
import { useState } from 'react';
import swal from 'sweetalert2';
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
    // Check if the user is admin
    if (email === 'admin222@quizez.com' && password === 'Admin@123') {
      setIsLoading(false);
      toast({
        title: 'Admin Login Successful',
        description: 'Welcome to the Admin Dashboard',
      });
      router.push('/quizzes'); // Redirect to Admin Dashboard
      return;
    }
    // Check if user exists in localStorage
    const storedUserData = JSON.parse(localStorage.getItem('userData') || 'null');
    if (!storedUserData || storedUserData.email !== email) {
      setIsLoading(false);
      swal.fire({
        title: "<strong>Oops! You haven’t registered yet.</strong>",
        icon: "info",
        html: `
<div class="text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text">
            Please register with us.
</div>
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
<i class="fa fa-thumbs-up" style="color: white;"></i> OK
        `,
        confirmButtonAriaLabel: "Thumbs up, great!",
        cancelButtonText: `
<i class="fa fa-thumbs-down" style="color: white;"></i>
        `,
        cancelButtonAriaLabel: "Thumbs down",
        customClass: {
          popup: '!bg-black !text-white',
          title: 'text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text',
          closeButton: '!text-white',
          actions: '!text-white'
        },
        buttonsStyling: false,
        background: '#000',
        confirmButtonColor: 'transparent',
        cancelButtonColor: 'transparent'
      });
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
    router.push('/dashboard'); // Redirect to User Dashboard
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
            <img src="/assets/images/Si.png" alt="SignIn Image" className="w-full h-full object-cover" />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px] p-4">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">Sign In</CardTitle>
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
                  <Button className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center text-sm mt-3">
                  <Link href="/forgot-password" className="text-blue-500 hover:underline">
                    Forgot Password?
                  </Link>

                </div>

                <div className="text-center text-sm mt-3">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-purple-500 hover:underline">
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