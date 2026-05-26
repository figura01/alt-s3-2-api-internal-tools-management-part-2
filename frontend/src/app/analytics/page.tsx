import type { Metadata } from "next";

import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { getAnalyticsDashboardData } from "@/services/analytics-dashboard.service";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsDashboardData();

  return <AnalyticsDashboard data={analyticsData} />;
}
