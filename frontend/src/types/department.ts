export type Department = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ApiJsonDepartment = Partial<Department>;
