// src/components/tools/search-result-label.tsx

"use client";

import { useAppStore } from "@/store/store";
import { ClearSearchButton } from "@/components/tools/clear-search-button";

export function SearchResultLabel() {
  const q = useAppStore((state) => state.q);

  if (!q) return null;

  return (
    <div className="flex flex-row items-center justify-start">
      <p className="text-muted-foreground">
        Search results for{" "}
        <span className="font-medium text-foreground">“{q}”</span>
      </p>

      <ClearSearchButton />
    </div>
  );
}
