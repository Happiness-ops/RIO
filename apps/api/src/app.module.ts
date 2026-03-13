import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

import { validate } from './app.config';
import { SharedModule } from './shared/shared.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Auth strategies — provided here so JwtAuthGuard can inject them
import { FirebaseStrategy } from './auth/strategies/firebase.strategy';
import { Auth0Strategy }    from './auth/strategies/auth0.strategy';

import { AuthModule }          from './auth/auth.module';
import { UsersModule }         from './users/users.module';
import { GoalsModule }         from './goals/goals.module';
import { HabitsModule }        from './habits/habits.module';
import { TasksModule }         from './tasks/tasks.module';
import { CheckinsModule }      from './checkins/checkins.module';
import { DashboardModule }     from './dashboard/dashboard.module';
import { InsightsModule }      from './insights/insights.module';
import { AnalyticsModule }     from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SessionsModule }      from './sessions/sessions.module';
import { WorkersModule }       from './workers/workers.module';
import { ScorecardModule }       from './scorecard/scorecard.module';
import { StreakRecoveryModule }   from './streak-recovery/streak-recovery.module';
import { HealthController }    from './health.controller';

@Module({
  imports: [
    // Config — loaded first, validates all env vars on startup
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    // Rate limiting — per-route limits configured in each controller
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 60 }, // 60 req/min global default
    ]),

    // BullMQ — Redis-backed job queue
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    }),

    // Global services (Prisma + Redis)
    SharedModule,

    // Domain modules
    AuthModule,
    UsersModule,
    GoalsModule,
    HabitsModule,
    TasksModule,
    CheckinsModule,
    DashboardModule,
    InsightsModule,
    AnalyticsModule,
    NotificationsModule,
    SessionsModule,
    WorkersModule,
    ScorecardModule,
    StreakRecoveryModule,
  ],
  controllers: [HealthController],
  providers: [
    // Auth strategies — injected into JwtAuthGuard
    FirebaseStrategy,
    Auth0Strategy,
    // Global exception filter — maps all errors to standard envelope
    { provide: APP_FILTER, useClass: HttpExceptionFilter },

    // Global rate limiting
    { provide: APP_GUARD, useClass: ThrottlerGuard },

    // Global JWT auth — skipped on @Public() routes
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR,  useClass: LoggingInterceptor },
  ],
})
export class AppModule {}