import type { Department } from "@/types/department";
import type { Tool } from "@/types/tool";
import type { Analytics } from "@/types/analytic";

export type DepartmentCost = {
  name: string;
  value: number;
};

export type ToolUsageAnalytics = {
  id?: string;
  name: string;
  users: number;
  monthly_cost: number;
};

export type SpendHistory = {
  endMonth: string;
  points: { month: string; department: string; spend: number; records: number }[];
};

export type AnalyticsDashboardData = {
  spendHistory: SpendHistory;
  analytics: Analytics;
  departments: Department[];
  tools: Tool[];
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
