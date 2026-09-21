import { api } from "@/lib/api";
import type { UserRole } from "@/types/auth";

export type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "INACTIVE";
  department: { id: string; name: string };
};
export const getManagedUsers = () => api<ManagedUser[]>("/users");
export const updateManagedUser = (
  user: Pick<ManagedUser, "id" | "role" | "status">,
) =>
  api<ManagedUser>(`/users/${user.id}`, {
    method: "PATCH",
    body: JSON.stringify({ role: user.role, status: user.status }),
  });
