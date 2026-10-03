import type { SpendHistory } from "@/types/analytics-dashboard";

export function getSpendEvolutionByRange(history: SpendHistory, range: string) {
  const months = range === "1y" ? 12 : range === "3m" ? 3 : 1;
  const [year, month] = history.endMonth.split("-").map(Number);
  return Array.from({ length: months }, (_, index) => {
    const label = new Date(Date.UTC(year, month - months + index, 1)).toISOString().slice(0, 7);
    const points = history.points.filter(point => point.month === label);
    return {
      label,
      spend: points.length ? points.reduce((sum, point) => sum + Math.round(point.spend * 100), 0) / 100 : null,
      records: points.reduce((sum, point) => sum + point.records, 0),
    };
  });
}

export function getSpendComparisonByRange(history: SpendHistory, range: string) {
  const current = getSpendEvolutionByRange(history, range);
  const months = current.length;
  const [year, month] = history.endMonth.split("-").map(Number);
  const previousEnd = new Date(Date.UTC(year, month - months - 1, 1)).toISOString().slice(0, 7);
  const previous = getSpendEvolutionByRange({ ...history, endMonth: previousEnd }, range);
  return current.map((point, index) => {
    const previousPoint = previous[index];
    const difference = point.spend !== null && previousPoint.spend !== null
      ? Math.round((point.spend - previousPoint.spend) * 100) / 100 : null;
    return {
      ...point,
      previousLabel: previousPoint.label,
      previousSpend: previousPoint.spend,
      previousRecords: previousPoint.records,
      difference,
      percentage: difference !== null && previousPoint.spend !== null && previousPoint.spend > 0
        ? difference / previousPoint.spend * 100 : null,
      partial: point.label === history.endMonth,
    };
  });
}

export type SpendComparisonPoint = ReturnType<typeof getSpendComparisonByRange>[number];

export function getPreviousPeriodLabel(range: string) {
  return range === "1y" ? "Previous year" : range === "3m" ? "Previous 3 months" : "Previous month";
}

export function formatSpendMonth(month: string, locale: string, includeYear = true) {
  return new Intl.DateTimeFormat(locale, { month: "short", ...(includeYear ? { year: "numeric" as const } : {}), timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));
}
