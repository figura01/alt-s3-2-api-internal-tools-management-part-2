import { BudgetAlerts } from './budget-alerts.service';
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
@Module({ imports: [PrismaModule], controllers: [NotificationsController], providers: [NotificationsService, BudgetAlerts] })
export class NotificationsModule {}
