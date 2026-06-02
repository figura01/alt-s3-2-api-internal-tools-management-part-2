// src/store/store.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type SortOrder = "asc" | "desc";

type AppStore = {
  q: string;
  status: string;
  department: string;
  page: number;
  pageSize: number;
  sort: string | null;
  order: SortOrder;
  category: string;

  setQuery: (q: string) => void;
  setStatus: (status: string) => void;
  setDepartment: (department: string) => void;
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSorting: (sort: string | null, order?: SortOrder) => void;

  resetFilters: () => void;

  hydrateFromUrl: (params: URLSearchParams) => void;
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      q: "",
      status: "all",
      department: "all",
      category: "all",

      page: 1,
      pageSize: 10,

      sort: null,
      order: "asc",
      setCategory: (category) =>
        set(
          {
            category: category.toLowerCase(),
            page: 1,
          },
          false,
          "setCategory",
        ),

      setQuery: (q) =>
        set(
          {
            q,
            page: 1,
          },
          false,
          "setQuery",
        ),

      setStatus: (status) =>
        set(
          {
            status: status.toLowerCase(),
            page: 1,
          },
          false,
          "setStatus",
        ),

      setDepartment: (department) =>
        set(
          {
            department: department.toLowerCase(),
            page: 1,
          },
          false,
          "setDepartment",
        ),

      setPage: (page) =>
        set(
          {
            page,
          },
          false,
          "setPage",
        ),

      setPageSize: (pageSize) =>
        set(
          {
            pageSize,
            page: 1,
          },
          false,
          "setPageSize",
        ),

      setSorting: (sort, order = "asc") =>
        set(
          {
            sort,
            order,
            page: 1,
          },
          false,
          "setSorting",
        ),

      resetFilters: () =>
        set(
          {
            q: "",
            status: "all",
            department: "all",
            category: "all",

            page: 1,

            sort: null,
            order: "asc",
          },
          false,
          "resetFilters",
        ),

      hydrateFromUrl: (params) =>
        set(
          {
            q: params.get("q") ?? "",

            status: params.get("status")?.toLowerCase() ?? "all",

            department: params.get("department")?.toLowerCase() ?? "all",

            category: params.get("category")?.toLowerCase() ?? "all",

            page: Number(params.get("page") ?? 1),

            pageSize: Number(params.get("pageSize") ?? 10),

            sort: params.get("sort"),

            order: params.get("order") === "desc" ? "desc" : "asc",
          },
          false,
          "hydrateFromUrl",
        ),
    }),
    {
      name: "app-store",
      enabled: process.env.NODE_ENV === "development",
    },
  ),
);
