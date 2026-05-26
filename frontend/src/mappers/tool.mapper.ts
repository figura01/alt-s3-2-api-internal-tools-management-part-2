import { toolSchema } from "@/schemas/tool.schema";
import type { ApiJsonTool, Tool, ToolForTable } from "@/types/tool";

export function normalizeTool(tool: ApiJsonTool): Tool {
  return toolSchema.parse({
    id: tool.id,
    name: tool.name ?? "Untitled tool",
    description: tool.description ?? "",
    vendor: tool.vendor ?? "",
    category: tool.category ?? "Uncategorized",
    owner_department: tool.owner_department ?? tool.department ?? "Unknown",
    department: tool.department ?? tool.owner_department ?? "Unknown",
    status:
      tool.status === "active" ||
      tool.status === "unused" ||
      tool.status === "expiring"
        ? tool.status
        : "active",
    website_url: tool.website_url ?? "",
    icon_url: tool.icon_url ?? "",
    monthly_cost: tool.monthly_cost ?? 0,
    previous_month_cost: tool.previous_month_cost ?? 0,
    active_users_count: tool.active_users_count ?? 0,
    created_at: tool.created_at ?? "",
    updated_at: tool.updated_at ?? tool.last_update ?? "",
    last_update: tool.last_update ?? tool.updated_at ?? "",
  });
}

export function mapToolToTable(tool: Tool): ToolForTable {
  return {
    id: tool.id,
    name: tool.name,
    icon_url: tool.icon_url || "/image-default.png",
    owner_department: tool.owner_department || "N/A",
    users: tool.active_users_count ?? "N/A",
    monthly_cost: tool.monthly_cost,
    status: tool.status,
    last_update: tool.updated_at || tool.last_update || "N/A",
  };
}
