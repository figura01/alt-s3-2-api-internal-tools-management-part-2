"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { useToolFilters } from "@/store/store";
import { useTools } from "@/hooks/use-tools";

import type { Tool, ToolsResponse } from "@/types/tool";

type Props = {
  initialData: ToolsResponse;
  columns: ColumnDef<Tool, unknown>[];
};

export function ToolsTable({ initialData, columns }: Props) {
  const { q, status, department, category } = useToolFilters();

  const { data: toolsResponse } = useTools(
    {
      query: q || undefined,

      status: status !== "all" ? status : undefined,

      department: department !== "all" ? department : undefined,

      category: category !== "all" ? category : undefined,
    },
    initialData,
  );

  const tools = toolsResponse?.data ?? initialData.data;

  return <DataTable data={tools} columns={columns} />;
}
