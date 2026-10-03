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
      tool: { findMany: jest.fn().mockResolvedValue([{ activeUsersCount: 7 }]) },
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
});
