import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { Brain, ArrowLeft, Eye, EyeOff, Mail, Lock, User } from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthPageProps {
  mode: AuthMode;
  onNavigate: (view: AuthMode) => void;
}

export function AuthPage({ mode, onNavigate }: AuthPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT PANEL */}
      <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-primary/20 via-background to-accent/10 p-12 lg:flex">
        <button
          onClick={() => onNavigate("login")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </button>

        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">CEREBRO</span>
          </div>

          <h1 className="text-4xl font-bold">
            {isLogin ? "Welcome back" : "Start your journey"}
          </h1>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isLogin ? "Log in" : "Create account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Enter your credentials" : "Create your new account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(v === true)}
                  />
                  <span className="text-sm">Remember me</span>
                </div>
              )}

              <Button className="w-full" disabled={isLoading}>
                {isLoading
                  ? "Please wait..."
                  : isLogin
                    ? "Log in"
                    : "Create account"}
              </Button>
            </form>

            <div className="my-6 text-center text-sm text-muted-foreground">
              Or continue with
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: { redirectTo: window.location.origin },
                  })
                }
              >
                Google
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  supabase.auth.signInWithOAuth({
                    provider: "github",
                    options: { redirectTo: window.location.origin },
                  })
                }
              >
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm">
              {isLogin ? "No account?" : "Already have an account?"}{" "}
              <button
                onClick={() => onNavigate(isLogin ? "signup" : "login")}
                className="text-primary font-medium"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
