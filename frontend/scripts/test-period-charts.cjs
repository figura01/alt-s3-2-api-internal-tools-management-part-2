const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', source)(name => load(path.resolve(path.dirname(file), `${name}.ts`)), module, module.exports);
  return module.exports;
}
const { getPeriodChartData } = load('src/utils/period-chart-data.ts');
const { buildAnalyticsCsv } = load('src/utils/export-analytics.ts');
const breakdown = {
  departments: [{ name: 'IT', total: 90, recorded_months: 3 }, { name: 'Sales', total: 30, recorded_months: 3 }],
  tools: [
    { id: 'a', name: 'A', department: 'IT', total: 90, users: 2, recorded_months: 3 },
    { id: 'b', name: 'B', department: 'Sales', total: 30, users: 0, recorded_months: 3 },
    { id: 'c', name: 'C', department: 'IT', total: null, users: 1, recorded_months: 0 },
  ],
};
test('chart shares use the same period totals, not current monthly prices', () => {
  const charts = getPeriodChartData({ period_breakdown: breakdown });
  assert.deepEqual(charts.departmentShares, [{ name: 'IT', activity: 75 }, { name: 'Sales', activity: 25 }]);
  assert.deepEqual(charts.topExpensive.map(tool => tool.id), ['a', 'b']);
  assert.deepEqual(charts.mostUsed.map(tool => tool.id), ['a', 'c']);
  assert.deepEqual(charts.leastUsed.map(tool => tool.id), ['b', 'c', 'a']);
  assert.equal(breakdown.tools[0].id, 'a');
});
test('changing the period changes rankings and department shares', () => {
  const charts = getPeriodChartData({ period_breakdown: {
    departments: [{ name: 'IT', total: 10, recorded_months: 1 }, { name: 'Sales', total: 30, recorded_months: 1 }],
    tools: breakdown.tools.map(tool => ({ ...tool, total: tool.id === 'a' ? 10 : tool.total, users: tool.id === 'b' ? 4 : 0 })),
  } });
  assert.equal(charts.topExpensive[0].id, 'b');
  assert.equal(charts.mostUsed[0].id, 'b');
  assert.equal(charts.departmentShares[0].activity, 25);
});
test('no recorded costs means no fabricated spend share or expensive ranking', () => {
  assert.deepEqual(getPeriodChartData({}).departmentShares, []);
  assert.deepEqual(getPeriodChartData({ period_breakdown: { departments: [{ name: 'IT', total: 0 }], tools: [{ id: 'free', name: 'Free', total: 0, users: 1 }] } }).topExpensive, []);
});
test('CSV period rankings and costs agree with charts and label current catalogue separately', () => {
  const data = {
    analytics: { period_breakdown: breakdown, period: { start: '2025-12-01', end: '2026-02-15', months: 3, recorded_months: 3, total: 120, budget: 90000 }, cost_analytics: { cost_per_user: 60, active_users: 2, total_users: 3, cumulative_tool_users: 3 }, kpi_trends: {} },
    spendHistory: { endMonth: '2026-02', points: [] }, monthlyLimit: 30000, budgetUtilization: 0, potentialSavings: 0, totalMonthlySpend: 120,
    tools: [{ id: 'a', name: 'A', monthly_cost: 999, owner_department: 'IT', category: 'Test', status: 'ACTIVE', active_users_count: 99 }],
    topExpensiveTools: [], mostUsedTools: [], leastUsedTools: [], unusedTools: [], expiringTools: [], departmentCosts: [{ name: 'IT', value: 999 }],
  };
  const csv = buildAnalyticsCsv(data, { department: 'all', range: '3m', currency: 'EUR' });
  assert.ok(csv.includes('"Department costs","IT",90,'));
  assert.ok(csv.includes('"Department spend share","IT",75,"%"'));
  assert.ok(csv.includes('"Most expensive tools (period)","A",90,"EUR","IT"'));
  assert.ok(csv.includes('"Period tool costs and usage","C","","EUR","IT"'));
  assert.ok(csv.includes('"Current catalogue","A",999,'));
  assert.ok(!csv.includes('"Most expensive tools (period)","A",999,'));
});
