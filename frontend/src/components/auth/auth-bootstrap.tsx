"use client";

import { useCurrentUserQuery } from "@/hooks/use-auth";

export function AuthBootstrap() {
  useCurrentUserQuery();

  return null;
}
