// src/components/tools/status-filter.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/store";

export function StatusFilter() {
  const status = useAppStore((state) => state.status);
  const setStatus = useAppStore((state) => state.setStatus);

  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="h-9 w-36">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All status</SelectItem>
        <SelectItem value="ACTIVE">Active</SelectItem>
        <SelectItem value="UNUSED">Unused</SelectItem>
        <SelectItem value="EXPIRING">Expiring</SelectItem>
      </SelectContent>
    </Select>
  );
}
