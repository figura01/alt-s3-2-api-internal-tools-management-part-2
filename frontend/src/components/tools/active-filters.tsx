"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/store";

export function ActiveFilters() {
  const q = useAppStore((state) => state.q);
  const status = useAppStore((state) => state.status);
  const department = useAppStore((state) => state.department);
  const category = useAppStore((state) => state.category);

  const setQuery = useAppStore((state) => state.setQuery);
  const setStatus = useAppStore((state) => state.setStatus);
  const setDepartment = useAppStore((state) => state.setDepartment);
  const setCategory = useAppStore((state) => state.setCategory);

  const filters = [
    q
      ? {
          label: "Search",
          value: q,
          onRemove: () => setQuery(""),
        }
      : null,

    status !== "all"
      ? {
          label: "Status",
          value: status,
          onRemove: () => setStatus("all"),
        }
      : null,

    department !== "all"
      ? {
          label: "Department",
          value: department,
          onRemove: () => setDepartment("all"),
        }
      : null,

    category !== "all"
      ? {
          label: "Category",
          value: category,
          onRemove: () => setCategory("all"),
        }
      : null,
  ].filter(Boolean);

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {filters.map((filter) => (
        <Badge
          key={`${filter!.label}-${filter!.value}`}
          variant="secondary"
          className="gap-1 rounded-full px-3 py-1"
        >
          <span>
            {filter!.label}: {filter!.value}
          </span>

          <button
            type="button"
            onClick={filter!.onRemove}
            className="ml-1 rounded-full hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
