import { Controller, Post, Get, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { NotificationsService } from './notifications.service';
import { SubscribePushDto } from './dto/notifications.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('notifications/web-push')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** POST /v1/notifications/web-push/subscribe */
  @Post('subscribe')
  @Throttle({ default: { ttl: 5 * 60_000, limit: 5 } }) // 5 per 5 minutes
  async subscribe(@CurrentUser() user: RequestUser, @Body() dto: SubscribePushDto) {
    const result = await this.notificationsService.subscribe(user.dbUserId, dto);
    return ok('Push subscription registered', result);
  }

  /** GET /v1/notifications/web-push/status */
  @Get('status')
  async getStatus(@CurrentUser() user: RequestUser) {
    const status = await this.notificationsService.getStatus(user.dbUserId);
    return ok('Push status retrieved', status);
  }

  /** DELETE /v1/notifications/web-push/subscribe */
  @Delete('subscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@CurrentUser() user: RequestUser) {
    await this.notificationsService.unsubscribe(user.dbUserId);
    return ok('Push subscription removed', null);
  }
}