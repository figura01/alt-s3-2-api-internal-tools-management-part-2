"use client";

import { useAppStore } from "@/store/store";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { Building2, TrendingUp, Users, Wrench } from "lucide-react";

import { KpiCard } from "./kpi-card";

import { CustomProgress } from "@/components/ui/custom-progress";
import { CustomBadge } from "@/components/ui/custom-badge";

import { gradients } from "@/lib/gradients";

type KpiVariant = "green" | "blue" | "orange" | "pink";

type Kpi = {
  title: string;
  value: number | null;
  suffix?: string;
  trend: number | null;
  format: "currency" | "number";
  trendFormat: "currency" | "percentage" | "number";
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

const styles: Record<KpiVariant, string> = {
  green: "gradient-green",
  blue: "gradient-blue",
  orange: "gradient-orange",
  pink: "gradient-pink",
};

export default function KpiGrid({ kpis }: Props) {
  const locale = useAppStore((state) => state.locale);
  const currency = useAppStore((state) => state.currency);
  return (
    <section className="w-full max-w-7xl grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = icons[kpi.variant];
        const trend =
          kpi.trend === null
            ? "—"
            : kpi.trendFormat === "currency"
              ? formatCurrency(kpi.trend, locale, currency, true)
              : kpi.trendFormat === "percentage"
                ? formatPercentage(kpi.trend, locale, true)
                : new Intl.NumberFormat(locale, {
                    signDisplay: "exceptZero",
                  }).format(kpi.trend);

        return (
          <KpiCard
            key={kpi.title}
            className="shadow-sm overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-xl"
            headerClassName="flex flex-row items-center justify-between space-y-0 pb-3"
            contentClassName="space-y-1"
            title={
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
              </div>
            }
            icon={
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white shadow-lg ${styles[kpi.variant]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            }
          >
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold tracking-tight">
                {kpi.format === "currency"
                  ? formatCurrency(kpi.value, locale, currency)
                  : kpi.value === null
                    ? "—"
                    : new Intl.NumberFormat(locale).format(kpi.value)}
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
                  label={formatPercentage(kpi.progress, locale)}
                  {...gradients[kpi.variant]}
                  className="h-5"
                />
              ) : (
                <CustomBadge angle={90} {...gradients[kpi.variant]}>
                  {trend}
                </CustomBadge>
              )}
            </div>
          </KpiCard>
        );
      })}
    </section>
  );
}
