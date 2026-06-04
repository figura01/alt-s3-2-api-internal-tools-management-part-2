"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { useToolFilters } from "@/store/store";

import type { Tool } from "@/types/tool";

type Props = {
  data: Tool[];
  columns: ColumnDef<Tool, unknown>[];
};

export function ToolsTable({ data, columns }: Props) {
  const { q, status, department, category } = useToolFilters();

  const filteredData = useMemo(() => {
    const search = q.trim().toLowerCase();

    return data.filter((tool) => {
      const matchesSearch =
        !search ||
        tool.name.toLowerCase().includes(search) ||
        tool.vendor.toLowerCase().includes(search) ||
        tool.category.toLowerCase().includes(search) ||
        tool.owner_department.toLowerCase().includes(search) ||
        tool.department.toLowerCase().includes(search) ||
        tool.status.toLowerCase().includes(search);

      const matchesStatus = status === "all" || tool.status === status;

      const matchesDepartment =
        department === "all" ||
        tool.owner_department.toLowerCase() === department ||
        tool.department.toLowerCase() === department;

      const matchesCategory =
        category === "all" || tool.category.toLowerCase() === category;

      return (
        matchesSearch && matchesStatus && matchesDepartment && matchesCategory
      );
    });
  }, [data, q, status, department, category]);

  return <DataTable data={filteredData} columns={columns} />;
}
