import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

/**
 * CustomThrottlerGuard
 * Extends the default ThrottlerGuard to use the authenticated user's DB ID
 * as the rate-limit key instead of raw IP address.
 *
 * This ensures:
 *  - Authenticated users are rate-limited per account (not per IP)
 *  - Users behind NAT / shared IPs are not affected by each other
 *  - Unauthenticated routes (e.g. /auth/sync) still fall back to IP
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Request): Promise<string> {
    // Use DB user ID if authenticated, fall back to IP for public routes
    const userId = (req as any).user?.dbUserId;
    return userId ?? req.ip ?? 'anonymous';
  }
}