const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', source)(name => load(name.startsWith('@/') ? `src/${name.slice(2)}.ts` : path.resolve(path.dirname(file), `${name}.ts`)), module, module.exports);
  return module.exports;
}
const analytics = load('src/utils/analytics.ts');
const { filterAnalyticsDashboardData } = load('src/utils/filter-analytics-dashboard-data.ts');
const { buildAnalyticsCsv } = load('src/utils/export-analytics.ts');
const tools = [
  { id: '1', name: 'A', monthly_cost: 0.1, owner_department: 'IT', status: 'UNUSED', active_users_count: 0, category: 'Test' },
  { id: '2', name: 'B', monthly_cost: 0.2, owner_department: 'IT', status: 'UNUSED', active_users_count: 0, category: 'Test' },
  { id: '3', name: 'C', monthly_cost: 0.7, owner_department: 'Sales', status: 'ACTIVE', active_users_count: 1, category: 'Test' },
];
test('catalogue and savings totals use cents without floating point residue', () => {
  assert.equal(analytics.getTotalMonthlySpend(tools.slice(0, 2)), 0.3);
  assert.equal(analytics.getPotentialSavings(tools), 0.3);
  assert.deepEqual(analytics.getCostByDepartment(tools), [{ name: 'IT', value: 0.3 }, { name: 'Sales', value: 0.7 }]);
  assert.equal(analytics.getTotalMonthlySpend([]), 0);
  assert.equal(analytics.getAverageCostPerTool([]), 0);
});
test('department view and CSV agree on fractional costs and savings', () => {
  const data = { tools, monthlyLimit: 1, analytics: { cost_analytics: { cost_per_user: null, active_users: 0, cumulative_tool_users: 0, total_users: 0 }, kpi_trends: {} }, spendHistory: { endMonth: '2026-09', points: [] } };
  const filtered = filterAnalyticsDashboardData(data, 'IT');
  assert.equal(filtered.totalMonthlySpend, 0.3);
  assert.equal(filtered.budgetUtilization, 30);
  const csv = buildAnalyticsCsv(filtered, { department: 'IT', range: '3m', currency: 'EUR' });
  assert.ok(csv.includes('"KPI","Period spend",0.3,'));
  assert.ok(csv.includes('"KPI","Potential monthly savings",0.3,'));
  assert.ok(csv.includes('"Department costs","IT",0.3,'));
  assert.equal(filterAnalyticsDashboardData(data, 'Missing').totalMonthlySpend, 0);
  assert.equal(filterAnalyticsDashboardData(data, 'all'), data);
});

test('CSV uses period totals and budget instead of the current catalogue snapshot', () => {
  const data = { tools, monthlyLimit: 30000, analytics: { period: { start: '2026-07-01', end: '2026-09-10', months: 3, recorded_months: 3, total: 1200, budget: 90000 }, cost_analytics: { cost_per_user: 120, active_users: 10, cumulative_tool_users: 12, total_users: 15 }, kpi_trends: {} }, spendHistory: { endMonth: '2026-09', points: [] } };
  const filtered = filterAnalyticsDashboardData(data, 'IT');
  const csv = buildAnalyticsCsv(filtered, { department: 'IT', range: '3m', currency: 'EUR' });
  assert.ok(csv.includes('"KPI","Period spend",1200,'));
  assert.ok(csv.includes('"KPI","Period budget limit",90000,'));
  assert.ok(csv.includes('"KPI","Unique active users (selected period)",10,'));
  data.analytics.period.total = null;
  assert.ok(buildAnalyticsCsv(filtered, { department: 'IT', range: '3m', currency: 'EUR' }).includes('"KPI","Period spend","",'));
});

 test('CSV exports recorded costs without usage instead of current savings for period KPIs', () => {
  const data = { tools, monthlyLimit: 30000, analytics: { period_usage: { spend_without_usage: 42.5, tools_without_usage: 2 }, cost_analytics: { cost_per_user: 10, active_users: 3, cumulative_tool_users: 4, total_users: 5 }, kpi_trends: {} }, spendHistory: { endMonth: '2026-09', points: [] } };
  const csv = buildAnalyticsCsv(filterAnalyticsDashboardData(data, 'IT'), { department: 'IT', range: '3m', currency: 'EUR' });
  assert.ok(csv.includes('"KPI","Period spend without logged usage",42.5,'));
  assert.ok(csv.includes('"KPI","Tools without logged usage",2,'));
  assert.ok(!csv.includes('"KPI","Potential monthly savings"'));
});
