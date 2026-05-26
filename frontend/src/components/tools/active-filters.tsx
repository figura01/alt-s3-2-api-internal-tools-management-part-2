"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";

const FILTERS = ["q", "status", "department"] as const;

export function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters = FILTERS.map((key) => ({
    key,
    value: searchParams.get(key),
  })).filter((filter) => filter.value);

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key);
    params.delete("page");

    const query = params.toString();

    router.push(query ? `/tools?${query}` : "/tools");
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center mb-1 gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="gap-1 rounded-full px-3 py-1"
        >
          <span>
            {filter.key}: {filter.value}
          </span>

          <button
            type="button"
            onClick={() => removeFilter(filter.key)}
            className="ml-1 rounded-full hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
