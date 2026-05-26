"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: AnalyticsDashboardData;
};

export function InsightsSection({ data }: Props) {
  const lowAdoptionExpensiveTools = data.topExpensiveTools.filter(
    (tool) => tool.active_users_count < 10,
  );

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <Card className="glass-card rounded-2xl xl:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Insights Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-2">
          <InsightCard
            icon={<CircleDollarSign className="h-4 w-4" />}
            title="Savings opportunity"
            description={`${data.potentialSavings.toLocaleString()} € could be optimized from unused tools.`}
            badge={`${data.unusedTools.length} unused`}
            variant="pink"
          />

          <InsightCard
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Expiring subscriptions"
            description={`${data.expiringTools.length} tools require renewal attention.`}
            badge="Review"
            variant="orange"
          />

          <InsightCard
            icon={<Wrench className="h-4 w-4" />}
            title="Low adoption risk"
            description={`${data.leastUsedTools.length} tools have weaker adoption and should be reviewed.`}
            badge="Usage"
            variant="blue"
          />

          <InsightCard
            icon={<BarChart3 className="h-4 w-4" />}
            title="High cost / low usage"
            description={`${lowAdoptionExpensiveTools.length} expensive tools have less than 10 active users.`}
            badge="ROI"
            variant="green"
          />
        </CardContent>
      </Card>

      <Card className="glass-card rounded-2xl">
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button asChild className="w-full justify-between">
            <Link href="/tools">
              View tools catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full justify-between">
            <Link href="/">
              Back to dashboard KPIs
              <LayoutDashboard className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

type InsightCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  variant: "green" | "blue" | "orange" | "pink";
};

const badgeVariants = {
  green: "gradient-green text-white",
  blue: "gradient-blue text-white",
  orange: "gradient-orange text-white",
  pink: "gradient-pink text-white",
};

function InsightCard({
  icon,
  title,
  description,
  badge,
  variant,
}: InsightCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </div>

        <Badge className={badgeVariants[variant]}>{badge}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
