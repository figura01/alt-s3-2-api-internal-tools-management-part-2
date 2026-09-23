import { evaluateBudget, mutateTool } from './notification-events';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tool } from '@prisma/client';

describe('Notification events', () => {
  function fixture(cost = 0) {
    const tx = {
      $executeRaw: jest.fn(), $queryRaw: jest.fn().mockResolvedValue([{ month: '2026-09' }]),
      tool: { aggregate: jest.fn().mockResolvedValue({ _sum: { monthlyCost: cost } }), findUnique: jest.fn().mockResolvedValue({ status: 'ACTIVE' }) },
      user: { findMany: jest.fn().mockResolvedValue([{ id: 'admin' }, { id: 'manager' }]) },
      notification: { createMany: jest.fn() },
    };
    return tx;
  }
  it.each([0, 26999.99, 27000, 29999.99, 30000, 40000])('evaluates exact budget boundaries at %s', async cost => {
    const tx = fixture(cost);
    await evaluateBudget(tx as unknown as Prisma.TransactionClient);
    expect(tx.notification.createMany).toHaveBeenCalledTimes(cost < 27000 ? 0 : cost < 30000 ? 1 : 2);
    if (cost >= 27000) {
      expect(tx.user.findMany).toHaveBeenCalledWith({ where: { status: 'ACTIVE', role: { in: ['ADMIN', 'MANAGER'] } }, select: { id: true } });
      expect(tx.notification.createMany.mock.calls[0][0]).toMatchObject({ skipDuplicates: true, data: [{ userId: 'admin', eventKey: 'budget:2026-09:90', href: '/analytics' }, { userId: 'manager', eventKey: 'budget:2026-09:90' }] });
    }
  });
  it.each(['ACTIVE', 'EXPIRING'])('notifies only a transition from %s to EXPIRING', async status => {
    const tx = fixture(); tx.tool.findUnique.mockResolvedValue({ status });
    const prisma = { $transaction: (fn: (tx: unknown) => unknown) => fn(tx) };
    const mutation = jest.fn().mockResolvedValue({ id: 'tool', name: 'Tool', status: 'EXPIRING' } as Tool);
    await mutateTool(prisma as unknown as PrismaService, 'update', 'tool', mutation);
    expect(tx.notification.createMany).toHaveBeenCalledTimes(status === 'ACTIVE' ? 1 : 0);
    expect(tx.$executeRaw).toHaveBeenCalledTimes(1);
  });
  it('propagates notification failure so the transaction can roll back the mutation', async () => {
    const tx = fixture(30000); tx.notification.createMany.mockRejectedValue(new Error('write failed'));
    const prisma = { $transaction: (fn: (tx: unknown) => unknown) => fn(tx) };
    await expect(mutateTool(prisma as unknown as PrismaService, 'create', undefined, async () => ({ id: 'tool', status: 'ACTIVE' } as Tool))).rejects.toThrow('write failed');
  });
});
