"use client";

import type { AuthUser } from "@/types/auth";
import { userRole } from "@/types/auth";

const mockUser: AuthUser = {
  id: "1",
  email: "admin@example.com",
  name: "Admin User",
  role: userRole.ADMIN,
};

export function useCurrentUser() {
  return {
    user: mockUser,
    isAuthenticated: true,
  };
}
