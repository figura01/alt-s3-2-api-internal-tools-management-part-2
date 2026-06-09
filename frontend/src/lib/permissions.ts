import { type AuthUser, userRole } from "@/types/auth";

export function canCreateTool(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}

export function canEditTool(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}

export function canDeleteTool(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}

export function canViewAnalytics(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN || user?.role === userRole.USER;
}

export function canAccessSettings(user?: AuthUser | null) {
  return user?.role === userRole.ADMIN;
}
