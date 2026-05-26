// src/components/tools/department-filter.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Communication",
];

export function DepartmentFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDepartment = searchParams.get("department") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("department");
    } else {
      params.set("department", value.toLowerCase());
    }

    params.delete("page");

    router.push(`/tools?${params.toString()}`);
  }

  return (
    <Select value={currentDepartment} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-44">
        <SelectValue placeholder="Department" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All departments</SelectItem>

        {departments.map((department) => (
          <SelectItem key={department} value={department.toLowerCase()}>
            {department}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
