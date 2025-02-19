"use client";
import { useState } from "react";
import swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginUser } from "./action";

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const emailRegex = /^(?!.*@.*@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@#$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    const userData = { email, password };
  
    try {
      const res = await loginUser(userData);
  
      if (res.error) {  // ✅ Handle API errors
        setIsLoading(false);
        swal.fire({
          title: "<strong>Oops! Invalid Credentials</strong>",
          icon: "info",
          html: `
            <div class="text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text">
              Please register with us.
            </div>
          `,
          showCloseButton: false,
          showConfirmButton: false,
          showCancelButton: false,
          timer: 1500,
          timerProgressBar: true,
          customClass: {
            popup: "!bg-black !text-white",
            title: "text-transparent bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 bg-clip-text",
            timerProgressBar: "bg-purple-500",
          },
          background: "#000",
        });
        return;
      }
  
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
  
      // ✅ Redirect based on user role
      if (res.user.isAdmin) {
        router.push("/overview"); // Redirect Admins
      } else {
        router.push("/dashboard"); // Redirect Regular Users
      }
  
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
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
            <img
              src="/assets/images/Si.png"
              alt="SignIn Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Form */}
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-[400px] p-4">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
                  Sign In
                </CardTitle>
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
                    <div className="text-sm text-red-500 text-center">
                      {error}
                    </div>
                  )}
                  <Button
                    className="w-full py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-opacity-50"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center text-sm mt-3">
                  <Link
                    href="/forgot-password"
                    className="text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="text-center text-sm mt-3">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-purple-500 hover:underline"
                  >
                    Create an account
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
