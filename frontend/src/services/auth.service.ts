import { api } from "@/lib/api";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  password: string;
  department: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
};

export type LoginResponse = {
  access_token: string;
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

export async function getCurrentUser(): Promise<AuthUser> {
  return api<AuthUser>("/auth/me");
}
