import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { getDepartmentYearComparison, getPeriodChartData } from "./period-chart-data";
import { getSpendComparisonByRange } from "./analytics-range";

type ExportOptions = {
  department: string;
  range: string;
  currency: string;
  exportedAt?: Date;
};

type Cell = string | number | null;

function csvCell(value: Cell): string {
  if (value === null) return '""';
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  // Prevent user-controlled names from being interpreted as spreadsheet formulas.
  const safe = /^[\s\u0000-\u001f]*[=+@-]|^[\t\r\n]/.test(value)
    ? `'${value}`
    : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function buildAnalyticsCsv(
  data: AnalyticsDashboardData,
  { department, range, currency, exportedAt = new Date() }: ExportOptions,
): string {
  const rows: Cell[][] = [];
  const add = (section: string, metric: string, value: Cell, unit = "", scope = "") => {
    rows.push([section, metric, value, unit, scope, "", "", "", "", ""]);
  };
  rows.push(["Section", "Metric / Name", "Value", "Unit", "Scope / Department", "Category", "Vendor", "Status", "Active users", "Tool ID"]);
  add("Metadata", "Exported at (UTC)", exportedAt.toISOString());
  add("Metadata", "Department", department === "all" ? "All departments" : department);
  add("Metadata", "Selected period", range);
  add("Metadata", "Data scope", "KPI spending, unique active users and costs without logged usage follow the selected period. Chart costs and logged users follow the selected period. Catalogue and renewal information remain current snapshots.");
  add("Metadata", "Currency", `${currency} (display setting; no currency conversion)`);
  add("Metadata", "Historical data", "Spend evolution uses recorded monthly costs; automatic snapshots retain the first observed catalogue cost each month; blank means no records, not zero. Periods include the current month (possibly incomplete). Departments reflect current tool ownership. KPI trends use the selected department; unavailable values are blank.");
  add("Metadata", "User counts", "Unique active accounts with logged sessions in the selected period on tools in the selected scope. Cumulative tool users are separate. Total users are active accounts in the selected department; budget limit remains company-wide.");

  if (data.analytics.period) {
    add("Metadata", "Period start (UTC)", data.analytics.period.start);
    add("Metadata", "Period end (UTC)", data.analytics.period.end);
    add("Metadata", "Months with recorded costs", data.analytics.period.recorded_months);
    add("Metadata", "Period budget assumption", "Current monthly company budget multiplied by selected calendar months; current month is partial.");
  }
  const { cost_analytics: costs, kpi_trends: trends } = data.analytics;
  add("KPI", "Period spend", data.analytics.period ? data.analytics.period.total : data.totalMonthlySpend, currency, department);
  add("KPI", "Period budget limit", data.analytics.period?.budget ?? data.monthlyLimit, currency, "Company");
  add("KPI", "Budget utilization", data.analytics.period && data.analytics.period.total === null ? null : data.budgetUtilization, "%", department);
  add("KPI", "Average cost per user", costs.cost_per_user, currency, department);
  add("KPI", "Unique active users (selected period)", costs.active_users, "users", department);
  add("KPI", "Cumulative tool users", costs.cumulative_tool_users, "tool users", department);
  add("KPI", "Total users", costs.total_users, "users", department);
  if (data.analytics.period_usage) {
    add("KPI", "Period spend without logged usage", data.analytics.period_usage.spend_without_usage, currency, department);
    add("KPI", "Tools without logged usage", data.analytics.period_usage.tools_without_usage, "tools", department);
  } else {
    add("KPI", "Potential monthly savings", data.potentialSavings, currency, department);
    add("KPI", "Unused tools", data.unusedTools.length, "tools", department);
  }
  add("KPI", "Currently expiring tools", data.expiringTools.length, "tools", department);
  for (const [metric, value] of Object.entries(trends)) {
    add("KPI trends", metric, value, metric === "cost_per_user_change" ? currency : "%", department);
  }
  const charts = getPeriodChartData(data.analytics);
  for (const item of data.analytics.period ? charts.departments : data.departmentCosts) {
    add("Department costs", item.name, item.value, currency, item.name);
  }
  if (data.analytics.department_year_comparison) {
    add("Metadata", "Department N-1 start (UTC)", data.analytics.department_year_comparison.start);
    add("Metadata", "Department N-1 end exclusive (UTC)", data.analytics.department_year_comparison.end);
    add("Metadata", "Department comparison", "Same calendar months last year; current month partial, last year complete. Differences require all months recorded. Departments reflect current tool ownership.");
  }
  for (const item of getDepartmentYearComparison(data.analytics)) {
    add("Department selected period", item.name, item.current, currency, item.name);
    add("Department same period last year", item.name, item.previous, currency, item.name);
    add("Department year difference", item.name, item.difference, currency, item.name);
    add("Department year change", item.name, item.percentage, "%", item.name);
    add("Department current months recorded", item.name, item.current_recorded_months, "months", item.name);
    add("Department N-1 months recorded", item.name, item.previous_recorded_months, "months", item.name);
  }
  for (const point of getSpendComparisonByRange(data.spendHistory, range)) {
    add("Spend evolution", point.label, point.spend ?? "", currency, department);
    add("Historical record count", point.label, point.records, "records", department);
    add("Previous period spend", point.previousLabel, point.previousSpend, currency, department);
    add("Previous period record count", point.previousLabel, point.previousRecords, "records", department);
    add("Spend difference", `${point.label} vs ${point.previousLabel}`, point.difference, currency, department);
    add("Spend change", `${point.label} vs ${point.previousLabel}`, point.percentage, "%", department);
  }
  for (const [section, tools] of [
    ["Current catalogue", data.tools],
    ...(!data.analytics.period ? [["Most expensive tools", data.topExpensiveTools] as const] : []),
    ["Currently unused tools", data.unusedTools],
    ["Currently expiring tools", data.expiringTools],
  ] as const) {
    for (const tool of tools) {
      rows.push([section, tool.name, tool.monthly_cost, currency, tool.owner_department,
        tool.category, tool.vendor ?? "", tool.status, tool.active_users_count, tool.id]);
    }
  }
  if (data.analytics.period) {
    for (const item of charts.departmentShares) add("Department spend share", item.name, item.activity, "%", item.name);
    for (const [section, tools] of [
      ["Period tool costs and usage", data.analytics.period_breakdown?.tools ?? []],
      ["Most expensive tools (period)", charts.topExpensive],
      ["Most used tools (period)", charts.mostUsed],
      ["Least used tools (period)", charts.leastUsed],
    ] as const) {
      for (const tool of tools) {
        rows.push([section, tool.name, tool.total, currency, tool.department, "", "", "", tool.users, tool.id]);
      }
    }
  } else {
    for (const [section, tools] of [
      ["Most used tools", data.mostUsedTools],
      ["Least used tools", data.leastUsedTools],
    ] as const) {
      for (const tool of tools) rows.push([section, tool.name, tool.monthly_cost, currency, department, "", "", "", tool.users, tool.id ?? ""]);
    }
  }
  // UTF-8 BOM preserves accents when opened in Excel; CRLF follows CSV conventions.
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

export function downloadAnalyticsCsv(data: AnalyticsDashboardData, options: ExportOptions): void {
  const exportedAt = options.exportedAt ?? new Date();
  const csv = buildAnalyticsCsv(data, { ...options, exportedAt });
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  const department = options.department.replace(/[^a-z0-9_-]/gi, "-").slice(0, 60) || "department";
  link.download = `analytics-${department}-${options.range}-${exportedAt.toISOString().slice(0, 10)}.csv`;
  try {
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    // Allow the browser to start reading the blob before releasing its URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
