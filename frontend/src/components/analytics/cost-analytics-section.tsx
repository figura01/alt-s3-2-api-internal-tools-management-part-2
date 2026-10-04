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

import { getDepartmentYearComparison, getPeriodChartData } from "@/utils/period-chart-data";

import { DepartmentComparisonTooltip } from "./department-comparison-tooltip";

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

  const charts = getPeriodChartData(data.analytics);
  const comparison = getDepartmentYearComparison(data.analytics);
  const yearPeriod = data.analytics.department_year_comparison;
  const departmentCosts = charts.departments.filter(item => item.value > 0);
  const topExpensiveTools = charts.topExpensive.map(tool => ({ name: tool.name, cost: tool.total }));

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
          <p className="text-sm text-muted-foreground">Recorded spending in the selected period · {periodCaption(false)}</p>
        </CardHeader>

        <CardContent className="h-80">
          {departmentCosts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentCosts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {departmentCosts.map((_, index) => (
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
              description="No positive recorded spending for this department and period."
            />
          )}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl xl:col-span-2">
        <CardHeader>
          <CardTitle>Department Spending · Year Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">{periodCaption(false)} · same calendar months last year{yearPeriod ? ` · ${formatSpendMonth(yearPeriod.start.slice(0, 7), locale)} – ${formatSpendMonth(new Date(new Date(yearPeriod.end).getTime() - 1).toISOString().slice(0, 7), locale)}` : ""}</p>
          <div className="flex flex-wrap gap-5 text-sm" aria-label="Department comparison legend">
            <span><span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded bg-blue-500" />Selected period</span>
            <span><span aria-hidden="true" className="mr-2 inline-block h-3 w-3 rounded bg-slate-400" />Same period last year</span>
          </div>
          <p className="text-sm text-muted-foreground">Recorded costs; current month partial, last year’s months complete. Missing history remains empty. Departments reflect current tool ownership.</p>
        </CardHeader>
        <CardContent style={{ height: Math.max(240, comparison.length * 80) }}>
          {comparison.length ? <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={isMobile ? 90 : 180} tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Tooltip filterNull={false} content={<DepartmentComparisonTooltip months={yearPeriod!.months} />} />
              <Bar dataKey="current" name="Selected period" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              <Bar dataKey="previous" name="Same period last year" fill="#94a3b8" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer> : <EmptyState title="No department comparison data" description="No recorded costs for these periods and department scope." />}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl xl:col-span-2">
        <CardHeader>
          <CardTitle>Top Expensive Tools</CardTitle>
          <p className="text-sm text-muted-foreground">Ranked by recorded spending in the selected period · {periodCaption(false)}</p>
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
                  name="Period spend"
                  fill="url(#barGradient)"
                  radius={[0, 12, 12, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No expensive tools"
              description="No positive recorded tool costs for this department and period."
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
