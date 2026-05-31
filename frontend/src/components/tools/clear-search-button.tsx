"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";

export function ClearSearchButton() {
  const setQuery = useAppStore((state) => state.setQuery);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="ml-2"
      onClick={() => setQuery("")}
    >
      Clear search
    </Button>
  );
}
