import type { Department } from "@/types/department";
import type { Tool } from "@/types/tool";
import type { UserTool } from "@/types/user-tool";
import type { Analytics } from "@/types/analytic";

export type DepartmentCost = {
  name: string;
  value: number;
};

export type ToolUsageAnalytics = {
  id?: number;
  name: string;
  users: number;
  monthly_cost: number;
};

export type AnalyticsDashboardData = {
  analytics: Analytics;
  departments: Department[];
  tools: Tool[];
  userTools: UserTool[];
  totalMonthlySpend: number;
  monthlyLimit: number;
  budgetUtilization: number;
  departmentCosts: DepartmentCost[];
  topExpensiveTools: Tool[];
  mostUsedTools: ToolUsageAnalytics[];
  leastUsedTools: ToolUsageAnalytics[];
  unusedTools: Tool[];
  expiringTools: Tool[];
  potentialSavings: number;
};
