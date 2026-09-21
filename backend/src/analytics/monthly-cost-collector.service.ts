import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** First observed monthly catalogue cost, not a billing/consumption ledger. */
@Injectable()
export class MonthlyCostCollector implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(MonthlyCostCollector.name);
  private timer?: ReturnType<typeof setInterval>;
  private running = false;

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.collect();
    this.timer = setInterval(() => { void this.collect(); }, 60 * 60 * 1000);
    this.timer.unref();
  }

  onApplicationShutdown(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async collect(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      // One atomic statement: the database clock defines the month. The unique
      // (toolId, month) index handles concurrent API instances and restarts.
      // All statuses are included, matching the current dashboard budget scope.
      const count = await this.prisma.$executeRaw`
        INSERT INTO "cost_tracking" ("id", "tool_id", "month", "cost", "user_count", "cost_per_user", "created_at", "updated_at")
        SELECT
          'snapshot_' || t."id" || '_' || to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMM'),
          t."id",
          date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date,
          t."monthly_cost",
          t."active_users_count",
          CASE WHEN t."active_users_count" > 0
            THEN round(t."monthly_cost" / t."active_users_count", 2)
            ELSE 0 END,
          CURRENT_TIMESTAMP AT TIME ZONE 'UTC',
          CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
        FROM "tools" t
        ON CONFLICT ("tool_id", "month") DO NOTHING
      `;
      if (count > 0) this.logger.log(`Recorded ${count} monthly tool cost snapshots`);
    } catch (error) {
      this.logger.error('Monthly cost collection failed; will retry in one hour', error instanceof Error ? error.stack : undefined);
    } finally {
      this.running = false;
    }
  }
}
