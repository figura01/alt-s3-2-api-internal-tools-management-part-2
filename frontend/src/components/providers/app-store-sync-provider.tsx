"use client";

import { useSyncStoreWithUrl } from "@/hooks/use-sync-store-with-url";
import { Suspense, useEffect } from "react";
import { useAppStore } from "@/store/store";
import { readDisplayPreferences } from "@/lib/display-preferences";

type Props = {
  children: React.ReactNode;
};

function UrlStoreSync() {
  useSyncStoreWithUrl();
  return null;
}

export function AppStoreSyncProvider({ children }: Props) {
  useEffect(() => {
    const preferences = readDisplayPreferences();
    if (preferences) useAppStore.setState(preferences);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <UrlStoreSync />
      </Suspense>
      {children}
    </>
  );
}
