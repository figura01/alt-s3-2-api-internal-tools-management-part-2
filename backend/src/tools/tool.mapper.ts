import type { Prisma } from '@prisma/client';
import type { ToolCreateResponse, ToolListItem } from './types/tool.types';

type ToolWithRelations = Prisma.ToolGetPayload<{
  include: { category: true; ownerDepartment: true };
}>;

/** Shared public fields; creation deliberately keeps its existing response shape. */
export function toToolCreateResponse(tool: ToolWithRelations): ToolCreateResponse {
  return {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    vendor: tool.vendor,
    category: tool.category.name,
    monthly_cost: Number(tool.monthlyCost),
    owner_department: tool.ownerDepartment.name,
    status: tool.status,
    website_url: tool.websiteUrl,
    icon_url: tool.iconUrl,
    active_users_count: tool.activeUsersCount,
    created_at: tool.createdAt,
  };
}

export function toToolResponse(tool: ToolWithRelations): ToolListItem {
  return {
    ...toToolCreateResponse(tool),
    previous_month_cost: tool.previousMonthCost !== null
      ? Number(tool.previousMonthCost) : null,
    updated_at: tool.updatedAt,
  };
}
