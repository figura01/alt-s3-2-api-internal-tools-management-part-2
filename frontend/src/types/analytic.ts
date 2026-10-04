export type BudgetOverview = {
  monthly_limit: number;
  current_month_total: number;
  previous_month_total: number | null;
  budget_utilization: number;
  trend_percentage: number | null;
};

export type KpiTrends = {
  budget_change: number | null;
  tools_change: number | null;
  departments_change: number | null;
  cost_per_user_change: number | null;
};

export type CostAnalytics = {
  cost_per_user: number | null;
  previous_cost_per_user: number | null;
  active_users: number;
  cumulative_tool_users: number;
  total_users: number;
};

export type PeriodBreakdown = {
  departments: { name: string; total: number; recorded_months: number }[];
  tools: { id: string; name: string; department: string; total: number | null; users: number; recorded_months: number }[];
};

export type Analytics = {
  period_breakdown?: PeriodBreakdown;
  period_usage?: { spend_without_usage: number | null; tools_without_usage: number; previous_spend_without_usage: number | null; active_users_change: number };
  period?: { start: string; end: string; months: number; recorded_months: number; total: number | null; budget: number };
  budget_overview: BudgetOverview;
  kpi_trends: KpiTrends;
  cost_analytics: CostAnalytics;
};

export type KpiAnalytics = Analytics;
