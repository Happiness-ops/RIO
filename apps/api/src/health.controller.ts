export {};
import { Controller, Get } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorator';
import { PrismaService } from '@/shared/prisma.service';
import { RedisService } from '@/shared/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis:  RedisService,
  ) {}

  /**
   * GET /v1/health
   * Public — used by hosting provider for health checks.
   * Returns 200 if database and Redis are reachable, 503 otherwise.
   */
  @Public()
  @Get()
  async check() {
    const checks = await Promise.allSettled([
      this.prisma.$queryRaw`SELECT 1`,
      this.redis.get('__health__'),
    ]);

    const db    = checks[0].status === 'fulfilled';
    const redis = checks[1].status === 'fulfilled';
    const ok    = db && redis;

    return {
      status:    ok ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services:  { database: db ? 'up' : 'down', redis: redis ? 'up' : 'down' },
    };
  }
}