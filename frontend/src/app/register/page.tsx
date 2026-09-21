"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRegister } from "@/hooks/use-auth";
import { getDepartments } from "@/services/departments.service";
import { useAppStore } from "@/store/store";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const register = useRegister();
  const router = useRouter();
  const user = useAppStore((state) => state.currentUser);
  const [validationError, setValidationError] = useState("");
  const departments = useQuery({ queryKey: ["departments"], queryFn: getDepartments });

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const error = validationError || (register.isError
    ? register.error instanceof ApiError && register.error.status === 409
      ? "An account already exists with this email. Please sign in."
      : register.error instanceof ApiError && register.error.status === 400
        ? "Please check your details and select an available department."
        : "Unable to create your account. Please try again shortly."
    : "");

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="glass-card w-full max-w-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create your TechCorp account</CardTitle>
          <p className="text-sm text-muted-foreground">Join your team to manage your internal tools.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(event) => {
            event.preventDefault();
            register.reset();
            const data = new FormData(event.currentTarget);
            const firstName = String(data.get("firstName")).trim();
            const lastName = String(data.get("lastName")).trim();
            const password = String(data.get("password"));
            if (firstName.length < 2 || lastName.length < 2) {
              setValidationError("First and last names must contain at least 2 characters.");
              return;
            }
            if (password !== data.get("confirmation")) {
              setValidationError("Passwords do not match.");
              return;
            }
            setValidationError("");
            register.mutate({ firstName, lastName, email: String(data.get("email")).trim(), password, departmentId: String(data.get("departmentId")) });
          }}>
            <fieldset disabled={register.isPending} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="firstName">First name</Label><Input id="firstName" name="firstName" autoComplete="given-name" minLength={2} maxLength={50} required /></div>
                <div className="space-y-2"><Label htmlFor="lastName">Last name</Label><Input id="lastName" name="lastName" autoComplete="family-name" minLength={2} maxLength={50} required /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="username" maxLength={255} required /></div>
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <select id="departmentId" name="departmentId" required defaultValue="" disabled={!departments.data?.length} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="" disabled>{departments.isPending ? "Loading departments…" : "Select your department"}</option>
                  {departments.data?.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
                </select>
                {departments.isError && <p role="alert" className="text-sm text-destructive">Unable to load departments. <button type="button" className="underline" onClick={() => departments.refetch()}>Retry</button></p>}
                {departments.isSuccess && !departments.data.length && <p role="status" className="text-sm text-muted-foreground">No departments available. Contact your administrator.</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={100} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).+" aria-describedby="password-hint" required />
                <p id="password-hint" className="text-xs text-muted-foreground">8–100 characters, including uppercase, lowercase, a number and a symbol: @$!%*?&</p>
              </div>
              <div className="space-y-2"><Label htmlFor="confirmation">Confirm password</Label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" maxLength={100} required /></div>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={register.isPending || !departments.data?.length}>{register.isPending ? "Creating account…" : "Create account"}</Button>
            </fieldset>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="text-primary underline">Sign in</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}
