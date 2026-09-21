import { api } from "@/lib/api";
import type { SpendHistory } from "@/types/analytics-dashboard";
import { getAnalytics } from "@/services/analytics.service";
import { getDepartments } from "@/services/departments.service";
import { getAllTools } from "@/services/tools.service";

import {
  getCostByDepartment,
  getExpiringTools,
  getLeastUsedTools,
  getMostUsedTools,
  getPotentialSavings,
  getTopExpensiveTools,
  getUnusedTools,
} from "@/utils/analytics";

export async function getAnalyticsDashboardData() {
  const [analytics, departments, tools, spendHistory] = await Promise.all([
    getAnalytics(),
    getDepartments(),
    getAllTools(),
    api<SpendHistory>("/analytics/spend-history"),
  ]);

  const totalMonthlySpend = analytics.budget_overview.current_month_total;

  const monthlyLimit = analytics.budget_overview.monthly_limit;

  const budgetUtilization = analytics.budget_overview.budget_utilization;

  const departmentCosts = getCostByDepartment(tools);

  const topExpensiveTools = getTopExpensiveTools(tools);

  const mostUsedTools = getMostUsedTools(tools);

  const leastUsedTools = getLeastUsedTools(tools);

  const unusedTools = getUnusedTools(tools);

  const expiringTools = getExpiringTools(tools);

  const potentialSavings = getPotentialSavings(tools);

  return {
    spendHistory,
    analytics,
    departments,
    tools,
    totalMonthlySpend,
    monthlyLimit,
    budgetUtilization,
    departmentCosts,
    topExpensiveTools,
    mostUsedTools,
    leastUsedTools,
    unusedTools,
    expiringTools,
    potentialSavings,
  };
}
