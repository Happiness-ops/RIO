// ── sessions.service.ts ───────────────────────────────────────────────────────
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/shared/redis.service';

@Injectable()
export class SessionsService {
  constructor(private readonly redis: RedisService) {}

  /** Keep the session alive — resets the 10-minute Redis TTL */
  async heartbeat(userId: string, tabId: string) {
    await this.redis.setHeartbeat(userId, tabId, 600);
    return { alive: true, nextHeartbeatMs: 5 * 60 * 1000 };
  }

  /** Logout — blocklist the JWT so it's rejected on all future requests */
  async logout(userId: string, jti: string | undefined, exp: number) {
    if (jti) {
      const ttl = exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redis.blocklistJwt(jti, ttl);
      }
    }
    // Remove all active heartbeat keys for this user
    await this.redis.delPattern(`session:${userId}:*`);
  }
}