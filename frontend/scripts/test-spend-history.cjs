const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', source)(name => load(`src/utils/${name.replace('./', '')}.ts`), module, module.exports);
  return module.exports;
}
const { getSpendEvolutionByRange } = load('src/utils/analytics-range.ts');
const history = { endMonth: '2026-01', points: [
  { month: '2025-11', department: 'IT', spend: 0.1, records: 1 },
  { month: '2025-11', department: 'Sales', spend: 0.2, records: 1 },
  { month: '2026-01', department: 'IT', spend: 0, records: 1 },
] };
test('calendar range crosses years and distinguishes missing from zero', () => {
  assert.deepEqual(getSpendEvolutionByRange(history, '3m'), [
    { label: '2025-11', spend: 0.3, records: 2 },
    { label: '2025-12', spend: null, records: 0 },
    { label: '2026-01', spend: 0, records: 1 },
  ]);
  assert.equal(getSpendEvolutionByRange(history, '1y').length, 12);
  assert.equal(getSpendEvolutionByRange(history, '1m').length, 1);
});
test('department series uses only selected records', () => {
  const filtered = { ...history, points: history.points.filter(p => p.department === 'Sales') };
  assert.equal(getSpendEvolutionByRange(filtered, '3m')[0].spend, 0.2);
  assert.equal(getSpendEvolutionByRange(filtered, '3m')[2].spend, null);
});
test('CSV exports real history and blank missing values', () => {
  const { buildAnalyticsCsv } = load('src/utils/export-analytics.ts');
  const data = { spendHistory: history, analytics: { cost_analytics: { cost_per_user: 0, cumulative_tool_users: 0, active_users: 0, total_users: 0 }, kpi_trends: {} }, totalMonthlySpend: 0, monthlyLimit: 0, budgetUtilization: 0, potentialSavings: 0, unusedTools: [], expiringTools: [], departmentCosts: [], tools: [], topExpensiveTools: [], mostUsedTools: [], leastUsedTools: [] };
  const csv = buildAnalyticsCsv(data, { range: '3m', department: 'all', currency: 'EUR' });
  assert.ok(csv.includes('"Spend evolution","2025-11",0.3,'));
  assert.ok(csv.includes('"Spend evolution","2025-12","",'));
  assert.ok(csv.includes('"Spend evolution","2026-01",0,'));
  assert.ok(!csv.includes('illustrative'));
});

test('comparison pairs consecutive periods across years without replacing missing costs with zero', () => {
  const { getSpendComparisonByRange } = load('src/utils/analytics-range.ts');
  const data = { endMonth: '2026-01', points: [
    { month: '2025-08', department: 'IT', spend: 0.1, records: 1 },
    { month: '2025-08', department: 'IT', spend: 0.2, records: 1 },
    { month: '2025-10', department: 'IT', spend: 0, records: 1 },
    ...history.points,
  ] };
  const points = getSpendComparisonByRange(data, '3m');
  assert.equal(points[0].previousLabel, '2025-08');
  assert.equal(points[0].previousSpend, 0.3);
  assert.equal(points[0].difference, 0);
  assert.equal(points[1].previousSpend, null);
  assert.equal(points[1].difference, null);
  assert.equal(points[2].previousLabel, '2025-10');
  assert.equal(points[2].previousSpend, 0);
  assert.equal(points[2].percentage, null);
  assert.equal(points[2].partial, true);
  assert.equal(points[0].partial, false);
  assert.equal(getSpendComparisonByRange(data, '1m')[0].previousLabel, '2025-12');
  const year = getSpendComparisonByRange(data, '1y');
  assert.equal(year[0].label, '2025-02');
  assert.equal(year[0].previousLabel, '2024-02');
  assert.equal(year[11].previousLabel, '2025-01');
});

test('annual comparison respects the selected department and exports the preceding year', () => {
  const { getSpendComparisonByRange } = load('src/utils/analytics-range.ts');
  const { buildAnalyticsCsv } = load('src/utils/export-analytics.ts');
  const scoped = { endMonth: '2026-01', points: [
    { month: '2025-01', department: 'IT', spend: 10, records: 1 },
    { month: '2026-01', department: 'IT', spend: 15, records: 1 },
    { month: '2025-01', department: 'Sales', spend: 999, records: 1 },
  ].filter(point => point.department === 'IT') };
  const point = getSpendComparisonByRange(scoped, '1y').at(-1);
  assert.equal(point.previousSpend, 10);
  assert.equal(point.difference, 5);
  assert.equal(point.percentage, 50);
  const data = { spendHistory: scoped, analytics: { cost_analytics: { cost_per_user: 0, cumulative_tool_users: 0, active_users: 0, total_users: 0 }, kpi_trends: {} }, totalMonthlySpend: 0, monthlyLimit: 0, budgetUtilization: 0, potentialSavings: 0, unusedTools: [], expiringTools: [], departmentCosts: [], tools: [], topExpensiveTools: [], mostUsedTools: [], leastUsedTools: [] };
  const csv = buildAnalyticsCsv(data, { range: '1y', department: 'IT', currency: 'EUR' });
  assert.ok(csv.includes('"Previous period spend","2025-01",10,'));
  assert.ok(csv.includes('"Spend change","2026-01 vs 2025-01",50,'));
});
