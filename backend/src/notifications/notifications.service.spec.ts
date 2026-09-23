import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationsService', () => {
  const notification = { updateMany: jest.fn(), findFirst: jest.fn(), findMany: jest.fn(), count: jest.fn() };
  const prisma = { notification, $transaction: jest.fn() };
  const service = new NotificationsService(prisma as unknown as PrismaService);
  beforeEach(() => jest.resetAllMocks());

  it('does not overwrite the timestamp of an already read owned notification', async () => {
    notification.updateMany.mockResolvedValue({ count: 0 });
    notification.findFirst.mockResolvedValue({ id: 'owned' });
    await expect(service.markRead('alice', 'owned')).resolves.toEqual({ success: true });
    expect(notification.updateMany).toHaveBeenCalledWith({ where: { id: 'owned', userId: 'alice', readAt: null }, data: { readAt: expect.any(Date) } });
  });
  it('returns the same not-found result for missing and foreign notifications', async () => {
    notification.updateMany.mockResolvedValue({ count: 0 });
    notification.findFirst.mockResolvedValue(null);
    await expect(service.markRead('alice', 'foreign')).rejects.toBeInstanceOf(NotFoundException);
    expect(notification.findFirst).toHaveBeenCalledWith({ where: { id: 'foreign', userId: 'alice' }, select: { id: true } });
  });
  it('marks only unread notifications belonging to the current account', async () => {
    notification.updateMany.mockResolvedValue({ count: 2 });
    await service.markAllRead('alice');
    expect(notification.updateMany).toHaveBeenCalledWith({ where: { userId: 'alice', readAt: null }, data: { readAt: expect.any(Date) } });
  });
});
