export type BudgetOverview = {
  monthly_limit: number;
  current_month_total: number;
  previous_month_total: number;
  budget_utilization: number;
  trend_percentage: number;
};

export type KpiTrends = {
  budget_change: number;
  tools_change: number;
  departments_change: number;
  cost_per_user_change: number;
};

export type CostAnalytics = {
  cost_per_user: number;
  previous_cost_per_user: number;
  active_users: number;
  total_users: number;
};

export type Analytics = {
  budget_overview: BudgetOverview;
  kpi_trends: KpiTrends;
  cost_analytics: CostAnalytics;
};

export type KpiAnalytics = Analytics;
