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
    (tool) => tool.owner_department === department,
  );

  const totalMonthlySpend = filteredTools.reduce(
    (sum, tool) => sum + tool.monthly_cost,
    0,
  );

  const budgetUtilization =
    data.monthlyLimit > 0 ? (totalMonthlySpend / data.monthlyLimit) * 100 : 0;

  return {
    ...data,

    tools: filteredTools,
    spendHistory: { ...data.spendHistory, points: data.spendHistory.points.filter(point => point.department === department) },

    totalMonthlySpend,
    budgetUtilization,

    departmentCosts: getCostByDepartment(filteredTools),
    topExpensiveTools: getTopExpensiveTools(filteredTools),
    mostUsedTools: getMostUsedTools(filteredTools),
    leastUsedTools: getLeastUsedTools(filteredTools),
    unusedTools: getUnusedTools(filteredTools),
    expiringTools: getExpiringTools(filteredTools),
    potentialSavings: getPotentialSavings(filteredTools),
  };
}
