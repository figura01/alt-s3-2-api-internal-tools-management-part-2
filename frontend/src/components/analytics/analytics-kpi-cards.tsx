"use client";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomProgress } from "@/components/ui/custom-progress";
import { formatCurrency } from "@/utils/formatCurrency";
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

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Budget Progress
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">
                {formatCurrency(totalMonthlySpend)}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                / {formatCurrency(monthlyLimit)} limit
              </p>
            </div>

            <Badge className="gradient-blue text-white">
              {analytics.kpi_trends.budget_change}
            </Badge>
          </div>

          <CustomProgress
            value={budgetUtilization}
            label={`${budgetUtilization}%`}
            from="#3b82f6"
            to="#8b5cf6"
            className="mt-4 h-8"
          />
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Avg Cost / User
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">
              {formatCurrency(analytics.cost_analytics.cost_per_user)}
            </p>

            <Badge className="gradient-pink text-white">
              {analytics.kpi_trends.cost_per_user_change}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Based on active users
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Active Users
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">
              {analytics.cost_analytics.active_users}
              {" / "}
              {analytics.cost_analytics.total_users}
            </p>

            <Badge className="gradient-green text-white">
              {analytics.kpi_trends.tools_change}
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            SaaS adoption rate
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            Savings Potential
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold">
              {formatCurrency(potentialSavings)}
            </p>

            <Badge variant="destructive" className="text-white">
              {data.unusedTools.length} unused
            </Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Potential optimization savings
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
