// src/types/auth.ts

export const userRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof userRole)[keyof typeof userRole];

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
};

export function isAdmin(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}

export function isUser(user?: AuthUser | null) {
  return user?.role === userRole.USER;
}
