"use client";
import type { TooltipContentProps } from "recharts";
import { useAppStore } from "@/store/store";
import { formatCurrency, formatPercentage } from "@/utils/format";
import type { getDepartmentYearComparison } from "@/utils/period-chart-data";
type Props = Partial<TooltipContentProps<number, string>> & { months: number };
export function DepartmentComparisonTooltip({ active, payload, months }: Props) {
  const locale = useAppStore(state => state.locale);
  const currency = useAppStore(state => state.currency);
  const row = payload?.[0]?.payload as ReturnType<typeof getDepartmentYearComparison>[number] | undefined;
  if (!active || !row) return null;
  return <div className="max-w-xs rounded-xl border border-border/60 bg-background/95 px-4 py-3 text-sm shadow-xl">
    <p className="font-medium">{row.name}</p>
    <p>Selected period: {formatCurrency(row.current, locale, currency)} · {row.current_recorded_months}/{months} months recorded</p>
    <p>Same period last year: {formatCurrency(row.previous, locale, currency)} · {row.previous_recorded_months}/{months} months recorded</p>
    <p className="mt-2 border-t border-border pt-2">Difference: {formatCurrency(row.difference, locale, currency, true)} · {formatPercentage(row.percentage, locale, true)}</p>
    <p className="mt-1 text-muted-foreground">Current month is partial; last year includes complete calendar months. Missing records remain —; differences require all months.</p>
  </div>;
}
