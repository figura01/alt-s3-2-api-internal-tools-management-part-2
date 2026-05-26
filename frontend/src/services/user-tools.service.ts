// src/services/user-tools.service.ts

import { api } from "@/lib/api";
import type { UserTool } from "@/types/user-tool";

export async function getAllUserTools(): Promise<UserTool[]> {
  return api<UserTool[]>("/user_tools", {
    cache: "no-store",
  });
}
