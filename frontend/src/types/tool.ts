export type ToolStatus = "active" | "unused" | "expiring";

export type Tool = {
  id?: number;
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

export type ApiJsonTool = Partial<{
  id: number | string;
  name: string;
  description: string;
  vendor: string;
  category: string;
  owner_department: string;
  department: string;
  status: string;
  website_url: string;
  icon_url: string;
  monthly_cost: number | string;
  previous_month_cost: number | string;
  active_users_count: number | string;
  created_at: string;
  updated_at: string;
  last_update: string;
}>;

export type ToolForTable = {
  id?: number;
  name: string;
  icon_url: string;
  owner_department: string;
  users: number | "N/A";
  monthly_cost: number;
  status: ToolStatus;
  last_update: string;
};
