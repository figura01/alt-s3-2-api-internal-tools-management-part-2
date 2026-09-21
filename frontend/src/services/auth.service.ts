import type { AuthUser } from "@/types/auth";
export type { AuthUser } from "@/types/auth";
import { api } from "@/lib/api";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  departmentId: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export async function login(dto: LoginDto): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function register(dto: RegisterDto): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function getCurrentUser(signal?: AbortSignal): Promise<AuthUser> {
  return api<AuthUser>("/auth/me", { signal });
}

export type UpdateProfileDto = {
  firstName: string;
  lastName: string;
};

export function updateProfile(dto: UpdateProfileDto): Promise<AuthUser> {
  return api<AuthUser>("/auth/me", { method: "PATCH", body: JSON.stringify(dto) });
}

export function logout(): Promise<{ success: boolean }> {
  return api("/auth/logout", { method: "POST" });
}
