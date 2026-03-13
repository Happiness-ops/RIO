import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { WebPushService } from './web-push.service';

@Module({
  controllers: [NotificationsController],
  providers:   [NotificationsService, WebPushService],
  exports:     [WebPushService], // Workers import this to deliver push notifications
})
export class NotificationsModule {}