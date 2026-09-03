import { TOOL_STATUSES, type ToolStatus, type Tool } from "@/types/tool";

export function getUniqueToolDepartments(tools: Tool[]) {
  return Array.from(
    new Set(
      tools
        .map((tool) => tool.owner_department || tool.department)
        .map((department) => department?.trim())
        .filter((department): department is string => Boolean(department)),
    ),
  ).sort();
}

export function getUniqueToolCategories(tools: Tool[]) {
  return Array.from(
    new Set(
      tools
        .map((tool) => tool.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort();
}

export function parseToolStatus(value: string | null): ToolStatus | "all" {
  if (!value || value === "all") {
    return "all";
  }

  return TOOL_STATUSES.includes(value as ToolStatus)
    ? (value as ToolStatus)
    : "all";
}
