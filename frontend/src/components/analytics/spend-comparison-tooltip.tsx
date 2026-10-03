"use client";

import type { TooltipContentProps } from "recharts";
import type { SpendComparisonPoint } from "@/utils/analytics-range";
import { formatSpendMonth } from "@/utils/analytics-range";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { useAppStore } from "@/store/store";

type Props = Partial<TooltipContentProps<number, string>> & { previousName: string };

export function SpendComparisonTooltip({ active, payload, previousName }: Props) {
  const locale = useAppStore((state) => state.locale);
  const currency = useAppStore((state) => state.currency);
  const point = payload?.[0]?.payload as SpendComparisonPoint | undefined;
  if (!active || !point) return null;
  return (
    <div className="max-w-xs rounded-xl border border-border/60 bg-background/95 px-4 py-3 text-sm shadow-xl">
      <p className="font-medium">Selected period · {formatSpendMonth(point.label, locale)}{point.partial ? " (partial)" : ""}</p>
      <p>{formatCurrency(point.spend, locale, currency)}</p>
      <p className="mt-2 font-medium">{previousName} · {formatSpendMonth(point.previousLabel, locale)}</p>
      <p>{formatCurrency(point.previousSpend, locale, currency)}</p>
      <p className="mt-2 border-t border-border pt-2">Difference: {formatCurrency(point.difference, locale, currency, true)} · {formatPercentage(point.percentage, locale, true)}</p>
      {point.partial && <p className="mt-1 text-muted-foreground">Current month is partial; previous month is complete.</p>}
      {(point.spend === null || point.previousSpend === null) && <p className="mt-1 text-muted-foreground">— means no recorded costs.</p>}
    </div>
  );
}
