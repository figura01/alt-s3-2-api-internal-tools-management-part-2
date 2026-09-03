export type SortOrder = 'asc' | 'desc';

export type EfficiencyRating = 'excellent' | 'good' | 'average' | 'low';

export type VendorEfficiency = 'excellent' | 'good' | 'average' | 'poor';

export type WarningLevel = 'low' | 'medium' | 'high';

export type DepartmentCostItem = {
  department: string;
  total_cost: number;
  tools_count: number;
  total_users: number;
  average_cost_per_tool: number;
  cost_percentage: number;
};

export type DepartmentCostsResponse = {
  data: DepartmentCostItem[];
  summary: {
    total_company_cost: number;
    departments_count: number;
    most_expensive_department: string | null;
  };
};

export type ExpensiveToolItem = {
  id: string;
  name: string;
  monthly_cost: number;
  active_users_count: number;
  cost_per_user: number;
  department: string;
  vendor: string;
  efficiency_rating: EfficiencyRating;
};

export type ExpensiveToolsResponse = {
  data: ExpensiveToolItem[];
  analysis: {
    total_tools_analyzed: number;
    avg_cost_per_user_company: number;
    potential_savings_identified: number;
  };
};

export type CategoryAnalyticsItem = {
  category_name: string;
  tools_count: number;
  total_cost: number;
  total_users: number;
  percentage_of_budget: number;
  average_cost_per_user: number;
};

export type ToolsByCategoryResponse = {
  data: CategoryAnalyticsItem[];
  insights: {
    most_expensive_category: string | null;
    most_efficient_category: string | null;
  };
};

export type LowUsageToolItem = {
  id: string;
  name: string;
  monthly_cost: number;
  active_users_count: number;
  cost_per_user: number;
  department: string;
  vendor: string;
  warning_level: WarningLevel;
  potential_action: string;
};

export type LowUsageToolsResponse = {
  data: LowUsageToolItem[];
  savings_analysis: {
    total_underutilized_tools: number;
    potential_monthly_savings: number;
    potential_annual_savings: number;
  };
};

export type VendorSummaryItem = {
  vendor: string;
  tools_count: number;
  total_monthly_cost: number;
  total_users: number;
  departments: string;
  average_cost_per_user: number;
  vendor_efficiency: VendorEfficiency;
};

export type VendorSummaryResponse = {
  data: VendorSummaryItem[];
  vendor_insights: {
    most_expensive_vendor: string | null;
    most_efficient_vendor: string | null;
    single_tool_vendors: number;
  };
};

export type KpiAnalyticsResponse = {
  budget_overview: {
    monthly_limit: number;
    current_month_total: number;
    previous_month_total: number;
    budget_utilization: string;
    trend_percentage: string;
  };

  kpi_trends: {
    budget_change: string;
    tools_change: string;
    departments_change: string;
    cost_per_user_change: string;
  };

  cost_analytics: {
    cost_per_user: number;
    previous_cost_per_user: number;
    active_users: number;
    total_users: number;
  };
};
