// src/types/auth.ts

export const userRole = {
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  MANAGER: "MANAGER",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  role: UserRole;
  department?: { id: string; name: string };
  status?: "ACTIVE" | "INACTIVE";
  hireDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export function isAdmin(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}

export function isUser(user?: AuthUser | null) {
  return user?.role === userRole.EMPLOYEE;
}
