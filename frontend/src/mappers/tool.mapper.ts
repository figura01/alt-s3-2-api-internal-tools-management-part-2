import { ApiJsonTool, Tool, ToolForRecentTable } from "@/types/tool";
import { toolSchema } from "@/schemas/tool.schema";

export function normalizeTool(tool: ApiJsonTool): Tool {
  return toolSchema.parse({
    id: tool.id,
    name: tool.name ?? "Untitled tool",
    description: tool.description ?? "",
    vendor: tool.vendor ?? "",
    category: tool.category ?? "Uncategorized",
    monthly_cost: tool.monthly_cost ?? 0,
    previous_month_cost: tool.previous_month_cost ?? 0,
    owner_department: tool.owner_department ?? tool.department ?? "Unknown",
    department: tool.department ?? tool.owner_department ?? "Unknown",
    status: tool.status ?? "active",
    website_url: tool.website_url ?? "",
    active_users_count: tool.active_users_count ?? 0,
    icon_url: tool.icon_url ?? "",
    created_at: tool.created_at ?? "",
    updated_at: tool.updated_at ?? tool.last_update ?? "",
    last_update: tool.last_update ?? tool.updated_at ?? "",
  });
}

export function mapToolToTable(tool: Tool): ToolForRecentTable {
  return {
    id: tool.id,
    name: tool.name,
    icon_url: tool.icon_url || "/image-default.png",
    owner_department: tool.owner_department || "N/A",
    users: tool.active_users_count ?? "N/A",
    monthly_cost: tool.monthly_cost ?? 0,
    status: tool.status,
  };
}
