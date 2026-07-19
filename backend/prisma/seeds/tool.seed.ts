// prisma/seeds/tool.seed.ts

import type { PrismaClient, ToolStatus } from '@prisma/client';

import { toolsData } from '../data/tools.data';

export async function seedTools(
  prisma: PrismaClient,
  departmentMap: Map<string, string>,
  categoryMap: Map<string, string>,
): Promise<Map<string, string>> {
  console.log('🛠️ Seeding tools...');

  const toolMap = new Map<string, string>();

  for (const tool of toolsData) {
    const categoryId = categoryMap.get(tool.categorySlug);
    const ownerDepartmentId = departmentMap.get(tool.ownerDepartmentSlug);

    if (!categoryId) {
      throw new Error(
        `Category "${tool.categorySlug}" not found for tool "${tool.name}"`,
      );
    }

    if (!ownerDepartmentId) {
      throw new Error(
        `Department "${tool.ownerDepartmentSlug}" not found for tool "${tool.name}"`,
      );
    }

    const savedTool = await prisma.tool.upsert({
      where: {
        name: tool.name,
      },
      update: {
        description: tool.description,
        vendor: tool.vendor,

        categoryId,
        ownerDepartmentId,

        monthlyCost: tool.monthlyCost,
        previousMonthCost: tool.previousMonthCost,
        activeUsersCount: tool.activeUsersCount,

        status: tool.status as ToolStatus,

        websiteUrl: tool.websiteUrl,
        iconUrl: tool.iconUrl,
      },
      create: {
        name: tool.name,
        description: tool.description,
        vendor: tool.vendor,

        categoryId,
        ownerDepartmentId,

        monthlyCost: tool.monthlyCost,
        previousMonthCost: tool.previousMonthCost,
        activeUsersCount: tool.activeUsersCount,

        status: tool.status as ToolStatus,

        websiteUrl: tool.websiteUrl,
        iconUrl: tool.iconUrl,
      },
    });

    toolMap.set(savedTool.name, savedTool.id);
  }

  console.log(`✅ ${toolMap.size} tools seeded.`);

  return toolMap;
}
