import type { AnalyticsDashboardData } from "@/types/analytics-dashboard";
import { getSpendEvolutionByRange } from "./analytics-range";

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
  add("Metadata", "Selected chart range", range);
  add("Metadata", "Data scope", "Current snapshot; selected range applies only to spend evolution, not to KPIs or tools.");
  add("Metadata", "Currency", `${currency} (display setting; no currency conversion)`);
  add("Metadata", "Historical data", "Spend evolution uses recorded monthly costs; automatic snapshots retain the first observed catalogue cost each month; blank means no records, not zero. Periods include the current month (possibly incomplete). Departments reflect current tool ownership. KPI trends use the selected department; unavailable values are blank.");
  add("Metadata", "User counts", "Unique active accounts with logged sessions this month on tools in the selected scope. Cumulative tool users are separate. Total users are active accounts in the selected department; budget limit remains company-wide.");

  const { cost_analytics: costs, kpi_trends: trends } = data.analytics;
  add("KPI", "Monthly spend", data.totalMonthlySpend, currency, department);
  add("KPI", "Monthly budget limit", data.monthlyLimit, currency, "Company");
  add("KPI", "Budget utilization", data.budgetUtilization, "%", department);
  add("KPI", "Average cost per user", costs.cost_per_user, currency, department);
  add("KPI", "Unique active users (month to date)", costs.active_users, "users", department);
  add("KPI", "Cumulative tool users", costs.cumulative_tool_users, "tool users", department);
  add("KPI", "Total users", costs.total_users, "users", department);
  add("KPI", "Potential monthly savings", data.potentialSavings, currency, department);
  add("KPI", "Unused tools", data.unusedTools.length, "tools", department);
  add("KPI", "Expiring tools", data.expiringTools.length, "tools", department);
  for (const [metric, value] of Object.entries(trends)) {
    add("KPI trends", metric, value, metric === "cost_per_user_change" ? currency : "%", department);
  }
  for (const item of data.departmentCosts) {
    add("Department costs", item.name, item.value, currency, item.name);
  }
  for (const point of getSpendEvolutionByRange(data.spendHistory, range)) {
    add("Spend evolution", point.label, point.spend ?? "", currency, department);
    add("Historical record count", point.label, point.records, "records", department);
  }
  for (const [section, tools] of [
    ["Tools", data.tools],
    ["Most expensive tools", data.topExpensiveTools],
    ["Unused tools", data.unusedTools],
    ["Expiring tools", data.expiringTools],
  ] as const) {
    for (const tool of tools) {
      rows.push([section, tool.name, tool.monthly_cost, currency, tool.owner_department,
        tool.category, tool.vendor ?? "", tool.status, tool.active_users_count, tool.id]);
    }
  }
  for (const [section, tools] of [
    ["Most used tools", data.mostUsedTools],
    ["Least used tools", data.leastUsedTools],
  ] as const) {
    for (const tool of tools) {
      rows.push([section, tool.name, tool.monthly_cost, currency, department, "", "", "", tool.users, tool.id ?? ""]);
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
