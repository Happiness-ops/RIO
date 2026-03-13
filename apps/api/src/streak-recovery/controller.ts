// ── streak-recovery.controller.ts ─────────────────────────────────────────────
import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StreakRecoveryService } from './streak-recovery.service';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('habits')
export class StreakRecoveryController {
  constructor(private readonly recoveryService: StreakRecoveryService) {}

  /**
   * POST /v1/habits/:habitId/streak-recovery
   * Epic 6.2 — Use the weekly grace period to restore a recently reset streak.
   * Limited to once per week per user. Strictly rate-limited.
   */
  @Post(':habitId/streak-recovery')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 7 * 24 * 60 * 60 * 1000, limit: 1 } }) // 1 per week
  async useRecovery(
    @CurrentUser() user: RequestUser,
    @Param('habitId') habitId: string,
  ) {
    const result = await this.recoveryService.useRecovery(user.dbUserId, habitId);
    return ok('Streak recovered', result);
  }
}