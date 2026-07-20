import type { PrismaClient } from '@prisma/client';

import { costTrackingsData } from '../data/cost-trackings.data';

export async function seedCostTrackings(
  prisma: PrismaClient,
  toolMap: Map<string, string>,
): Promise<number> {
  console.log('💰 Seeding cost trackings...');

  let count = 0;

  for (const tracking of costTrackingsData) {
    const toolId = toolMap.get(tracking.toolName);

    if (!toolId) {
      throw new Error(`Tool "${tracking.toolName}" not found.`);
    }

    await prisma.costTracking.upsert({
      where: {
        toolId_month: {
          toolId,
          month: tracking.month,
        },
      },
      update: {
        cost: tracking.cost,
        userCount: tracking.userCount,
        costPerUser: tracking.costPerUser,
      },
      create: {
        toolId,
        month: tracking.month,
        cost: tracking.cost,
        userCount: tracking.userCount,
        costPerUser: tracking.costPerUser,
      },
    });

    count++;
  }

  console.log(`✅ ${count} cost trackings seeded.`);

  return count;
}
