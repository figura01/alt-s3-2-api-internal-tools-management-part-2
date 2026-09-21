"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { authQueryKey } from "@/hooks/use-auth";
import {
  getManagedUsers,
  updateManagedUser,
  type ManagedUser,
} from "@/services/admin-users.service";

function UserRow({
  user,
  lastAdmin,
}: {
  user: ManagedUser;
  lastAdmin: boolean;
}) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateManagedUser,
    onSuccess: async () => {
      toast.success("User updated");
      await Promise.all([
        client.invalidateQueries({ queryKey: ["admin-users"] }),
        client.invalidateQueries({ queryKey: authQueryKey }),
      ]);
    },
  });
  const changed = role !== user.role || status !== user.status;
  const error =
    mutation.error instanceof ApiError && mutation.error.status === 409
      ? "At least one active administrator must remain."
      : "Unable to save changes. Please try again.";
  return (
    <tr className="border-b align-top">
      <td className="p-4">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </td>
      <td className="p-4">{user.department.name}</td>
      <td className="p-4">
        <select
          aria-label={`Role for ${user.email}`}
          className="rounded-md border bg-background p-2"
          value={role}
          disabled={mutation.isPending || lastAdmin}
          onChange={(e) => setRole(e.target.value as ManagedUser["role"])}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </td>
      <td className="p-4">
        <select
          aria-label={`Status for ${user.email}`}
          className="rounded-md border bg-background p-2"
          value={status}
          disabled={mutation.isPending || lastAdmin}
          onChange={(e) => setStatus(e.target.value as ManagedUser["status"])}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </td>
      <td className="p-4">
        <Button
          disabled={!changed || mutation.isPending || lastAdmin}
          onClick={() => mutation.mutate({ id: user.id, role, status })}
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </Button>
        {lastAdmin && (
          <p className="mt-2 text-xs text-muted-foreground">
            Last active administrator
          </p>
        )}
        {mutation.isError && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {error}
          </p>
        )}
      </td>
    </tr>
  );
}

export function UsersContent() {
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["admin-users"],
    queryFn: getManagedUsers,
    retry: false,
  });
  const activeAdmins = query.data?.filter(
    (u) => u.role === "ADMIN" && u.status === "ACTIVE",
  ).length;
  const users = query.data?.filter((u) =>
    `${u.name} ${u.email} ${u.department.name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-semibold">Users</h1>
        <p className="mt-2 text-muted-foreground">
          Manage roles and account access. Inactive accounts cannot sign in or
          access protected resources.
        </p>
      </div>
      <Input
        aria-label="Search users"
        placeholder="Search by name, email or department…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {query.isPending ? (
        <p role="status">Loading users…</p>
      ) : query.isError ? (
        <div role="alert">
          Unable to load users.{" "}
          <Button onClick={() => query.refetch()}>Retry</Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">User permissions</caption>
            <thead className="bg-muted">
              <tr>
                {["User", "Department", "Role", "Status", "Actions"].map(
                  (label) => (
                    <th key={label} scope="col" className="p-4">
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <UserRow
                  key={`${user.id}-${user.role}-${user.status}`}
                  user={user}
                  lastAdmin={
                    activeAdmins === 1 &&
                    user.role === "ADMIN" &&
                    user.status === "ACTIVE"
                  }
                />
              ))}
              {!users?.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
