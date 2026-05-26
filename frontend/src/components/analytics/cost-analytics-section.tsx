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

import { getSpendEvolutionByRange } from "@/utils/analytics-range";

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

  const spendEvolution = getSpendEvolutionByRange(data.analytics, range);

  const topExpensiveTools = data.topExpensiveTools.map((tool) => ({
    name: tool.name,
    cost: tool.monthly_cost,
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Monthly Spend Evolution</CardTitle>
        </CardHeader>

        <CardContent className="h-80">
          {spendEvolution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendEvolution}>
                <defs>
                  <linearGradient
                    id="spendGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />

                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis dataKey="label" />

                <YAxis />

                <Tooltip content={<ChartTooltip />} />

                <Line
                  type="monotone"
                  dataKey="spend"
                  stroke="url(#spendGradient)"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#8b5cf6",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No spend data available"
              description="Try another time range."
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
