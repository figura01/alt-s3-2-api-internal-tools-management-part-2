import type { Tool } from "@/types/tool";
import type { UserTool } from "@/types/user-tool";

export function getTotalMonthlySpend(tools: Tool[]): number {
  return tools.reduce((total, tool) => {
    return total + tool.monthly_cost;
  }, 0);
}

export function getAverageCostPerTool(tools: Tool[]): number {
  if (tools.length === 0) return 0;

  return getTotalMonthlySpend(tools) / tools.length;
}

export function getUnusedTools(tools: Tool[]): Tool[] {
  return tools.filter((tool) => tool.status === "unused");
}

export function getExpiringTools(tools: Tool[]): Tool[] {
  return tools.filter((tool) => tool.status === "expiring");
}

export function getTopExpensiveTools(tools: Tool[], limit = 5): Tool[] {
  return [...tools]
    .sort((a, b) => b.monthly_cost - a.monthly_cost)
    .slice(0, limit);
}

export function getCostByDepartment(tools: Tool[]) {
  const departmentCosts = tools.reduce<Record<string, number>>((acc, tool) => {
    const department = tool.owner_department || "Unknown";

    acc[department] = (acc[department] ?? 0) + tool.monthly_cost;

    return acc;
  }, {});

  return Object.entries(departmentCosts).map(([name, value]) => ({
    name,
    value,
  }));
}

export function getAdoptionByTool(tools: Tool[], userTools: UserTool[]) {
  return tools.map((tool) => {
    const usageCount = userTools.filter(
      (relation) => relation.tool_id === tool.id,
    ).length;

    return {
      id: tool.id,
      name: tool.name,
      users: usageCount,
      monthly_cost: tool.monthly_cost,
    };
  });
}

export function getLeastUsedTools(
  tools: Tool[],
  userTools: UserTool[],
  limit = 5,
) {
  return getAdoptionByTool(tools, userTools)
    .sort((a, b) => a.users - b.users)
    .slice(0, limit);
}

export function getMostUsedTools(
  tools: Tool[],
  userTools: UserTool[],
  limit = 5,
) {
  return getAdoptionByTool(tools, userTools)
    .sort((a, b) => b.users - a.users)
    .slice(0, limit);
}

export function getPotentialSavings(tools: Tool[]): number {
  return getUnusedTools(tools).reduce((total, tool) => {
    return total + tool.monthly_cost;
  }, 0);
}
