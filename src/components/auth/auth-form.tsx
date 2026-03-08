"use client";

import { useActionState } from "react";
import { signInWithPassword, signUpWithPassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  redirectTo?: string;
  error?: string;
  message?: string;
};

export function AuthForm({
  mode,
  redirectTo,
  error: initialError,
  message,
}: AuthFormProps) {
  const [state, formAction] = useActionState(
    mode === "sign-in" ? signInWithPassword : signUpWithPassword,
    { error: null as string | null }
  );
  const error = state?.error ?? initialError;

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="space-y-2 pb-2">
        <CardTitle className="text-xl tracking-tight">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {mode === "sign-in"
            ? "Enter your email and password to continue."
            : "Enter your details below to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {(error || message) && (
          <Alert variant={error ? "destructive" : "default"} className="rounded-lg">
            <AlertDescription className="text-sm">
              {error || message}
            </AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-5">
          {redirectTo && (
            <input type="hidden" name="redirectTo" value={redirectTo} />
          )}
          {mode === "sign-up" && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full name (optional)
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Jane Doe"
                className="h-11 rounded-lg"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-11 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="h-11 rounded-lg"
            />
          </div>
          <Button type="submit" className="h-11 w-full rounded-lg">
            {mode === "sign-in" ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
