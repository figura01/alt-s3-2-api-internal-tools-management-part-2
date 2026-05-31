"use client";

import { useSyncStoreWithUrl } from "@/hooks/use-sync-store-with-url";

type Props = {
  children: React.ReactNode;
};

export function AppStoreSyncProvider({ children }: Props) {
  useSyncStoreWithUrl();

  return <>{children}</>;
}
