"use client";

import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import type { TooltipContentProps } from "recharts";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { useAppStore } from "@/store/store";

type Props = Partial<TooltipContentProps<ValueType, NameType>> & { unit?: "currency" | "percent" };

export function ChartTooltip({ active, payload, label, unit = "currency" }: Props) {
  const locale = useAppStore((state) => state.locale);
  const currency = useAppStore((state) => state.currency);
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      {label && <p className="mb-2 text-sm font-medium">{String(label)}</p>}

      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-6 text-sm"
          >
            <span className="text-muted-foreground">{String(entry.name)}</span>

            <span className="font-medium">
              {typeof entry.value === "number"
                ? unit === "percent" ? formatPercentage(entry.value, locale) : formatCurrency(entry.value, locale, currency)
                : String(entry.value ?? "N/A")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
