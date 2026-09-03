import HeaderPage from "@/components/header-page";
// import SectionKPIs from "@/components/dashboard/kpis/section-kpis";
import KpiGrid from "@/components/kpis/kpi-grid";
import RecentsTools from "@/components/tools/table-recent-tools";
import { getRecentToolsForTable, getTools } from "@/services/tools.service";
import { getAnalytics } from "@/services/analytics.service";
import { getDepartments } from "@/services/departments.service";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import { Tool } from "@/types/tool";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your organization's internal tools and expenses",
};

export default async function Home() {
  const [analytics, tools, departments, recentTools] = await Promise.all([
    getAnalytics(),
    getTools(),
    getDepartments(),
    getRecentToolsForTable(),
  ]);

  const activeToolsCount = tools.data.filter(
    (tool: Tool) => tool.status === "ACTIVE",
  ).length;

  const kpis = [
    {
      title: "Monthly Budget",
      value: analytics.budget_overview.current_month_total,
      suffix: `/ ${analytics.budget_overview.monthly_limit / 1000}k`,
      trend: analytics.kpi_trends.budget_change,
      progress: Number(analytics.budget_overview.budget_utilization),
      variant: "green",
      format: "currency",
    },
    {
      title: "Active Tools",
      value: activeToolsCount,
      trend: analytics.kpi_trends.tools_change,
      variant: "blue",
      format: "number",
    },
    {
      title: "Departments",
      value: departments.length,
      trend: analytics.kpi_trends.departments_change,
      variant: "orange",
      format: "number",
    },
    {
      title: "Cost per User",
      value: analytics.cost_analytics.cost_per_user,
      trend: analytics.kpi_trends.cost_per_user_change,
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
