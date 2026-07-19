// prisma/seeds/user-tool-access.seed.ts

import type { AccessStatus, PrismaClient } from '@prisma/client';

import { userToolAccessesData } from '../data/user-tool-accesses.data';

export async function seedUserToolAccesses(
  prisma: PrismaClient,
  userMap: Map<string, string>,
  toolMap: Map<string, string>,
): Promise<number> {
  console.log('🔐 Seeding user tool accesses...');

  let seededCount = 0;

  for (const access of userToolAccessesData) {
    const userId = userMap.get(access.userEmail);
    const toolId = toolMap.get(access.toolName);
    const grantedById = userMap.get(access.grantedByEmail);

    if (!userId) {
      throw new Error(`User "${access.userEmail}" not found for tool access`);
    }

    if (!toolId) {
      throw new Error(
        `Tool "${access.toolName}" not found for user "${access.userEmail}"`,
      );
    }

    if (!grantedById) {
      throw new Error(`Granting user "${access.grantedByEmail}" not found`);
    }

    await prisma.userToolAccess.upsert({
      where: {
        userId_toolId: {
          userId,
          toolId,
        },
      },
      update: {
        grantedById,
        status: access.status as AccessStatus,
        grantedAt: access.grantedAt,
        revokedById: null,
        revokedAt: null,
      },
      create: {
        userId,
        toolId,
        grantedById,
        status: access.status as AccessStatus,
        grantedAt: access.grantedAt,
      },
    });

    seededCount += 1;
  }

  console.log(`✅ ${seededCount} user tool accesses seeded.`);

  return seededCount;
}
