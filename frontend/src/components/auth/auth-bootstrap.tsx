"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { authQueryKey, useCurrentUserQuery } from "@/hooks/use-auth";

export function AuthBootstrap() {
  useCurrentUserQuery();
  const queryClient = useQueryClient();
  useEffect(() => {
    const expire = () => {
      useAppStore.getState().setCurrentUser(null);
      void queryClient.cancelQueries().then(() => {
        queryClient.clear();
        queryClient.setQueryData(authQueryKey, null);
      });
    };
    window.addEventListener("auth:expired", expire);
    return () => window.removeEventListener("auth:expired", expire);
  }, [queryClient]);

  return null;
}
