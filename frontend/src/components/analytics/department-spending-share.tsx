"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { getPeriodChartData } from "@/utils/period-chart-data";
import { AnalyticsInfo } from "./analytics-info";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function DepartmentSpendingShare({ data, height }: { data: AnalyticsDashboardData; height: number }) {
  const isMobile = useIsMobile();
  const departmentActivity = getPeriodChartData(data.analytics).departmentShares;
  return (
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3"><CardTitle>Department Share of Spending</CardTitle><AnalyticsInfo label="About Department Share of Spending">Share of total recorded spending within the selected period and department filter. Departments reflect current tool ownership. No share is calculated when total recorded spending is zero.</AnalyticsInfo></div>
          <p className="text-sm text-muted-foreground">Share of selected-period spending</p>
        </CardHeader>

        <CardContent style={{ height }}>
          {departmentActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentActivity} layout="vertical">
                <defs>
                  <linearGradient
                    id="departmentActivityGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#10b981" />

                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />

                <XAxis type="number" tickFormatter={(value: number) => `${value}%`} domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={isMobile ? 90 : 180} tick={{ fontSize: isMobile ? 10 : 12 }} />

                <Tooltip content={<ChartTooltip unit="percent" />} />

                <Bar
                  dataKey="activity"
                  name="Share of spending"
                  fill="url(#departmentActivityGradient)"
                  radius={[0, 12, 12, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="No department activity"
              description="No data available for this filter."
            />
          )}
        </CardContent>
      </Card>
  );
}
