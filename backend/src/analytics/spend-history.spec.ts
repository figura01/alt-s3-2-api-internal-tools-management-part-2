import { AnalyticsService } from './analytics.service';

describe('Recorded spend history', () => {
  const findMany = jest.fn();
  const service = new AnalyticsService({ costTracking: { findMany } } as never);
  beforeEach(() => { jest.useFakeTimers().setSystemTime(new Date('2026-01-15T12:00:00Z')); });
  afterEach(() => jest.useRealTimers());
  it('groups real costs by month and department, retaining zero costs', async () => {
    const row = (month: string, cost: string, department: string) => ({ month: new Date(month), cost, tool: { ownerDepartment: { name: department } } });
    findMany.mockResolvedValue([row('2025-12-01', '0.10', 'IT'), row('2025-12-15', '0.20', 'IT'), row('2025-12-01', '12.00', 'Sales'), row('2026-01-01', '0', 'IT')]);
    expect(await service.getSpendHistory()).toEqual({ endMonth: '2026-01', points: [
      { month: '2025-12', department: 'IT', spend: 0.3, records: 2 },
      { month: '2025-12', department: 'Sales', spend: 12, records: 1 },
      { month: '2026-01', department: 'IT', spend: 0, records: 1 },
    ] });
    expect(findMany.mock.calls.at(-1)[0].where).toEqual({ month: { gte: new Date('2025-02-01'), lt: new Date('2026-02-01') } });
  });
  it('never invents absent history', async () => {
    findMany.mockResolvedValue([]);
    expect(await service.getSpendHistory()).toEqual({ endMonth: '2026-01', points: [] });
  });
});
