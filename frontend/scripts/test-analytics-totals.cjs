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
  assert.ok(csv.includes('"KPI","Monthly spend",0.3,'));
  assert.ok(csv.includes('"KPI","Potential monthly savings",0.3,'));
  assert.ok(csv.includes('"Department costs","IT",0.3,'));
  assert.equal(filterAnalyticsDashboardData(data, 'Missing').totalMonthlySpend, 0);
  assert.equal(filterAnalyticsDashboardData(data, 'all'), data);
});
