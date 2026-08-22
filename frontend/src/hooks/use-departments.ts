"use client";

import { useQuery } from "@tanstack/react-query";

import { getDepartments } from "@/services/departments.service";

export const departmentsQueryKey = ["departments"] as const;

export function useDepartments() {
  return useQuery({
    queryKey: departmentsQueryKey,
    queryFn: getDepartments,
  });
}
