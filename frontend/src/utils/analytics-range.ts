// src/utils/analytics-range.ts

import type { Analytics } from "@/types/analytics";

export function getSpendEvolutionByRange(analytics: Analytics, range: string) {
  const previous = analytics.budget_overview.previous_month_total;
  const current = analytics.budget_overview.current_month_total;

  if (range === "90d") {
    return [
      { label: "Month -2", spend: Math.round(previous * 0.94) },
      { label: "Previous", spend: previous },
      { label: "Current", spend: current },
    ];
  }

  if (range === "1y") {
    return [
      { label: "Jan", spend: Math.round(current * 0.72) },
      { label: "Mar", spend: Math.round(current * 0.78) },
      { label: "May", spend: Math.round(current * 0.84) },
      { label: "Jul", spend: Math.round(current * 0.9) },
      { label: "Sep", spend: Math.round(current * 0.96) },
      { label: "Now", spend: current },
    ];
  }

  return [
    { label: "Previous", spend: previous },
    { label: "Current", spend: current },
  ];
}
