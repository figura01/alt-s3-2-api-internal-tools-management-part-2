"use client";

import { X } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ResetFiltersButton() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const hasFilters =
    searchParams.get("q") ||
    searchParams.get("status") ||
    searchParams.get("department");

  function handleReset() {
    router.push("/tools");
  }

  if (!hasFilters) {
    return null;
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleReset} className="h-9">
      <X className="mr-2 h-4 w-4" />
      Reset
    </Button>
  );
}
