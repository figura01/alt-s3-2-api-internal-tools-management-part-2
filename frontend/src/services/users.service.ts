import type { OutputUser, InputUser } from "@/types/user";
import { api } from "@/lib/api";

export async function getUsers() {
  return api<OutputUser[]>("/users");
}

export async function getUserById(id: number) {
  return api<OutputUser>(`/users/${id}`);
}

export async function createUser(user: InputUser) {
  return api<OutputUser>("/users", {
    method: "POST",

    body: JSON.stringify(user),
  });
}
