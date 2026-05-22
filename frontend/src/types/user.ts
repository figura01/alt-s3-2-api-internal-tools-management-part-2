export type OutputUser = {
  id: number;
  name: string;
  email: string;
  department_id: number;
  role: string;
  active: boolean;
  joined_at: string;
};

export type InputUser = {
  name: string;
  email: string;
  department_id: number;
  role: string;
};
