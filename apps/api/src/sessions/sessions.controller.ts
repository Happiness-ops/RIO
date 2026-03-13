// ── sessions.controller.ts ────────────────────────────────────────────────────
import { Controller, Post, Delete, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SessionsService } from './sessions.service';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * POST /v1/sessions/heartbeat
   * Called every 5 minutes by the web app to keep the session alive.
   * X-Tab-ID header identifies the specific browser tab.
   */
  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60_000, limit: 5 } }) // Once per minute max
  async heartbeat(
    @CurrentUser() user: RequestUser,
    @Headers('x-tab-id') tabId: string,
  ) {
    const result = await this.sessionsService.heartbeat(user.dbUserId, tabId ?? 'unknown');
    return ok('Heartbeat received', result);
  }

  /**
   * DELETE /v1/sessions
   * Logs the user out by blocklisting their JWT.
   * Any subsequent request with the same token returns 401.
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: RequestUser) {
    await this.sessionsService.logout(user.dbUserId, user.jti, user.exp);
    return ok('Logged out successfully', null);
  }
}