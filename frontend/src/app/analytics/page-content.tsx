"use client";
import { useQuery } from "@tanstack/react-query";
import { AccessGate } from "@/components/auth/access-gate";


import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { getAnalyticsDashboardData } from "@/services/analytics-dashboard.service";



function PageContent() {
  const query = useQuery({ queryKey: ["AnalyticsPage"], queryFn: () => getAnalyticsDashboardData() });
  if (query.isPending) return <p role="status">Loading…</p>;
  if (query.isError) return <p role="alert">Unable to load this page. <button onClick={() => query.refetch()}>Retry</button></p>;
  const analyticsData = query.data;

  return <AnalyticsDashboard data={analyticsData} />;
}

export default function AnalyticsPage() { return <AccessGate roles={["MANAGER", "ADMIN"]}><PageContent /></AccessGate>; }
