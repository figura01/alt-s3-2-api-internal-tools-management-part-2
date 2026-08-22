import { api } from "@/lib/api";

import type { Department } from "@/types/department";

export async function getDepartments(): Promise<Department[]> {
  return api<Department[]>("/departments", {
    cache: "no-store",
  });
}
