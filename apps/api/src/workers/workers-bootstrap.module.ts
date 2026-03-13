import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { validate } from '@/app.config';
import { SharedModule } from '@/shared/shared.module';
import { WorkersModule } from './workers.module';

/**
 * WorkersBootstrapModule
 *
 * Minimal root module for the worker process.
 * Does NOT import HTTP controllers, guards, or any web-facing infrastructure.
 * Only what BullMQ processors need: Config, SharedModule (Prisma + Redis), WorkersModule.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),

    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL },
    }),

    SharedModule,
    WorkersModule,
  ],
})
export class WorkersBootstrapModule {}