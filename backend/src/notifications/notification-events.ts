import { randomUUID } from 'node:crypto';
import { Prisma, Tool } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MONTHLY_BUDGET } from '../common/budget';

// Serialize catalogue writes and alert evaluation across API instances.
export async function lockNotificationEvents(tx: Prisma.TransactionClient) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(23092301)`;
}

async function recipients(tx: Prisma.TransactionClient) {
  return tx.user.findMany({ where: { status: 'ACTIVE', role: { in: ['ADMIN', 'MANAGER'] } }, select: { id: true } });
}

export async function evaluateBudget(tx: Prisma.TransactionClient) {
  const total = await tx.tool.aggregate({ _sum: { monthlyCost: true } });
  const cost = Number(total._sum.monthlyCost ?? 0);
  if (cost < MONTHLY_BUDGET * 0.9) return;
  const [{ month }] = await tx.$queryRaw<{ month: string }[]>`SELECT to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM') AS month`;
  const users = await recipients(tx);
  for (const threshold of [90, 100]) {
    if (cost < MONTHLY_BUDGET * threshold / 100) continue;
    await tx.notification.createMany({ skipDuplicates: true, data: users.map(user => ({
      userId: user.id,
      type: threshold === 90 ? 'BUDGET_WARNING' as const : 'BUDGET_EXCEEDED' as const,
      eventKey: `budget:${month}:${threshold}`,
      title: threshold === 90 ? 'Monthly budget: 90% reached' : 'Monthly budget: limit reached',
      message: `Company catalogue costs reached ${cost.toFixed(2)} out of ${MONTHLY_BUDGET} for ${month} (UTC).`,
      href: '/analytics',
    })) });
  }
}

/** Mutation + resulting notifications commit or roll back together. */
export async function mutateTool<T extends Tool>(
  prisma: PrismaService,
  kind: 'create' | 'update' | 'delete',
  id: string | undefined,
  mutation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async tx => {
    await lockNotificationEvents(tx);
    const previous = kind === 'update' ? await tx.tool.findUnique({ where: { id } }) : null;
    const tool = await mutation(tx);
    if (kind === 'update' && previous && previous.status !== 'EXPIRING' && tool.status === 'EXPIRING') {
      const users = await recipients(tx);
      const eventKey = `tool-expiring:${tool.id}:${randomUUID()}`;
      await tx.notification.createMany({ data: users.map(user => ({
        userId: user.id, type: 'TOOL_EXPIRING' as const, eventKey,
        title: `Renewal required: ${tool.name}`.slice(0, 200),
        message: `${tool.name} has changed to Expiring. Review its renewal.`,
        href: `/tools/${encodeURIComponent(tool.id)}`,
      })), skipDuplicates: true });
    }
    await evaluateBudget(tx);
    return tool;
  }, { timeout: 15_000 });
}
