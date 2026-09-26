import type { ComponentProps, ReactNode } from "react";
import { CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/kpis/kpi-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SingleCardKpiProps<TValue> = {
  title: string;
  value: TValue;
  formatValue: (value: TValue) => ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  badge: {
    label: ReactNode;
    variant?: ComponentProps<typeof Badge>["variant"];
    className?: string;
  };
  children?: ReactNode;
};

export function SingleCardKpi<TValue>({
  title,
  value,
  formatValue,
  subtitle,
  description,
  badge,
  children,
}: SingleCardKpiProps<TValue>) {
  const formattedValue = (
    <p className="text-3xl font-bold">{formatValue(value)}</p>
  );

  return (
    <KpiCard
      title={
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      }
    >
      <div className="flex flex-col items-start ">
        {subtitle != null ? (
          <div className="flex flex-row items-center">
            {formattedValue}
            <p className="mt-2 ml-1 text-sm text-muted-foreground">
              {subtitle}
            </p>
          </div>
        ) : (
          formattedValue
        )}
        <Badge
          variant={badge.variant}
          className={cn("text-white", badge.className)}
        >
          {badge.label}
        </Badge>
      </div>
      {description != null && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </KpiCard>
  );
}
