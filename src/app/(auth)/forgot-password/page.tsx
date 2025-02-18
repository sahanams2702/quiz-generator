'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import functions from actions.js
import { sendOtp, verifyOtp, updatePassword } from './action';

export default function ForgotPassword() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const emailRegex = /^(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!emailRegex.test(email)) {
      setError('Invalid email format. Please follow the correct format (example@domain.com).');
      setIsLoading(false);
      return;
    }

    try {
      await sendOtp(email); // Call the sendOtp function from actions.js
      setIsLoading(false);
      setStep(2); // Move to OTP verification step
      toast({
        title: 'OTP Sent',
        description: 'An OTP has been sent to your email for verification.',
      });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await verifyOtp(email, otp); // Call the verifyOtp function from actions.js
      setIsLoading(false);
      setStep(3); // Move to password change step
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!passwordRegex.test(newPassword)) {
      setError('Password must be 8-32 characters long and include 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(email, newPassword); // Call the updatePassword function from actions.js
      setIsLoading(false);
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      router.push('/signin'); // Redirect to sign-in page
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex w-full max-w-5xl mx-auto">
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px] p-4">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                  Forgot Password
                </CardTitle>
                <CardDescription className="text-center text-sm">
                  {step === 1
                    ? 'Enter your email to receive an OTP.'
                    : step === 2
                    ? 'Enter the OTP sent to your email.'
                    : 'Enter your new password and confirm it.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
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
                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    <Button
                      className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleOtpSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    <Button
                      className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                    </Button>
                  </form>
                )}

                {step === 3 && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-1">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}
                    <Button
                      className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
