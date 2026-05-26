// src/services/tools.service.ts

import { api } from "@/lib/api";

import { mapToolToTable, normalizeTool } from "@/mappers/tool.mapper";

import type { ApiJsonTool, Tool, ToolForTable } from "@/types/tool";

import type { CreateToolValues, UpdateToolValues } from "@/schemas/tool.schema";

/* -------------------------------------------------------------------------- */
/*                                   GET ALL                                  */
/* -------------------------------------------------------------------------- */

export async function getAllTools(): Promise<Tool[]> {
  const tools = await api<ApiJsonTool[]>("/tools", {
    cache: "no-store",
  });

  return tools.map(normalizeTool);
}

/* -------------------------------------------------------------------------- */
/*                                GET BY ID                                   */
/* -------------------------------------------------------------------------- */

export async function getToolById(id: number): Promise<Tool> {
  const tool = await api<ApiJsonTool>(`/tools/${id}`, {
    cache: "no-store",
  });

  return normalizeTool(tool);
}

/* -------------------------------------------------------------------------- */
/*                              RECENT TOOLS TABLE                            */
/* -------------------------------------------------------------------------- */

export async function getRecentToolsForTable(): Promise<ToolForTable[]> {
  const tools = await api<ApiJsonTool[]>(
    "/tools?_sort=updated_at&_order=desc&_limit=8",
    {
      cache: "no-store",
    },
  );

  return tools.map(normalizeTool).map(mapToolToTable);
}

/* -------------------------------------------------------------------------- */
/*                                   CREATE                                   */
/* -------------------------------------------------------------------------- */

export async function createTool(values: CreateToolValues): Promise<Tool> {
  const now = new Date().toISOString();

  const createdTool = await api<ApiJsonTool>("/tools", {
    method: "POST",

    body: JSON.stringify({
      ...values,

      created_at: now,

      updated_at: now,
    }),
  });

  return normalizeTool(createdTool);
}

/* -------------------------------------------------------------------------- */
/*                                   UPDATE                                   */
/* -------------------------------------------------------------------------- */

export async function updateTool(values: UpdateToolValues): Promise<Tool> {
  const { id, ...payload } = values;

  const updatedTool = await api<ApiJsonTool>(`/tools/${id}`, {
    method: "PATCH",

    body: JSON.stringify({
      ...payload,

      updated_at: new Date().toISOString(),
    }),
  });

  return normalizeTool(updatedTool);
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function deleteTool(id: number): Promise<void> {
  await api<void>(`/tools/${id}`, {
    method: "DELETE",
  });
}
