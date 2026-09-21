"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics.service";
import { toast } from "sonner";
import { useAppStore } from "@/store/store";
import { downloadAnalyticsCsv } from "@/utils/export-analytics";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { AnalyticsHeader } from "./analytics-header";
import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { CostAnalyticsSection } from "./cost-analytics-section";
import { UsageAnalyticsSection } from "./usage-analytics-section";
import { InsightsSection } from "./insights-section";
import { filterAnalyticsDashboardData } from "@/utils/filter-analytics-dashboard-data";

type Props = {
  data: AnalyticsDashboardData;
};

export function AnalyticsDashboard({ data }: Props) {
  const [range, setRange] = useState("3m");
  const [department, setDepartment] = useState("all");
  const currency = useAppStore((state) => state.currency);

  const scoped = useQuery({ queryKey: ["analytics-kpi", department], queryFn: () => getAnalytics(department), enabled: department !== "all" });
  const waiting = department !== "all" && !scoped.data;
  const filteredData = useMemo(() => {
    const filtered = filterAnalyticsDashboardData(data, department);
    const analytics = department === "all" ? data.analytics : scoped.data;
    return analytics ? { ...filtered, analytics, totalMonthlySpend: analytics.budget_overview.current_month_total, budgetUtilization: analytics.budget_overview.budget_utilization } : filtered;
  }, [data, department, scoped.data]);

  return (
    <main className="space-y-6 p-6">
      <AnalyticsHeader
        range={range}
        onRangeChange={setRange}
        department={department}
        onDepartmentChange={setDepartment}
        departments={data.departments}
        exportDisabled={waiting || scoped.isError}
        onExport={() => {
          try {
            downloadAnalyticsCsv(filteredData, { department, range, currency });
          } catch {
            toast.error("Unable to export Analytics. Please try again.");
          }
        }}
      />

      {waiting ? <p role={scoped.isError ? "alert" : "status"}>{scoped.isError ? <button onClick={() => scoped.refetch()}>Unable to load department indicators. Retry</button> : "Loading department indicators…"}</p> : <AnalyticsKpiCards data={filteredData} />}
      <p className="text-sm text-muted-foreground">Unique users: active accounts with recorded sessions this month, within the selected department and its tools. Cost per user compares this month so far with the previous full month. Budget limit is company-wide. Missing history is shown as —.</p>
      <CostAnalyticsSection data={filteredData} range={range} />
      <UsageAnalyticsSection data={filteredData} />
      <InsightsSection data={filteredData} />
    </main>
  );
}
