import { Prisma } from '@prisma/client';
import { toToolCreateResponse, toToolResponse } from './tool.mapper';

const tool = {
  id: 'tool-1', name: 'Example', description: null, vendor: null,
  categoryId: 'category-1', ownerDepartmentId: 'department-1',
  category: { name: 'Development' }, ownerDepartment: { name: 'Engineering' },
  monthlyCost: new Prisma.Decimal('12.30'), previousMonthCost: null,
  activeUsersCount: 0, websiteUrl: null, iconUrl: null,
  status: 'ACTIVE', createdAt: new Date('2026-09-01'), updatedAt: new Date('2026-09-02'),
} as Parameters<typeof toToolResponse>[0];

const expected = {
  id: 'tool-1', name: 'Example', description: null, vendor: null,
  category: 'Development', owner_department: 'Engineering', monthly_cost: 12.3,
  active_users_count: 0, website_url: null, icon_url: null, status: 'ACTIVE',
  created_at: tool.createdAt,
};

describe('public tool response contract', () => {
  it('preserves the creation fields without leaking relation IDs or historical fields', () => {
    expect(toToolCreateResponse(tool)).toEqual(expected);
  });

  it('preserves null history, dates and zero users for list, detail and update', () => {
    expect(toToolResponse(tool)).toEqual({
      ...expected, previous_month_cost: null, updated_at: tool.updatedAt,
    });
  });

  it('converts decimal history including zero without treating it as missing', () => {
    for (const cost of ['0', '11.25']) {
      expect(toToolResponse({ ...tool, previousMonthCost: new Prisma.Decimal(cost) }).previous_month_cost)
        .toBe(Number(cost));
    }
  });
});
