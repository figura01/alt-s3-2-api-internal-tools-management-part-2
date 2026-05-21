export type Tool = {
  id: number;
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: "active" | "unused" | "expiring";
  website_url: string;
  active_users_count: number;
  icon_url: string;
  created_at: string;
  updated_at: string;
};

export type ToolForTable = {
  id: number;
  name: string;
  icon_url: string;
  owner_department: string;
  users: number;
  monthly_cost: number;
  status: "active" | "unused" | "expiring";
};

export type InputTool = {
  name: string;
  description: string;
  vendor: string;
  website_url: string;
  category_id: number;
  monthly_cost: number;
  owner_department: string;
};

export type OutputTool = {
  id: number;
  name: string;
  description: string;
  vendor: string;
  website_url: string;
  category: string;
  monthly_cost: number;
  owner_department: string;
  status: string;
  active_users_count: number;
  created_at: string;
  updated_at: string;
};
