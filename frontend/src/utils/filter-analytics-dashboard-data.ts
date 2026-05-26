// src/utils/filter-analytics-dashboard-data.ts

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import {
  getCostByDepartment,
  getExpiringTools,
  getLeastUsedTools,
  getMostUsedTools,
  getPotentialSavings,
  getTopExpensiveTools,
  getUnusedTools,
} from "@/utils/analytics";

export function filterAnalyticsDashboardData(
  data: AnalyticsDashboardData,
  department: string,
): AnalyticsDashboardData {
  if (department === "all") {
    return data;
  }

  const filteredTools = data.tools.filter(
    (tool) => tool.owner_department.toLowerCase() === department,
  );

  const filteredToolIds = new Set(filteredTools.map((tool) => tool.id));

  const filteredUserTools = data.userTools.filter((userTool) =>
    filteredToolIds.has(userTool.tool_id),
  );

  return {
    ...data,
    tools: filteredTools,
    userTools: filteredUserTools,
    departmentCosts: getCostByDepartment(filteredTools),
    topExpensiveTools: getTopExpensiveTools(filteredTools),
    mostUsedTools: getMostUsedTools(filteredTools, filteredUserTools),
    leastUsedTools: getLeastUsedTools(filteredTools, filteredUserTools),
    unusedTools: getUnusedTools(filteredTools),
    expiringTools: getExpiringTools(filteredTools),
    potentialSavings: getPotentialSavings(filteredTools),
  };
}
