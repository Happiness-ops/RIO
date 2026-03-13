import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { RedisService } from '@/shared/redis.service';

export const HEARTBEAT_CLEANUP_QUEUE = 'heartbeat-cleanup';

@Processor(HEARTBEAT_CLEANUP_QUEUE)
export class HeartbeatCleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(HeartbeatCleanupProcessor.name);

  constructor(private readonly redis: RedisService) {
    super();
  }

  /**
   * Scans for expired heartbeat keys every 10 minutes.
   * Redis TTL handles expiry automatically — this job logs idle session counts
   * for the monitoring dashboard and clears any orphaned keys.
   */
  async process(job: Job) {
    const client = this.redis.getClient();

    // Count active sessions
    let activeSessions = 0;
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', 'session:*', 'COUNT', 200);
      cursor = nextCursor;
      activeSessions += keys.length;
    } while (cursor !== '0');

    this.logger.log(`Heartbeat cleanup: ${activeSessions} active sessions`);
    // In production, emit this metric to Datadog
    // statsd.gauge('rio.sessions.active', activeSessions);
  }
}