"use client";

import { ProfileForm } from "@/components/auth/profile-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery, useLogout } from "@/hooks/use-auth";
import { useAppStore } from "@/store/store";
import HeaderPage from "@/components/header-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const profile = useCurrentUserQuery();
  const [editing, setEditing] = useState(false);
  const logout = useLogout();
  const router = useRouter();
  const locale = useAppStore((state) => state.locale);
  const user = profile.data;

  useEffect(() => {
    if (profile.isSuccess && !user) router.replace("/login");
  }, [profile.isSuccess, user, router]);

  if (profile.isError) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <p role="alert" className="mb-4">Unable to load your profile. Please try again.</p>
        <Button onClick={() => profile.refetch()} disabled={profile.isFetching}>Retry</Button>
      </div>
    );
  }

  if (!user) {
    return <p role="status" className="py-12 text-center text-muted-foreground">Loading your profile…</p>;
  }

  const formatDate = (value?: string | null) => {
    if (!value) return "Not provided";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not provided" : new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(date);
  };
  const initials = (user.name || user.email).trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const details = [
    { label: "Full name", value: user.name || "Not provided" },
    { label: "Email", value: user.email },
    { label: "Department", value: user.department?.name || "Not provided" },
    { label: "Role", value: user.role },
    { label: "Status", value: user.status || "Not provided" },
    { label: "Hire date", value: formatDate(user.hireDate) },
    { label: "Account created", value: formatDate(user.createdAt) },
  ];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 pb-12">
      <HeaderPage title="My profile" subtitle="Your account and team information." />
      <Card className="glass-card rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-pink-500 text-lg font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-2">
            <CardTitle className="break-words">{user.name || user.email}</CardTitle>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-6 sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label} className="min-w-0 space-y-1">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="break-words font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          {editing ? <ProfileForm user={user} onClose={() => setEditing(false)} /> : (
            <Button className="mt-6" onClick={() => setEditing(true)}>Edit profile</Button>
          )}
          <div className="mt-8 border-t pt-6">
            <Button variant="outline" onClick={logout}>Sign out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
