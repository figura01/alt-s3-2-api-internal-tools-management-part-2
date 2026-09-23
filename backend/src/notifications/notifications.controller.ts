import { Controller, Get, Patch, Param, Query, Req } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { NotificationsService } from './notifications.service';

class ListNotificationsQuery {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;
}

@Controller('notifications')
@Roles('ADMIN', 'MANAGER', 'EMPLOYEE')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}
  @Get()
  list(@Req() req: Request & { user: JwtPayload }, @Query() query: ListNotificationsQuery) {
    return this.notifications.list(req.user.sub, query.offset);
  }
  @Patch('read-all')
  markAllRead(@Req() req: Request & { user: JwtPayload }) {
    return this.notifications.markAllRead(req.user.sub);
  }
  @Patch(':id/read')
  markRead(@Req() req: Request & { user: JwtPayload }, @Param('id') id: string) {
    return this.notifications.markRead(req.user.sub, id);
  }
}
