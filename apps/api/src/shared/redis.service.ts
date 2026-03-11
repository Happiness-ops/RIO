// ─────────────────────────────────────────────────────────────────────────────
// RedisService
// Wraps ioredis. Provides get/set/del and the cache-aside getOrSet() helper.
// Also used by BullMQ (separately configured in workers.module.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('error',   (err) => this.logger.error('Redis error', err));
    this.client.on('close',   () => this.logger.warn('Redis connection closed'));
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis disconnected');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Core operations
  // ─────────────────────────────────────────────────────────────────────────

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cache-aside helper
  // Returns cached value if present. Otherwise calls fetcher(),
  // caches the result with the given TTL, and returns it.
  //
  // Usage:
  //   const dashboard = await redis.getOrSet(
  //     `dashboard:${userId}`,
  //     60,
  //     () => this.buildDashboard(userId),
  //   );
  // ─────────────────────────────────────────────────────────────────────────

  async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = await this.client.get(key);

    if (cached !== null) {
      return JSON.parse(cached) as T;
    }

    const data = await fetcher();
    await this.client.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    return data;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Pattern delete — removes all keys matching a glob pattern.
  // Use sparingly — SCAN is O(N) over the keyspace.
  // Prefer explicit key deletion where possible.
  //
  // Usage:
  //   await redis.delPattern(`analytics:overview:${userId}:*`);
  // ─────────────────────────────────────────────────────────────────────────

  async delPattern(pattern: string): Promise<void> {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await this.client.scan(
        cursor,
        'MATCH', pattern,
        'COUNT', 100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } while (cursor !== '0');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // JWT blocklist — used by SessionsService on logout
  // Stores the token's jti with a TTL matching the token's remaining lifetime.
  // Checked by JwtAuthGuard on every authenticated request.
  // ─────────────────────────────────────────────────────────────────────────

  async blocklistJwt(jti: string, ttlSeconds: number): Promise<void> {
    await this.client.set(`jwt:blocklist:${jti}`, '1', 'EX', ttlSeconds);
  }

  async isJwtBlocklisted(jti: string): Promise<boolean> {
    return this.exists(`jwt:blocklist:${jti}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Web session heartbeat — used by SessionsService
  // ─────────────────────────────────────────────────────────────────────────

  async setHeartbeat(userId: string, tabId: string, ttlSeconds = 600): Promise<void> {
    await this.client.set(
      `session:${userId}:${tabId}`,
      Date.now().toString(),
      'EX',
      ttlSeconds,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Expose raw client for BullMQ and advanced use cases
  // ─────────────────────────────────────────────────────────────────────────

  getClient(): Redis {
    return this.client;
  }
}