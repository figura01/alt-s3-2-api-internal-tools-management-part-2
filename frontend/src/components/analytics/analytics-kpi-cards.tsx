"use client";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { SingleCardKpi } from "@/components/analytics/SingleCardKpi";
import { CustomProgress } from "@/components/ui/custom-progress";
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
    budgetUtilization,
    potentialSavings,
  } = data;

  const locale = useAppStore((state) => state.locale);
  const currency = useAppStore((state) => state.currency);
  const formatAmount = (value: number) =>
    formatCurrency(value, locale, currency);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SingleCardKpi
        title="Budget Progress"
        value={totalMonthlySpend}
        formatValue={formatAmount}
        subtitle={`/ ${formatAmount(monthlyLimit)} limit`}
        badge={{
          label: formatPercentage(
            analytics.kpi_trends.budget_change,
            locale,
            true,
          ),
          className: "gradient-blue",
        }}
      >
        {/* <CustomProgress
          value={budgetUtilization}
          label={formatPercentage(budgetUtilization, locale)}
          from="#3b82f6"
          to="#8b5cf6"
          className="mt-4 h-8"
        /> */}
      </SingleCardKpi>

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
        description="Based on active users"
      />

      <SingleCardKpi
        title="Active Users"
        value={{
          active: analytics.cost_analytics.active_users,
          total: analytics.cost_analytics.total_users,
        }}
        formatValue={({ active, total }) => `${active} / ${total}`}
        badge={{
          label: formatPercentage(
            analytics.kpi_trends.tools_change,
            locale,
            true,
          ),
          className: "gradient-green",
        }}
        description="SaaS adoption rate"
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
