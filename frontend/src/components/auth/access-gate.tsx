"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/button";

export function AccessGate({ roles, children }: { roles?: UserRole[]; children: ReactNode }) {
  const session = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (session.isSuccess && !session.data) router.replace("/login");
  }, [session.isSuccess, session.data, router]);
  if (session.isError) return <div role="alert" className="py-12">Unable to verify your session. <Button onClick={() => session.refetch()}>Retry</Button></div>;
  if (!session.data) return <p role="status" className="py-12">Loading your session…</p>;
  if (roles && !roles.includes(session.data.role)) return <p role="alert" className="py-12">Access denied. Your role does not allow access to this page.</p>;
  return children;
}
