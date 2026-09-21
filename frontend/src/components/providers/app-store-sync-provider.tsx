"use client";

import { useSyncStoreWithUrl } from "@/hooks/use-sync-store-with-url";
import { useEffect } from "react";
import { useAppStore } from "@/store/store";
import { readDisplayPreferences } from "@/lib/display-preferences";

type Props = {
  children: React.ReactNode;
};

export function AppStoreSyncProvider({ children }: Props) {
  useSyncStoreWithUrl();
  useEffect(() => {
    const preferences = readDisplayPreferences();
    if (preferences) useAppStore.setState(preferences);
  }, []);

  return <>{children}</>;
}
