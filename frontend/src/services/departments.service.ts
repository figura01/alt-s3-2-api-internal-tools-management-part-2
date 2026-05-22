import { api } from "@/lib/api";
import type { KpiDepartment } from "@/types/department";

export function getDepartments() {
  return api<KpiDepartment[]>("/departments", {
    cache: "no-store",
  });
}
