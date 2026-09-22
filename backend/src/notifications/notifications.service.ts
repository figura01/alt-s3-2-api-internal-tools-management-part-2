import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, offset: number) {
    const [items, total, unreadCount] = await this.prisma.$transaction([
      this.prisma.notification.findMany({ where: { userId }, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: offset, take: 20 }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ], { isolationLevel: 'RepeatableRead' });
    return { items, total, unreadCount, nextOffset: offset + items.length < total ? offset + items.length : null };
  }

  async markRead(userId: string, id: string) {
    // Ownership is part of the write predicate; reading twice preserves readAt.
    const result = await this.prisma.notification.updateMany({ where: { id, userId, readAt: null }, data: { readAt: new Date() } });
    if (!result.count && !await this.prisma.notification.findFirst({ where: { id, userId }, select: { id: true } })) {
      throw new NotFoundException('Notification not found');
    }
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    return { success: true };
  }
}
