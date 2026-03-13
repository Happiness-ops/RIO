// ─────────────────────────────────────────────────────────────────────────────
// SharedModule
// @Global() — PrismaService and RedisService are available to every module
// in the application without needing to be imported individually.
//
// Import SharedModule once in AppModule. Never import it in domain modules.
// ─────────────────────────────────────────────────────────────────────────────

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [PrismaService, RedisService],
  exports:   [PrismaService, RedisService],
})
export class SharedModule {}