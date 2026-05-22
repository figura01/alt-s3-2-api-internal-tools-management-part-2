import type {
  Tool,
  ToolForTable,
  InputTool,
  OutputTool,
  KpiTool,
  ApiJsonTool,
} from "@/types/tool";
import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_JSON_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export async function getRecentTools() {
  return api<KpiTool[]>("/tools?_sort=updated_at&_order=desc&_limit=8", {
    cache: "no-store",
  });
}

export async function getRecentToolsForTable(): Promise<ToolForTable[]> {
  const response = await fetch(
    `${API_URL}/tools?_sort=updated_at&_order=desc&_limit=8`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recent tools");
  }

  const tools = await response.json();
  console.log("tools in getRecents:", tools);
  return tools.map(
    (tool: Tool): ToolForTable => ({
      id: tool.id,
      name: tool.vendor,
      icon_url: tool.icon_url || "/default.png",
      owner_department: tool.owner_department,
      users: tool.active_users_count || "N/A",
      monthly_cost: tool.monthly_cost,
      status: tool.status,
    }),
  );
}

//FOR REAL API CALLS
// export async function getTools(): Promise<Tool[]> {
//   // http://localhost:3001/api/tools?min_cost=10&max_cost=50&category=Development&page=1&limit=10&sort_by=created_at&sort_order=desc
//   // http://localhost:3001/api/tools?department=Sales&status=active&min_cost=10&max_cost=50&category=Development&page=1&limit=10&sort_by=created_at&sort_order=desc
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_URL}/tools?_sort=updated_at&_order=desc&_limit=8`,
//     {
//       cache: "no-store",
//     },
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch recent tools");
//   }

//   return response.json();
// }

export async function createTool(tool: InputTool): Promise<OutputTool> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tools`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tool),
  });

  if (!response.ok) {
    throw new Error("Failed to create tool");
  }

  return response.json();
}

export async function updateToolById(tool: Tool): Promise<OutputTool> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tools/${tool.id}`,
    {
      cache: "no-store",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tool),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update tool");
  }

  return response.json();
}

export async function deleteToolById(id: number): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tools/${id}`,
    {
      cache: "no-store",
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete tool");
  }
}

export async function getTools() {
  return api<KpiTool[]>("/tools", {
    cache: "no-store",
  });
}

export async function getAllTools() {
  return api<ApiJsonTool[]>("/tools", {
    cache: "no-store",
  });
}

export async function getToolById(id: string) {
  return api<ApiJsonTool>(`/tools/${id}`, {
    cache: "no-store",
  });
}
