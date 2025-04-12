"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/lib/auth";
import { useRouter } from "next/navigation";
import { BiLogoGmail } from "react-icons/bi";
import { toast } from "sonner";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { userLoggedIn } = useAuth();
  const router = useRouter();

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userLoggedIn) {
      router.push("/");
    }
  }, [userLoggedIn, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningUp) return;

    setIsSigningUp(true);
    try {
      await doCreateUserWithEmailAndPassword(email, password);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const onGoogleSignUp = async () => {
    if (isSigningUp) return;

    setIsSigningUp(true);
    try {
      await doSignInWithGoogle();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  const EyeIcon = !showPassword ? FaRegEye : FaEyeSlash;

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create a new account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <EyeIcon
              className="absolute right-2 top-2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSigningUp}>
          {isSigningUp ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          onClick={onGoogleSignUp}
          disabled={isSigningUp}
        >
          <BiLogoGmail className="text-lg" />
          Sign up with Google
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Log in
        </a>
      </div>
    </form>
  );
}
