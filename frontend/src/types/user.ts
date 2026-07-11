export type OutputUser = {
  id: string;
  name: string;
  email: string;
  department_id: string;
  role: string;
  active: boolean;
  joined_at: string;
};

export type InputUser = {
  name: string;
  email: string;
  department_id: string;
  role: string;
};
