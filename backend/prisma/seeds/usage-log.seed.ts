// prisma/seeds/usage-log.seed.ts

import type { PrismaClient } from '@prisma/client';

import { usageLogsData } from '../data/usage-logs.data';

export async function seedUsageLogs(
  prisma: PrismaClient,
  userMap: Map<string, string>,
  toolMap: Map<string, string>,
): Promise<number> {
  console.log('📊 Seeding usage logs...');

  let count = 0;

  for (const usageLog of usageLogsData) {
    const userId = userMap.get(usageLog.userEmail);
    const toolId = toolMap.get(usageLog.toolName);

    if (!userId) {
      throw new Error(`User "${usageLog.userEmail}" not found for usage log`);
    }

    if (!toolId) {
      throw new Error(
        `Tool "${usageLog.toolName}" not found for user "${usageLog.userEmail}"`,
      );
    }

    await prisma.usageLog.upsert({
      where: {
        userId_toolId_usageDate: {
          userId,
          toolId,
          usageDate: usageLog.usageDate,
        },
      },
      update: {
        sessionCount: usageLog.sessionCount,
        totalMinutes: usageLog.totalMinutes,
      },
      create: {
        userId,
        toolId,
        usageDate: usageLog.usageDate,
        sessionCount: usageLog.sessionCount,
        totalMinutes: usageLog.totalMinutes,
      },
    });

    count += 1;
  }

  console.log(`✅ ${count} usage logs seeded.`);

  return count;
}
