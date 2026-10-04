import type { Analytics } from "@/types/analytic";

export function getPeriodChartData(analytics: Analytics) {
  const tools = analytics.period_breakdown?.tools ?? [];
  const departments = analytics.period_breakdown?.departments ?? [];
  const total = departments.reduce((sum, item) => sum + Math.round(item.total * 100), 0) / 100;
  const byName = (a: typeof tools[number], b: typeof tools[number]) =>
    a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  return {
    departments: departments.map(item => ({ name: item.name, value: item.total })),
    departmentShares: total > 0 ? departments.filter(item => item.total > 0).map(item => ({ name: item.name, activity: item.total / total * 100 })) : [],
    topExpensive: tools.filter(tool => tool.total !== null && tool.total > 0)
      .sort((a, b) => b.total! - a.total! || byName(a, b)).slice(0, 5),
    mostUsed: [...tools].filter(tool => tool.users > 0).sort((a, b) => b.users - a.users || byName(a, b)).slice(0, 5),
    leastUsed: [...tools].sort((a, b) => a.users - b.users || byName(a, b)).slice(0, 5),
  };
}
