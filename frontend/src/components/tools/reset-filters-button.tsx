// src/components/tools/reset-filters-button.tsx

"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/store";

export function ResetFiltersButton() {
  const q = useAppStore((state) => state.q);
  const status = useAppStore((state) => state.status);
  const department = useAppStore((state) => state.department);
  const resetFilters = useAppStore((state) => state.resetFilters);

  const hasFilters = q || status !== "all" || department !== "all";

  if (!hasFilters) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={resetFilters}
      className="h-9"
    >
      <X className="mr-2 h-4 w-4" />
      Reset
    </Button>
  );
}
