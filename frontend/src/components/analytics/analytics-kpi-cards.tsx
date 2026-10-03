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
        title="Period Spend"
        value={analytics.period ? analytics.period.total : totalMonthlySpend}
        formatValue={formatAmount}
        subtitle={`/ ${formatAmount(analytics.period?.budget ?? monthlyLimit)} company budget`}
        description={analytics.period ? `${analytics.period.start.slice(0, 10)} – ${analytics.period.end.slice(0, 10)} · ${analytics.period.recorded_months}/${analytics.period.months} months recorded` : undefined}
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
        description="Period spend per unique active user"
      />

      <SingleCardKpi
        title="Unique Active Users"
        value={analytics.cost_analytics.active_users}
        formatValue={(active) => String(active)}
        badge={{
          label: analytics.period_usage ? `${analytics.period_usage.active_users_change > 0 ? "+" : ""}${analytics.period_usage.active_users_change} vs previous period` : "Logged sessions",
          className: "gradient-green",
        }}
        description={`${analytics.cost_analytics.cumulative_tool_users} tool-user pairs in the selected period (not unique users)`}
      />

      <SingleCardKpi
        title={analytics.period_usage ? "Spend Without Usage" : "Savings Potential"}
        value={analytics.period_usage ? analytics.period_usage.spend_without_usage : potentialSavings}
        formatValue={formatAmount}
        badge={{
          label: analytics.period_usage ? `${analytics.period_usage.tools_without_usage} without logged usage` : `${data.unusedTools.length} unused`,
          variant: "destructive",
        }}
        description={analytics.period_usage ? "Period costs for tools with no logged sessions; review before treating as savings" : "Current potential savings / month"}
      />
    </section>
  );
}
