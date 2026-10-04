import { AnalyticsService } from './analytics.service';
import { KpiQueryDto } from './dto/kpi-query.dto';
import { validate } from 'class-validator';

describe('period analytics', () => {
  beforeEach(() => { jest.useFakeTimers(); jest.setSystemTime(new Date('2026-02-15T12:00:00Z')); });
  afterEach(() => jest.useRealTimers());
  function setup(months: string[]) {
    const prisma = {
      costTracking: { findMany: jest.fn().mockResolvedValue(months.map(month => ({ month: new Date(`${month}-01T00:00:00Z`), cost: 10.10, toolId: "tool-1" }))) },
      user: { count: jest.fn().mockResolvedValueOnce(2).mockResolvedValueOnce(1).mockResolvedValueOnce(5) },
      usageLog: { findMany: jest.fn().mockResolvedValue([]) },
      tool: { findMany: jest.fn().mockResolvedValue([{ id: "tool-1", name: "Tool 1", ownerDepartment: { name: "Engineering" } }, { id: "tool-2", name: "Tool 2", ownerDepartment: { name: "Engineering" } }]) },
    };
    return { prisma, service: new AnalyticsService(prisma as never) };
  }
  it('sums three calendar months across a year boundary and counts distinct accounts', async () => {
    const { service, prisma } = setup(['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02']);
    const result = await service.getAnalytics('Engineering', '3m');
    expect(result.period).toMatchObject({ total: 30.3, months: 3, recorded_months: 3, budget: 90000, start: '2025-12-01T00:00:00.000Z' });
    expect(result.cost_analytics.cost_per_user).toBe(15.15);
    expect(result.cost_analytics.active_users).toBe(2);
    expect(result.kpi_trends.budget_change).toBe(0);
    expect(prisma.user.count.mock.calls[0][0].where).toMatchObject({ department: { name: 'Engineering' }, usageLogs: { some: { usageDate: { gte: new Date('2025-12-01'), lt: new Date('2026-02-15T12:00:00Z') }, tool: { ownerDepartment: { name: 'Engineering' } } } } });
  });
  it('does not invent comparisons or a per-user cost for missing months', async () => {
    const { service } = setup(['2026-02']);
    const result = await service.getAnalytics(undefined, '3m');
    expect(result.period).toMatchObject({ total: 10.1, recorded_months: 1 });
    expect(result.kpi_trends.budget_change).toBeNull();
    expect(result.cost_analytics.cost_per_user).toBeNull();
  });
  it('uses twelve months and no fabricated zero when there is no history', async () => {
    const { service } = setup([]);
    const result = await service.getAnalytics(undefined, '1y');
    expect(result.period).toMatchObject({ total: null, months: 12, budget: 360000, start: '2025-03-01T00:00:00.000Z' });
  });
  it('uses current-month records and handles no active users', async () => {
    const { service, prisma } = setup(['2026-01','2026-02']);
    prisma.user.count.mockReset().mockResolvedValue(0);
    const result = await service.getAnalytics(undefined, '1m');
    expect(result.period).toMatchObject({ total: 10.1, months: 1, budget: 30000 });
    expect(result.cost_analytics.cost_per_user).toBeNull();
  });
  it('rejects unsupported ranges', async () => {
    expect(await validate(Object.assign(new KpiQueryDto(), { range: '2y' }))).toHaveLength(1);
  });
  it('uses period sessions instead of catalogue counters and deduplicates tool-user pairs', async () => {
    const { service, prisma } = setup(['2025-09','2025-10','2025-11','2025-12','2026-01','2026-02']);
    prisma.usageLog.findMany.mockResolvedValue([
      { toolId: 'tool-1', userId: 'u1', usageDate: new Date('2025-10-10') },
      { toolId: 'tool-2', userId: 'u1', usageDate: new Date('2026-01-10') },
      { toolId: 'tool-2', userId: 'u1', usageDate: new Date('2026-01-11') },
      { toolId: 'tool-2', userId: 'u2', usageDate: new Date('2026-02-10') },
    ] as never);
    const result = await service.getAnalytics('Engineering', '3m');
    expect(result.cost_analytics.cumulative_tool_users).toBe(2);
    expect(result.period_usage).toMatchObject({ spend_without_usage: 30.3, tools_without_usage: 1, previous_spend_without_usage: 0 });
    expect(prisma.usageLog.findMany.mock.calls[0][0].where).toMatchObject({ sessionCount: { gt: 0 }, tool: { ownerDepartment: { name: 'Engineering' } } });
  });
  it('shows no cost without usage when the same tool has a session within the period', async () => {
    const { service, prisma } = setup(['2026-01','2026-02']);
    prisma.usageLog.findMany.mockResolvedValue([{ toolId: 'tool-1', userId: 'u1', usageDate: new Date('2026-02-10') }] as never);
    expect((await service.getAnalytics(undefined, '1m')).period_usage?.spend_without_usage).toBe(0);
    expect((await service.getAnalytics(undefined, '3m')).period_usage?.spend_without_usage).toBeNull();
  });
  it('groups period costs by tool and department and counts each logged user once per tool', async () => {
    const { service, prisma } = setup([]);
    prisma.tool.findMany.mockResolvedValue([
      { id: 'tool-1', name: 'A', ownerDepartment: { name: 'Engineering' } },
      { id: 'tool-2', name: 'B', ownerDepartment: { name: 'Sales' } },
      { id: 'tool-3', name: 'C', ownerDepartment: { name: 'Sales' } },
      { id: 'tool-4', name: 'New catalogue only', ownerDepartment: { name: 'Sales' } },
    ]);
    prisma.costTracking.findMany.mockResolvedValue([
      { month: new Date('2025-11-01'), cost: 999, toolId: 'tool-1' },
      { month: new Date('2025-12-01'), cost: 0.1, toolId: 'tool-1' },
      { month: new Date('2026-01-01'), cost: 0.2, toolId: 'tool-1' },
      { month: new Date('2026-02-01'), cost: 20, toolId: 'tool-2' },
    ]);
    prisma.usageLog.findMany.mockResolvedValue([
      { toolId: 'tool-1', userId: 'u1', usageDate: new Date('2025-11-10') },
      { toolId: 'tool-1', userId: 'u1', usageDate: new Date('2026-01-10') },
      { toolId: 'tool-1', userId: 'u1', usageDate: new Date('2026-02-10') },
      { toolId: 'tool-1', userId: 'u2', usageDate: new Date('2026-02-11') },
      { toolId: 'tool-3', userId: 'u2', usageDate: new Date('2026-02-11') },
    ] as never);
    const result = await service.getAnalytics(undefined, '3m');
    expect(result.period_breakdown).toEqual({
      departments: [{ name: 'Sales', total: 20, recorded_months: 1 }, { name: 'Engineering', total: 0.3, recorded_months: 2 }],
      tools: [
        { id: 'tool-1', name: 'A', department: 'Engineering', total: 0.3, users: 2, recorded_months: 2 },
        { id: 'tool-2', name: 'B', department: 'Sales', total: 20, users: 0, recorded_months: 1 },
        { id: 'tool-3', name: 'C', department: 'Sales', total: null, users: 1, recorded_months: 0 },
      ],
    });
    expect(result.period_breakdown!.departments.reduce((sum, item) => sum + item.total, 0)).toBe(result.period!.total);
  });
  it('keeps empty period breakdowns empty instead of substituting catalogue costs', async () => {
    const { service } = setup([]);
    expect((await service.getAnalytics(undefined, '1m')).period_breakdown).toEqual({ departments: [], tools: [] });
  });
  it('compares the same calendar months last year rather than the preceding quarter', async () => {
    const { service, prisma } = setup(['2024-12', '2025-01', '2025-02', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']);
    const result = await service.getAnalytics('Engineering', '3m');
    expect(prisma.costTracking.findMany.mock.calls[0][0].where.month.gte).toEqual(new Date('2024-12-01'));
    expect(result.department_year_comparison).toMatchObject({ start: '2024-12-01T00:00:00.000Z', end: '2025-03-01T00:00:00.000Z', departments: [{ name: 'Engineering', current: 30.3, previous: 30.3, previous_recorded_months: 3 }] });
    const missing = await setup(['2026-02']).service.getAnalytics(undefined, '1m');
    expect(missing.department_year_comparison!.departments[0].previous).toBeNull();
  });

});
