"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics.service";
import { toast } from "sonner";
import { useAppStore } from "@/store/store";
import { downloadAnalyticsCsv } from "@/utils/export-analytics";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { AnalyticsInfo } from "./analytics-info";
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

  const scoped = useQuery({ queryKey: ["analytics-kpi", department, range], queryFn: () => getAnalytics(department, range) });
  const waiting = !scoped.data;
  const catalogueData = useMemo(() => filterAnalyticsDashboardData(data, department), [data, department]);
  const filteredData = useMemo(() => {
    const filtered = catalogueData;
    const analytics = scoped.data;
    return analytics ? { ...filtered, analytics, totalMonthlySpend: analytics.budget_overview.current_month_total, budgetUtilization: analytics.budget_overview.budget_utilization } : filtered;
  }, [catalogueData, scoped.data]);

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

      {waiting ? <p role={scoped.isError ? "alert" : "status"}>{scoped.isError ? <button onClick={() => scoped.refetch()}>Unable to load period indicators. Retry</button> : "Loading period indicators…"}</p> : <AnalyticsKpiCards data={filteredData} />}
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>Selected period · current month partial · — means unavailable</p>
        <AnalyticsInfo label="About Analytics data">Spending and unique active users follow the selected calendar months, including the current partial month. Trends compare with the preceding period of the same duration. Budget assumes the current monthly company limit for each month. The fourth KPI shows period spending on tools without logged usage, which is not a guaranteed saving. Charts use recorded period costs and distinct logged users; departments reflect current tool ownership. Renewal and savings insights describe the current catalogue. Missing history is shown as —.</AnalyticsInfo>
      </div>
      {!waiting && !scoped.isError && <>
        <CostAnalyticsSection data={filteredData} range={range} />
        <UsageAnalyticsSection data={filteredData} />
      </>}
      <InsightsSection data={catalogueData} />
    </main>
  );
}
