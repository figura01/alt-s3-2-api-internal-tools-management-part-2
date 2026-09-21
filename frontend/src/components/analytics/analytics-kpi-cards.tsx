"use client";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { SingleCardKpi } from "@/components/analytics/SingleCardKpi";
import { useAppStore } from "@/store/store";
import { formatPercentage, formatCurrency } from "@/utils/format";

type Props = {
  data: AnalyticsDashboardData;
};

export function AnalyticsKpiCards({ data }: Props) {
  const {
    analytics,
    totalMonthlySpend,
    monthlyLimit,
    potentialSavings,
  } = data;

  const locale = useAppStore((state) => state.locale);
  const currency = useAppStore((state) => state.currency);
  const formatAmount = (value: number | null) =>
    formatCurrency(value, locale, currency);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SingleCardKpi
        title="Budget Progress"
        value={totalMonthlySpend}
        formatValue={formatAmount}
        subtitle={`/ ${formatAmount(monthlyLimit)} company limit`}
        badge={{
          label: formatPercentage(
            analytics.kpi_trends.budget_change,
            locale,
            true,
          ),
          className: "gradient-blue",
        }}
      />

      <SingleCardKpi
        title="Avg Cost / User"
        value={analytics.cost_analytics.cost_per_user}
        formatValue={formatAmount}
        badge={{
          label: formatCurrency(
            analytics.kpi_trends.cost_per_user_change,
            locale,
            currency,
            true,
          ),
          className: "gradient-pink",
        }}
        description="Unique users with logged sessions this month"
      />

      <SingleCardKpi
        title="Unique Active Users"
        value={{
          active: analytics.cost_analytics.active_users,
          total: analytics.cost_analytics.total_users,
        }}
        formatValue={({ active, total }) => `${active} / ${total}`}
        badge={{
          label: formatPercentage(
            analytics.cost_analytics.total_users > 0 ? analytics.cost_analytics.active_users / analytics.cost_analytics.total_users * 100 : null,
            locale,
            false,
          ),
          className: "gradient-green",
        }}
        description={`${analytics.cost_analytics.cumulative_tool_users} cumulative tool users (not unique)`}
      />

      <SingleCardKpi
        title="Savings Potential"
        value={potentialSavings}
        formatValue={formatAmount}
        badge={{
          label: `${data.unusedTools.length} unused`,
          variant: "destructive",
        }}
        description="Potential optimization savings"
      />
    </section>
  );
}
