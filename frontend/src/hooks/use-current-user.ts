"use client";
import { useAppStore } from "@/store/store";

export function useCurrentUser() {
  const user = useAppStore((state) => state.currentUser);
  return { user, isAuthenticated: Boolean(user) };
}
