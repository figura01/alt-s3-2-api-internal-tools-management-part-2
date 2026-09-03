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
  const [analytics, departments, tools] = await Promise.all([
    getAnalytics(),
    getDepartments(),
    getAllTools(),
  ]);

  const totalMonthlySpend = analytics.budget_overview.current_month_total;

  const monthlyLimit = analytics.budget_overview.monthly_limit;

  const budgetUtilization = Number(
    analytics.budget_overview.budget_utilization,
  );

  const departmentCosts = getCostByDepartment(tools);

  const topExpensiveTools = getTopExpensiveTools(tools);

  const mostUsedTools = getMostUsedTools(tools);

  const leastUsedTools = getLeastUsedTools(tools);

  const unusedTools = getUnusedTools(tools);

  const expiringTools = getExpiringTools(tools);

  const potentialSavings = getPotentialSavings(tools);

  return {
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
