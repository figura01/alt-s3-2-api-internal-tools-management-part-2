// src/services/tools.service.ts

import { api } from "@/lib/api";

import { mapToolToTable, normalizeTool } from "@/mappers/tool.mapper";

import type {
  ApiTool,
  Tool,
  ToolForTable,
  ToolsApiResponse,
  ToolsResponse,
} from "@/types/tool";

import type { CreateToolValues, UpdateToolValues } from "@/schemas/tool.schema";

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */

export type GetToolsParams = {
  query?: string;
  status?: string;
  department?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export async function getTools(
  params: GetToolsParams = {},
): Promise<ToolsResponse> {
  const searchParams = new URLSearchParams();

  if (params.query) {
    searchParams.set("query", params.query);
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.department && params.department !== "all") {
    searchParams.set("department", params.department);
  }

  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();

  const url = `/tools${queryString ? `?${queryString}` : ""}`;

  const response = await api<ToolsApiResponse>(url, {
    cache: "no-store",
  });

  return {
    ...response,
    data: response.data.map(normalizeTool),
  };
}

export async function getAllTools(): Promise<Tool[]> {
  const limit = 100;

  const firstPage = await getTools({
    page: 1,
    limit,
  });

  const tools = [...firstPage.data];

  const totalPages = Math.ceil(firstPage.filtered / limit);

  if (totalPages <= 1) {
    return tools;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      getTools({
        page: index + 2,
        limit,
      }),
    ),
  );

  remainingPages.forEach((response) => {
    tools.push(...response.data);
  });

  return tools;
}

/* -------------------------------------------------------------------------- */
/*                                GET BY ID                                   */
/* -------------------------------------------------------------------------- */

export async function getToolById(id: string): Promise<Tool> {
  const tool = await api<ApiTool>(`/tools/${id}`, {
    cache: "no-store",
  });

  return normalizeTool(tool);
}

/* -------------------------------------------------------------------------- */
/*                              RECENT TOOLS TABLE                            */
/* -------------------------------------------------------------------------- */

export async function getRecentToolsForTable(): Promise<ToolForTable[]> {
  const response = await api<ToolsApiResponse>(
    "/tools?sort_by=created_at&sort_order=desc&limit=8",
    {
      cache: "no-store",
    },
  );

  return response.data.map(normalizeTool).map(mapToolToTable);
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export async function createTool(values: CreateToolValues): Promise<Tool> {
  const createdTool = await api<ApiTool>("/tools", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return normalizeTool(createdTool);
}

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export async function updateTool(values: UpdateToolValues): Promise<Tool> {
  const { id, ...payload } = values;

  const updatedTool = await api<ApiTool>(`/tools/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return normalizeTool(updatedTool);
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function deleteTool(id: string): Promise<void> {
  await api<void>(`/tools/${id}`, {
    method: "DELETE",
  });
}
