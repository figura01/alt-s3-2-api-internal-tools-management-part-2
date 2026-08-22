export type ToolStatus = "ACTIVE" | "INACTIVE" | "EXPIRING" | "UNUSED";

export type Tool = {
  id?: string;
  name: string;
  description: string;
  vendor: string;
  category: string;
  owner_department: string;
  department: string;
  status: ToolStatus;
  website_url: string;
  icon_url: string;
  monthly_cost: number;
  previous_month_cost: number;
  active_users_count: number;
  created_at: string;
  updated_at: string;
  last_update: string;
};

export type ApiTool = Partial<{
  id: string | number;

  name: string;
  description: string | null;
  vendor: string | null;

  category: string;

  owner_department: string;
  department: string;

  status: string;

  website_url: string | null;
  icon_url: string | null;

  monthly_cost: number | string;
  previous_month_cost: number | string | null;
  active_users_count: number | string;

  created_at: string;
  updated_at: string;
  last_update: string;
}>;

export type ToolForTable = {
  id?: string;
  name: string;
  icon_url: string;
  owner_department: string;
  users: number | "N/A";
  monthly_cost: number;
  status: ToolStatus;
  last_update: string;
};

export type ToolsFiltersApplied = {
  query?: string;
  department?: string;
  status?: ToolStatus;
  min_cost?: number;
  max_cost?: number;
  category?: string;
};

export type ToolsApiResponse = {
  data: ApiTool[];
  total: number;
  filtered: number;
  page: number;
  limit: number;
  filters_applied: ToolsFiltersApplied;
};

export type ToolsResponse = {
  data: Tool[];
  total: number;
  filtered: number;
  page: number;
  limit: number;
  filters_applied: ToolsFiltersApplied;
};
