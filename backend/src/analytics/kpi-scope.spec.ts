import { AnalyticsService } from './analytics.service';

describe('KPI scope and unique users', () => {
  const prisma = { tool: { findMany: jest.fn() }, user: { count: jest.fn() }, costTracking: { findMany: jest.fn() } };
  const service = new AnalyticsService(prisma as never);
  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-09-21T12:00:00Z'));
    prisma.tool.findMany.mockResolvedValue([
      { id: 't1', monthlyCost: 100, activeUsersCount: 8, createdAt: new Date('2026-01-01') },
      { id: 't2', monthlyCost: 50, activeUsersCount: 7, createdAt: new Date('2026-01-01') },
    ]);
    prisma.user.count.mockResolvedValueOnce(10).mockResolvedValueOnce(5).mockResolvedValueOnce(4);
    prisma.costTracking.findMany.mockResolvedValue([{ toolId: 't1', cost: 80 }, { toolId: 't2', cost: 40 }]);
  });
  afterEach(() => jest.useRealTimers());
  it('uses department scope on costs, eligible accounts, logs and previous history', async () => {
    const result = await service.getAnalytics('Engineering');
    expect(result.budget_overview.previous_month_total).toBe(120);
    expect(result.kpi_trends.budget_change).toBe(25);
    expect(result.cost_analytics).toMatchObject({ active_users: 5, total_users: 10, cumulative_tool_users: 15, cost_per_user: 30, previous_cost_per_user: 30 });
    expect(result.kpi_trends.cost_per_user_change).toBe(0);
    expect(prisma.tool.findMany.mock.calls[0][0].where).toEqual({ ownerDepartment: { name: 'Engineering' } });
    const activeQuery = prisma.user.count.mock.calls[1][0].where;
    expect(activeQuery).toMatchObject({ status: 'ACTIVE', department: { name: 'Engineering' }, usageLogs: { some: { sessionCount: { gt: 0 }, tool: { ownerDepartment: { name: 'Engineering' } } } } });
    expect(activeQuery.usageLogs.some.usageDate.gte).toEqual(new Date('2026-09-01'));
    expect(prisma.costTracking.findMany.mock.calls[0][0].where.tool).toEqual({ ownerDepartment: { name: 'Engineering' } });
  });
  it('does not substitute current costs when historical coverage is incomplete', async () => {
    prisma.costTracking.findMany.mockResolvedValue([{ toolId: 't1', cost: 80 }]);
    const result = await service.getAnalytics();
    expect(result.budget_overview.previous_month_total).toBeNull();
    expect(result.kpi_trends.budget_change).toBeNull();
    expect(result.kpi_trends.cost_per_user_change).toBeNull();
  });
  it('does not divide by zero users or previous spend', async () => {
    prisma.user.count.mockReset().mockResolvedValue(0);
    prisma.costTracking.findMany.mockResolvedValue([{ toolId: 't1', cost: 0 }, { toolId: 't2', cost: 0 }]);
    const result = await service.getAnalytics();
    expect(result.cost_analytics.cost_per_user).toBeNull();
    expect(result.cost_analytics.previous_cost_per_user).toBeNull();
    expect(result.kpi_trends.budget_change).toBeNull();
  });
});
