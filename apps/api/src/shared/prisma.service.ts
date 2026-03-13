// ─────────────────────────────────────────────────────────────────────────────
// PrismaService
// Wraps the Prisma Client. Connects on module init, disconnects on destroy.
// Provided globally via SharedModule — no module needs to import it separately.
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');

    // Log slow queries in development only
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore — Prisma event typing
      this.$on('query', (e: any) => {
        if (e.duration > 200) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }

    // Always log DB-level errors
    // @ts-ignore
    this.$on('error', (e: any) => {
      this.logger.error('Prisma error', e);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Utility: cleanly truncate all tables in test environment
  // Usage: await prismaService.cleanDatabase() in integration test beforeEach
  // ─────────────────────────────────────────────────────────────────────────
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase() must never run in production');
    }

    // Delete in reverse FK dependency order
    const tables = [
      'community_members',
      'communities',
      'users_push_subscriptions',
      'ai_insights',
      'tasks',
      'checkins',
      'streaks',
      'habits',
      'goals',
      'user_profiles',
      'users',
    ];

    for (const table of tables) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
    }
  }
}