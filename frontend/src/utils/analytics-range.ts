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
