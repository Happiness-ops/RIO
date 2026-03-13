import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { AiNudgeProcessor,        AI_NUDGE_QUEUE }           from './ai-nudge/ai-nudge.processor';
import { GeminiService }                                      from './ai-nudge/gemini.service';
import { MidnightSweepProcessor,  MIDNIGHT_SWEEP_QUEUE }     from './midnight-sweep/midnight-sweep.processor';
import { DataErasureProcessor,    DATA_ERASURE_QUEUE }        from './data-erasure/data-erasure.processor';
import { HeartbeatCleanupProcessor, HEARTBEAT_CLEANUP_QUEUE } from './heartbeat-cleanup/heartbeat-cleanup.processor';
import { NotificationsModule }                                from '@/notifications/notifications.module';

const QUEUE_CONFIG = {
  defaultJobOptions: {
    attempts:        3,
    backoff:         { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail:    { count: 500 },
  },
};

@Module({
  imports: [
    NotificationsModule, // Provides WebPushService to processors
    BullModule.registerQueue(
      { name: AI_NUDGE_QUEUE,           ...QUEUE_CONFIG },
      { name: MIDNIGHT_SWEEP_QUEUE,     ...QUEUE_CONFIG },
      { name: DATA_ERASURE_QUEUE,       ...QUEUE_CONFIG },
      { name: HEARTBEAT_CLEANUP_QUEUE,  ...QUEUE_CONFIG },
    ),
  ],
  providers: [
    AiNudgeProcessor,
    GeminiService,
    MidnightSweepProcessor,
    DataErasureProcessor,
    HeartbeatCleanupProcessor,
  ],
  exports: [
    BullModule, // So UsersService can inject the DataErasure queue
  ],
})
export class WorkersModule implements OnModuleInit {
  private readonly logger = new Logger(WorkersModule.name);

  constructor(
    @InjectQueue(AI_NUDGE_QUEUE)          private aiNudgeQueue:         Queue,
    @InjectQueue(MIDNIGHT_SWEEP_QUEUE)    private midnightSweepQueue:   Queue,
    @InjectQueue(HEARTBEAT_CLEANUP_QUEUE) private heartbeatCleanupQueue: Queue,
  ) {}

  /**
   * Schedule recurring jobs on startup using upsertJobScheduler.
   * Idempotent — safe to run on every restart.
   */
  async onModuleInit() {
    // Every hour — processes users whose local time is 6AM
    await this.aiNudgeQueue.upsertJobScheduler(
      'ai-nudge-hourly',
      { every: 60 * 60 * 1000 },
      { name: 'run', data: {} },
    );

    // Every hour — processes users whose local time is midnight
    await this.midnightSweepQueue.upsertJobScheduler(
      'midnight-sweep-hourly',
      { every: 60 * 60 * 1000 },
      { name: 'run', data: {} },
    );

    // Every 10 minutes — counts active sessions
    await this.heartbeatCleanupQueue.upsertJobScheduler(
      'heartbeat-cleanup',
      { every: 10 * 60 * 1000 },
      { name: 'run', data: {} },
    );

    this.logger.log('Worker schedules registered');
  }
}