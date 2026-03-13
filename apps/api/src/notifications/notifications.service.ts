// ── notifications.service.ts ──────────────────────────────────────────────────
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { SubscribePushDto } from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Upsert — if same endpoint already stored, update keys */
  async subscribe(userId: string, dto: SubscribePushDto) {
    const sub = await this.prisma.userPushSubscription.upsert({
      where:  { endpoint: dto.subscription.endpoint },
      create: {
        userId,
        endpoint: dto.subscription.endpoint,
        p256dh:   dto.subscription.keys.p256dh,
        auth:     dto.subscription.keys.auth,
      },
      update: {
        p256dh: dto.subscription.keys.p256dh,
        auth:   dto.subscription.keys.auth,
      },
    });
    return { subscriptionId: sub.id, isSubscribed: true, subscribedAt: sub.createdAt };
  }

  async getStatus(userId: string) {
    const sub = await this.prisma.userPushSubscription.findFirst({
      where:   { userId },
      orderBy: { createdAt: 'desc' },
    });
    return {
      isSubscribed:   !!sub,
      subscriptionId: sub?.id ?? null,
      subscribedAt:   sub?.createdAt ?? null,
    };
  }

  async unsubscribe(userId: string, endpoint?: string) {
    if (endpoint) {
      await this.prisma.userPushSubscription.deleteMany({
        where: { userId, endpoint },
      });
    } else {
      // Delete all subscriptions for this user (logout flow)
      await this.prisma.userPushSubscription.deleteMany({ where: { userId } });
    }
  }
}