import { Building2, Euro, TrendingUp, Users, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { CustomProgress } from "@/components/ui/custom-progress";
import { CustomBadge } from "@/components/ui/custom-badge";

import { gradients } from "@/lib/gradients";

type KpiVariant = "green" | "blue" | "orange" | "pink";

type Kpi = {
  title: string;
  value: number;
  suffix?: string;
  trend: string;
  progress?: number;
  variant: KpiVariant;
};

type Props = {
  kpis: readonly Kpi[];
};

const icons = {
  green: TrendingUp,
  blue: Wrench,
  orange: Building2,
  pink: Users,
};

function renderBadge(kpi: Kpi) {
  return kpi.variant === "green" ? (
    <CustomBadge angle={90} {...gradients.green}>
      {kpi.trend}
    </CustomBadge>
  ) : kpi.variant === "pink" ? (
    <CustomBadge angle={90} {...gradients.pink}>
      {kpi.trend}
    </CustomBadge>
  ) : kpi.variant === "blue" ? (
    <CustomBadge angle={90} {...gradients.blue}>
      {kpi.trend}
    </CustomBadge>
  ) : kpi.variant === "orange" ? (
    <CustomBadge angle={90} {...gradients.orange}>
      {kpi.trend}
    </CustomBadge>
  ) : null;
}

function formatKpiValue(kpi: Kpi): string {
  if (kpi.title === "Budget" || kpi.title === "Cost per User") {
    return `€${kpi.value.toLocaleString()}`;
  }

  return kpi.value.toLocaleString();
}

export default function KpiGrid({ kpis }: Props) {
  return (
    <section className="w-full max-w-7xl grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = icons[kpi.variant];

        return (
          <Card
            key={kpi.title}
            className="glass-card shadow-sm overflow-hidden rounded-2xl border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white shadow-lg ${kpi.variant === "green" ? "gradient-green" : kpi.variant === "pink" ? "gradient-pink" : kpi.variant === "blue" ? "gradient-blue" : kpi.variant === "orange" ? "gradient-orange" : "gradient-red"}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>

            <CardContent className="space-y-1">
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold tracking-tight">
                  {formatKpiValue(kpi)}
                </p>

                {kpi.suffix && (
                  <span className="text-3xl font-bold text-muted-foreground">
                    {kpi.suffix}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                {kpi.progress !== undefined ? (
                  <CustomProgress
                    value={kpi.progress}
                    label={`+${kpi.progress}%`}
                    from={
                      kpi.variant === "green"
                        ? gradients.green.from
                        : kpi.variant === "pink"
                          ? gradients.pink.from
                          : kpi.variant === "blue"
                            ? gradients.blue.from
                            : kpi.variant === "orange"
                              ? gradients.orange.from
                              : "#000"
                    }
                    to={
                      kpi.variant === "green"
                        ? gradients.green.to
                        : kpi.variant === "pink"
                          ? gradients.pink.to
                          : kpi.variant === "blue"
                            ? gradients.blue.to
                            : kpi.variant === "orange"
                              ? gradients.orange.to
                              : "#000"
                    }
                    className="h-5"
                  />
                ) : (
                  renderBadge(kpi)
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
