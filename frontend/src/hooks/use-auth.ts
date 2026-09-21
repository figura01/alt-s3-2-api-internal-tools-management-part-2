"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/lib/auth-token";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

import {
  getCurrentUser,
  updateProfile,
  login,
  logout,
  register,
  type LoginDto,
  type RegisterDto,
} from "@/services/auth.service";

import { useAppStore } from "@/store/store";


export const authQueryKey = ["auth", "me"] as const;

export function useCurrentUserQuery() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Remove tokens left by versions using localStorage.
    try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch {}
    setMounted(true);
  }, []);

  return useQuery({
    queryKey: authQueryKey,
    queryFn: async ({ signal }) => {
      try {
        const user = await getCurrentUser(signal);
        if (!signal.aborted) useAppStore.getState().setCurrentUser(user);
        return user;
      } catch (error) {
        if (!signal.aborted && error instanceof ApiError && error.status === 401) {
          useAppStore.getState().setCurrentUser(null);
          return null;
        }
        throw error;
      }
    },
    enabled: mounted,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: async (data) => {
      await queryClient.cancelQueries();
      queryClient.clear();
      setCurrentUser(data.user);

      queryClient.setQueryData(authQueryKey, data.user);

      toast.success("Logged in successfully");
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (dto: RegisterDto) => register(dto),

    onSuccess: async (data) => {
      await queryClient.cancelQueries();
      queryClient.clear();
      setCurrentUser(data.user);

      queryClient.setQueryData(authQueryKey, data.user);

      toast.success("Account created successfully");
    },

    onError: () => {
      toast.error("Failed to create account");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    try {
      await logout();
    } catch {
      toast.error("Unable to sign out. Please try again.");
      return;
    }
    useAppStore.getState().setCurrentUser(null);
    await queryClient.cancelQueries();
    queryClient.clear();
    router.replace("/login");
    router.refresh();
    toast.success("Logged out");
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async (user) => {
      await queryClient.cancelQueries({ queryKey: authQueryKey });
      // A pending save must not restore a session that has been signed out.
      if (useAppStore.getState().currentUser?.id !== user.id) return;
      useAppStore.getState().setCurrentUser(user);
      queryClient.setQueryData(authQueryKey, user);
      toast.success("Profile updated");
    },
  });
}
