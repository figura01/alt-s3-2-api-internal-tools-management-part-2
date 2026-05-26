"use client";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AnalyticsKpiCards } from "@/components/analytics/analytics-kpi-cards";
import { CostAnalyticsSection } from "@/components/analytics/cost-analytics-section";
import { UsageAnalyticsSection } from "@/components/analytics/usage-analytics-section";
import { InsightsSection } from "@/components/analytics/insights-section";

type Props = {
  data: AnalyticsDashboardData;
};

export function AnalyticsDashboard({ data }: Props) {
  return (
    <main className="space-y-6 p-6">
      <AnalyticsHeader />
      <AnalyticsKpiCards data={data} />
      <CostAnalyticsSection data={data} />
      <UsageAnalyticsSection data={data} />
      <InsightsSection data={data} />
    </main>
  );
}
