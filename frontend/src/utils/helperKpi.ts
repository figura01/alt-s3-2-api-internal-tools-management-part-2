import type { Kpi } from "@/types/kpi";

export function formatKpiValue(kpi: Kpi): string {
  if (kpi.format === "currency") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(kpi.value);
  }

  return kpi.value.toLocaleString("fr-FR");
}

export function getTrendVariant(trend: string): "secondary" | "destructive" {
  return trend.startsWith("-") ? "destructive" : "secondary";
}
