import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { evaluateBudget, lockNotificationEvents } from './notification-events';

@Injectable()
export class BudgetAlerts implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(BudgetAlerts.name);
  private timer?: ReturnType<typeof setInterval>;
  private running = false;
  constructor(private readonly prisma: PrismaService) {}
  async onApplicationBootstrap() {
    await this.check();
    this.timer = setInterval(() => { void this.check(); }, 60 * 60 * 1000);
    this.timer.unref();
  }
  onApplicationShutdown() { if (this.timer) clearInterval(this.timer); }
  async check() {
    if (this.running) return;
    this.running = true;
    try {
      await this.prisma.$transaction(async tx => { await lockNotificationEvents(tx); await evaluateBudget(tx); }, { timeout: 15_000 });
    } catch (error) {
      this.logger.error('Budget alerts failed; will retry in one hour', error instanceof Error ? error.stack : undefined);
    } finally { this.running = false; }
  }
}
