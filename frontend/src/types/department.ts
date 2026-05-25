export type Department = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ApiJsonDepartment = Partial<Department>;
