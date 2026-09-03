"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table/data-table";
import { useToolFilters, useAppStore } from "@/store/store";
import { useTools } from "@/hooks/use-tools";

import type { Tool, ToolsResponse } from "@/types/tool";

type Props = {
  initialData: ToolsResponse;
  columns: ColumnDef<Tool, unknown>[];
};

export function ToolsTable({ initialData, columns }: Props) {
  const { q, status, department, category } = useToolFilters();

  const page = useAppStore((state) => state.page);
  const pageSize = useAppStore((state) => state.pageSize);

  const params = {
    query: q || undefined,

    status: status !== "all" ? status : undefined,

    department: department !== "all" ? department : undefined,

    category: category !== "all" ? category : undefined,

    page,

    limit: pageSize,
  };

  const hasActiveState =
    Boolean(q) ||
    status !== "all" ||
    department !== "all" ||
    category !== "all" ||
    page !== 1 ||
    pageSize !== initialData.limit;

  const { data: toolsResponse } = useTools(
    params,
    hasActiveState ? undefined : initialData,
  );

  const response = toolsResponse ?? initialData;

  return (
    <DataTable
      data={response.data}
      columns={columns}
      total={response.filtered}
    />
  );
}
