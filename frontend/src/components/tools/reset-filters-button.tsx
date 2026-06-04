// src/components/tools/reset-filters-button.tsx

"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppStore, useToolFilters } from "@/store/store";

export function ResetFiltersButton() {
  const { q, status, department, category } = useToolFilters();

  const hasFilters =
    q || status !== "all" || department !== "all" || category !== "all";

  if (!hasFilters) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={useAppStore.getState().resetFilters}
      className="h-9"
    >
      <X className="mr-2 h-4 w-4" />
      Reset
    </Button>
  );
}
