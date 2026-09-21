"use client";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/store";
import { canViewAnalytics } from "@/lib/permissions";
import { AccessGate } from "@/components/auth/access-gate";
import HeaderPage from "@/components/header-page";
// import SectionKPIs from "@/components/dashboard/kpis/section-kpis";
import KpiGrid from "@/components/kpis/kpi-grid";
import RecentsTools from "@/components/tools/table-recent-tools";
import { getRecentToolsForTable, getTools } from "@/services/tools.service";
import { getAnalytics } from "@/services/analytics.service";
import { getDepartments } from "@/services/departments.service";

import { Tool } from "@/types/tool";

function DashboardContent() {
  const user = useAppStore((state) => state.currentUser);
  const allowed = canViewAnalytics(user);
  const query = useQuery({ queryKey: ["dashboard", user?.id, allowed], queryFn: async () => {
    const [analytics, tools, departments, recentTools] = await Promise.all([
      allowed ? getAnalytics() : Promise.resolve(null), getTools(), getDepartments(), getRecentToolsForTable(),
    ]);
    return { analytics, tools, departments, recentTools };
  }});
  if (query.isPending) return <p role="status">Loading…</p>;
  if (query.isError) return <p role="alert">Unable to load the dashboard. <button onClick={() => query.refetch()}>Retry</button></p>;
  const { analytics, tools, departments, recentTools } = query.data;
  if (!analytics) return <div className="mx-auto max-w-7xl py-6"><HeaderPage title="Internal Tools Dashboard" subtitle="Your organization's software tools" /><RecentsTools tools={recentTools} /></div>;

  const activeToolsCount = tools.data.filter(
    (tool: Tool) => tool.status === "ACTIVE",
  ).length;

  const kpis = [
    {
      title: "Monthly Budget",
      value: analytics.budget_overview.current_month_total,
      suffix: `/ ${analytics.budget_overview.monthly_limit / 1000}k`,
      trend: analytics.kpi_trends.budget_change,
      trendFormat: "percentage",
      progress: analytics.budget_overview.budget_utilization,
      variant: "green",
      format: "currency",
    },
    {
      title: "Active Tools",
      value: activeToolsCount,
      trend: analytics.kpi_trends.tools_change,
      trendFormat: "number",
      variant: "blue",
      format: "number",
    },
    {
      title: "Departments",
      value: departments.length,
      trend: analytics.kpi_trends.departments_change,
      trendFormat: "number",
      variant: "orange",
      format: "number",
    },
    {
      title: "Cost per User",
      value: analytics.cost_analytics.cost_per_user,
      trend: analytics.kpi_trends.cost_per_user_change,
      trendFormat: "currency",
      variant: "pink",
      format: "currency",
    },
  ] as const;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <HeaderPage
        title="Internal Tools Dashboard"
        subtitle="Monitor and manage tour organization's software tools and expenses"
      />

      <KpiGrid kpis={kpis} />

      <section className="w-full max-w-7xl px-0 py-2">
        <RecentsTools tools={recentTools} />
      </section>
    </div>
  );
}

export default function Home() { return <AccessGate><DashboardContent /></AccessGate>; }
