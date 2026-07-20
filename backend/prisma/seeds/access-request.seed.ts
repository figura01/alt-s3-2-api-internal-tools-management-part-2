import type { PrismaClient } from '@prisma/client';

import { RequestStatus } from '@prisma/client';
import { accessRequestsData } from '../data/access-requests.data';

export async function seedAccessRequests(
  prisma: PrismaClient,
  userMap: Map<string, string>,
  toolMap: Map<string, string>,
): Promise<number> {
  console.log('📨 Seeding access requests...');

  let count = 0;

  for (const request of accessRequestsData) {
    const userId = userMap.get(request.userEmail);
    const toolId = toolMap.get(request.toolName);

    const processedById = request.processedByEmail
      ? userMap.get(request.processedByEmail)
      : null;

    if (!userId) {
      throw new Error(`Unknown user "${request.userEmail}"`);
    }

    if (!toolId) {
      throw new Error(`Unknown tool "${request.toolName}"`);
    }

    if (request.processedByEmail && !processedById) {
      throw new Error(`Unknown processor "${request.processedByEmail}"`);
    }

    await prisma.accessRequest.create({
      data: {
        userId,
        toolId,

        status: request.status as RequestStatus,

        reason: request.reason,

        requestedAt: request.requestedAt,

        processedById,
        processedAt: request.processedAt,
      },
    });

    count++;
  }

  console.log(`✅ ${count} access requests seeded.`);

  return count;
}
