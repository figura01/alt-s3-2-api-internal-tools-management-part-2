"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EmptyState } from "@/components/empty-state";

import { ChartTooltip } from "@/components/charts/chart-tooltip";

import { getSpendComparisonByRange, getPreviousPeriodLabel, formatSpendMonth } from "@/utils/analytics-range";

import { SpendComparisonTooltip } from "./spend-comparison-tooltip";
import { useAppStore } from "@/store/store";

import { useIsMobile } from "@/hooks/use-is-mobile";

type Props = {
  data: AnalyticsDashboardData;
  range: string;
};

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function CostAnalyticsSection({ data, range }: Props) {
  const isMobile = useIsMobile();

  const locale = useAppStore((state) => state.locale);
  const spendEvolution = getSpendComparisonByRange(data.spendHistory, range);
  const previousName = getPreviousPeriodLabel(range);
  const periodCaption = (previous: boolean) => {
    const first = spendEvolution[0];
    const last = spendEvolution[spendEvolution.length - 1];
    const start = previous ? first.previousLabel : first.label;
    const end = previous ? last.previousLabel : last.label;
    return start === end ? formatSpendMonth(start, locale) : `${formatSpendMonth(start, locale)} – ${formatSpendMonth(end, locale)}`;
  };

  const topExpensiveTools = data.topExpensiveTools.map((tool) => ({
    name: tool.name,
    cost: tool.monthly_cost,
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Monthly Spend Evolution</CardTitle>
          <p className="text-sm text-muted-foreground">{periodCaption(false)} · comparison {periodCaption(true)}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Chart legend">
            <span className="flex items-center gap-2"><span aria-hidden="true" className="w-6 border-t-[3px] border-blue-500" />Selected period · current month partial</span>
            <span className="flex items-center gap-2"><span aria-hidden="true" className="w-6 border-t-[3px] border-dashed border-slate-400" />{previousName}</span>
          </div>
          <p className="text-sm text-muted-foreground">Recorded monthly costs; automatic snapshots use the first observed catalogue cost each month. Missing months remain empty. Current month may be incomplete. Departments reflect current tool ownership.</p>
        </CardHeader>

        <CardContent className="h-80">
          {spendEvolution.some(point => point.spend !== null || point.previousSpend !== null) ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendEvolution}>


                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis dataKey="label" tickFormatter={(month: string) => formatSpendMonth(month, locale, false)} />

                <YAxis />

                <Tooltip filterNull={false} content={<SpendComparisonTooltip previousName={previousName} />} />

                <Line
                  type="linear"
                  connectNulls={false}
                  dataKey="spend"
                  name="Selected period"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#3b82f6",
                  }}
                />
                <Line
                  type="linear"
                  connectNulls={false}
                  dataKey="previousSpend"
                  name={previousName}
                  stroke="#94a3b8"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#94a3b8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No spend data available"
              description="No recorded costs for this department and period. Try another filter."
            />
          )}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Department Cost Breakdown</CardTitle>
        </CardHeader>

        <CardContent className="h-80">
          {data.departmentCosts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentCosts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {data.departmentCosts.map((_, index) => (
                    <Cell
                      key={index}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No department data"
              description="No costs available for this department."
            />
          )}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl xl:col-span-2">
        <CardHeader>
          <CardTitle>Top Expensive Tools</CardTitle>
        </CardHeader>

        <CardContent className="h-80">
          {topExpensiveTools.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topExpensiveTools} layout="vertical">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ec4899" />

                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis type="number" />

                <YAxis
                  dataKey="name"
                  type="category"
                  width={isMobile ? 90 : 180}
                  tick={{
                    fontSize: isMobile ? 10 : 12,
                  }}
                />

                <Tooltip content={<ChartTooltip />} />

                <Bar
                  dataKey="cost"
                  fill="url(#barGradient)"
                  radius={[0, 12, 12, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No expensive tools"
              description="No tool cost data available."
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
