"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
import { useAppStore } from "@/store/store";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const login = useLogin();
  const router = useRouter();
  const user = useAppStore((state) => state.currentUser);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="glass-card w-full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to TechCorp</CardTitle>
          <p className="text-sm text-muted-foreground">Use your account to manage your internal tools.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            login.mutate({
              email: String(data.get("email")).trim(),
              password: String(data.get("password")),
            });
          }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required disabled={login.isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" autoComplete="current-password" required disabled={login.isPending} />
            </div>
            {login.isError && (
              <p role="alert" className="text-sm text-destructive">
                {login.error instanceof ApiError && login.error.status === 401
                  ? "Invalid email or password."
                  : "Unable to sign in. Please try again shortly."}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account yet? <Link href="/register" className="text-primary underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
