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

import type { Department } from "@/types/department";

type DepartmentFilterProps = {
  departments: Department[];
};

export function DepartmentFilter({ departments }: DepartmentFilterProps) {
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
          <SelectItem key={department.id} value={department.name}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
