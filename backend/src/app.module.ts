import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToolsModule } from './tools/tools.module';
import { LoggerModule } from 'nestjs-pino';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ToolsModule,
    UsersModule,
    NotificationsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]'],
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
    AnalyticsModule,
    PrismaModule,
    AuthModule,
    CategoriesModule,
    DepartmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
