export type Department = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiJsonDepartment = Partial<Department>;
