// src/components/tools/status-filter.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    params.delete("page");

    router.push(`/tools?${params.toString()}`);
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-36">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All status</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="unused">Unused</SelectItem>
        <SelectItem value="expiring">Expiring</SelectItem>
      </SelectContent>
    </Select>
  );
}
