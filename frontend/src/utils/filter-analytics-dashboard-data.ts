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

  const activeUsers = filteredTools.reduce(
    (sum, tool) => sum + tool.active_users_count,
    0,
  );

  const costPerUser = activeUsers > 0 ? totalMonthlySpend / activeUsers : 0;

  const budgetUtilization =
    data.monthlyLimit > 0 ? (totalMonthlySpend / data.monthlyLimit) * 100 : 0;

  return {
    ...data,

    tools: filteredTools,
    spendHistory: { ...data.spendHistory, points: data.spendHistory.points.filter(point => point.department === department) },

    totalMonthlySpend,
    budgetUtilization,

    analytics: {
      ...data.analytics,

      budget_overview: {
        ...data.analytics.budget_overview,
        current_month_total: totalMonthlySpend,
        budget_utilization: budgetUtilization,
      },

      cost_analytics: {
        ...data.analytics.cost_analytics,
        active_users: activeUsers,
        cost_per_user: costPerUser,
      },
    },

    departmentCosts: getCostByDepartment(filteredTools),
    topExpensiveTools: getTopExpensiveTools(filteredTools),
    mostUsedTools: getMostUsedTools(filteredTools),
    leastUsedTools: getLeastUsedTools(filteredTools),
    unusedTools: getUnusedTools(filteredTools),
    expiringTools: getExpiringTools(filteredTools),
    potentialSavings: getPotentialSavings(filteredTools),
  };
}
