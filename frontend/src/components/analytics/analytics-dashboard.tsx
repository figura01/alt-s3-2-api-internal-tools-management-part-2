"use client";

import { useMemo, useState } from "react";
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

  const filteredData = useMemo(() => {
    return filterAnalyticsDashboardData(data, department);
  }, [data, department]);

  return (
    <main className="space-y-6 p-6">
      <AnalyticsHeader
        range={range}
        onRangeChange={setRange}
        department={department}
        onDepartmentChange={setDepartment}
        departments={data.departments}
        onExport={() => {
          try {
            downloadAnalyticsCsv(filteredData, { department, range, currency });
          } catch {
            toast.error("Unable to export Analytics. Please try again.");
          }
        }}
      />

      <AnalyticsKpiCards data={filteredData} />
      <CostAnalyticsSection data={filteredData} range={range} />
      <UsageAnalyticsSection data={filteredData} />
      <InsightsSection data={filteredData} />
    </main>
  );
}
