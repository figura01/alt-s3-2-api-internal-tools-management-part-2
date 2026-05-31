// src/components/tools/department-filter.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppStore } from "@/store/store";

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Communication",
];

export function DepartmentFilter() {
  const department = useAppStore((state) => state.department);

  const setDepartment = useAppStore((state) => state.setDepartment);

  return (
    <Select value={department} onValueChange={setDepartment}>
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
