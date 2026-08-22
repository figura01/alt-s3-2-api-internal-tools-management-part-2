import { toolSchema } from "@/schemas/tool.schema";

import type { ApiTool, Tool, ToolForTable, ToolStatus } from "@/types/tool";

function normalizeToolStatus(status?: string): ToolStatus {
  switch (status?.toUpperCase()) {
    case "INACTIVE":
      return "INACTIVE";

    case "EXPIRING":
      return "EXPIRING";

    case "UNUSED":
      return "UNUSED";

    case "ACTIVE":
    default:
      return "ACTIVE";
  }
}

export function normalizeTool(tool: ApiTool): Tool {
  const department = tool.owner_department ?? tool.department ?? "Unknown";

  const updatedAt = tool.updated_at ?? tool.last_update ?? "";

  return toolSchema.parse({
    id: String(tool.id ?? ""),

    name: tool.name ?? "Untitled tool",

    description: tool.description ?? null,

    vendor: tool.vendor ?? null,

    category: tool.category ?? "Uncategorized",

    owner_department: department,

    department,

    status: normalizeToolStatus(tool.status),

    website_url: tool.website_url ?? null,

    icon_url: tool.icon_url ?? null,

    monthly_cost: Number(tool.monthly_cost ?? 0),

    previous_month_cost:
      tool.previous_month_cost == null
        ? null
        : Number(tool.previous_month_cost),

    active_users_count: Number(tool.active_users_count ?? 0),

    created_at: tool.created_at ?? "",

    updated_at: updatedAt,

    last_update: updatedAt,
  });
}

export function mapToolToTable(tool: Tool): ToolForTable {
  return {
    id: tool.id,
    name: tool.name,

    icon_url: tool.icon_url ?? "/image-default.png",

    owner_department: tool.owner_department || "N/A",

    users: tool.active_users_count,

    monthly_cost: tool.monthly_cost,

    status: tool.status,

    last_update: tool.updated_at || tool.last_update || "N/A",
  };
}
