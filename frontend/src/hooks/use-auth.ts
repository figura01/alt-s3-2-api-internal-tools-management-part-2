"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getCurrentUser,
  login,
  register,
  type LoginDto,
  type RegisterDto,
} from "@/services/auth.service";

import { useAppStore } from "@/store/store";

const AUTH_TOKEN_KEY = "access_token";

export const authQueryKey = ["auth", "me"] as const;

export function useCurrentUserQuery() {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  return useQuery({
    queryKey: authQueryKey,
    queryFn: async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    },
    enabled:
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: async (data) => {
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      setCurrentUser(data.user);

      await queryClient.invalidateQueries({
        queryKey: authQueryKey,
      });

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
      localStorage.setItem(AUTH_TOKEN_KEY, data.access_token);
      setCurrentUser(data.user);

      await queryClient.invalidateQueries({
        queryKey: authQueryKey,
      });

      toast.success("Account created successfully");
    },

    onError: () => {
      toast.error("Failed to create account");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  return () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setCurrentUser(null);
    queryClient.removeQueries({ queryKey: authQueryKey });
    toast.success("Logged out");
  };
}
