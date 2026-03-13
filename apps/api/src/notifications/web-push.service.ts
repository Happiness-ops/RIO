import { Injectable, Logger } from '@nestjs/common';
import * as webpush from 'web-push';

export interface PushPayload {
  title:   string;
  body:    string;
  icon?:   string;
  badge?:  string;
  tag?:    string;  // Deduplication key — same tag replaces previous notification
  data?:   Record<string, any>;
}

@Injectable()
export class WebPushService {
  private readonly logger = new Logger(WebPushService.name);
  private initialised = false;

  private ensureInit() {
    if (this.initialised) return;
    webpush.setVapidDetails(
      process.env.VAPID_EMAIL!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    );
    this.initialised = true;
  }

  /**
   * Send a push notification to a single subscription.
   * Returns true on success.
   * Returns false on 410 Gone (browser unsubscribed) — caller should prune.
   * Throws on other errors.
   */
  async send(
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
    payload: PushPayload,
  ): Promise<boolean> {
    this.ensureInit();
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys:     { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth },
        },
        JSON.stringify(payload),
      );
      return true;
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription expired or revoked — caller should delete the record
        this.logger.warn(`Stale subscription pruned: ${subscription.endpoint.slice(0, 60)}...`);
        return false;
      }
      this.logger.error(`Push delivery failed: ${err.message}`);
      throw err;
    }
  }

  /**
   * Send to all subscriptions for a user. Prunes stale subscriptions automatically.
   */
  async sendToUser(
    subscriptions: { id: string; endpoint: string; p256dh: string; auth: string }[],
    payload: PushPayload,
    onPrune?: (id: string) => Promise<void>,
  ) {
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const delivered = await this.send(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
        if (!delivered && onPrune) {
          await onPrune(sub.id);
        }
        return delivered;
      }),
    );
    return results;
  }
}