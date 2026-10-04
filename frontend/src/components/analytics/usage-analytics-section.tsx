"use client";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomProgress } from "@/components/ui/custom-progress";
import { EmptyState } from "@/components/empty-state";
import { getPeriodChartData } from "@/utils/period-chart-data";


type Props = {
  data: AnalyticsDashboardData;
};

export function UsageAnalyticsSection({ data }: Props) {
  const charts = getPeriodChartData(data.analytics);
  const mostUsedTools = charts.mostUsed;
  const leastUsedTools = charts.leastUsed;
  const maxUsers = Math.max(...mostUsedTools.map(tool => tool.users), 1);

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Tool User Counts</CardTitle>
          <p className="text-sm text-muted-foreground">Distinct users with logged sessions in the selected period. A user can appear on several tools.</p>
        </CardHeader>

        <CardContent className="space-y-5">
          {mostUsedTools.length > 0 ? (
            mostUsedTools.map((tool) => {
              const value = Math.round((tool.users / maxUsers) * 100);

              return (
                <div key={tool.id ?? tool.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{tool.name}</span>

                    <span className="text-muted-foreground">
                      {tool.users} users
                    </span>
                  </div>

                  <CustomProgress
                    value={value}
                    from="#3b82f6"
                    to="#8b5cf6"
                    className="h-3"
                  />
                </div>
              );
            })
          ) : (
            <EmptyState
              title="No adoption data"
              description="No logged sessions for this department and period."
            />
          )}
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Most / Least Used Tools</CardTitle>
          <p className="text-sm text-muted-foreground">Tools with recorded costs or usage during the selected period; ranked by distinct logged users.</p>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Most used
            </h3>

            {mostUsedTools.length > 0 ? (
              mostUsedTools.map((tool, index) => (
                <div
                  key={tool.id ?? tool.name}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-3"
                >
                  <div>
                    <p className="font-medium">{tool.name}</p>

                    <p className="text-xs text-muted-foreground">
                      #{index + 1} by period user count
                    </p>
                  </div>

                  <Badge className="gradient-blue text-white">
                    {tool.users}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState title="No most used tools" />
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Least used
            </h3>

            {leastUsedTools.length > 0 ? (
              leastUsedTools.map((tool, index) => (
                <div
                  key={tool.id ?? tool.name}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 p-3"
                >
                  <div>
                    <p className="font-medium">{tool.name}</p>

                    <p className="text-xs text-muted-foreground">
                      #{index + 1} low period user count
                    </p>
                  </div>

                  <Badge variant="destructive">{tool.users}</Badge>
                </div>
              ))
            ) : (
              <EmptyState title="No least used tools" />
            )}
          </div>
        </CardContent>
      </Card>


    </section>
  );
}
