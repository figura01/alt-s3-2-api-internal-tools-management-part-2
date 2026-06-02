"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useAppStore } from "@/store/store";

export function useSyncStoreWithUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasHydrated = useRef(false);

  const q = useAppStore((state) => state.q);
  const status = useAppStore((state) => state.status);
  const category = useAppStore((state) => state.category);
  const department = useAppStore((state) => state.department);
  const page = useAppStore((state) => state.page);
  const pageSize = useAppStore((state) => state.pageSize);
  const sort = useAppStore((state) => state.sort);
  const order = useAppStore((state) => state.order);
  const hydrateFromUrl = useAppStore((state) => state.hydrateFromUrl);

  useEffect(() => {
    if (hasHydrated.current) return;

    hydrateFromUrl(new URLSearchParams(searchParams.toString()));
    hasHydrated.current = true;
  }, [searchParams, hydrateFromUrl]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    if (pathname !== "/tools") return;

    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    if (department !== "all") params.set("department", department);
    if (category !== "all") params.set("category", category);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("pageSize", String(pageSize));

    if (sort) {
      params.set("sort", sort);
      params.set("order", order);
    }

    const url = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    window.history.pushState(null, "", url);
  }, [pathname, q, status, department, category, page, pageSize, sort, order]);
}
