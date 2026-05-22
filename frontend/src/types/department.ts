export type OutputDepartment = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type InputDepartment = {
  name: string;
  description: string;
};

export type DepartmentWithTools = OutputDepartment & {
  tools: {
    id: number;
    name: string;
    icon_url: string;
    monthly_cost: number;
    status: "active" | "unused" | "expiring";
  }[];
};

export type KpiDepartment = {
  id: number;
  name: string;
};
