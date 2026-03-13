import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

/**
 * FirebaseStrategy
 * Verifies a Firebase ID token using the Firebase Admin SDK.
 * Called by JwtAuthGuard when AUTH_PROVIDER=firebase.
 */
@Injectable()
export class FirebaseStrategy {
  private readonly logger = new Logger(FirebaseStrategy.name);

  async verify(token: string): Promise<{
    uid: string;
    email: string;
    exp: number;
    jti?: string;
  }> {
    try {
      const decoded = await admin.auth().verifyIdToken(token, true); // checkRevoked=true

      if (!decoded.email) {
        throw new UnauthorizedException('Firebase token must contain an email claim');
      }

      return {
        uid:   decoded.uid,
        email: decoded.email,
        exp:   decoded.exp,
        jti:   decoded.uid, // Firebase doesn't issue jti — use uid as blocklist key
      };
    } catch (err) {
      this.logger.warn(`Firebase token verification failed: ${err.message}`);

      if (err instanceof UnauthorizedException) throw err;

      // Map Firebase error codes to readable messages
      if (err.code === 'auth/id-token-expired') {
        throw new UnauthorizedException('Token has expired — please log in again');
      }
      if (err.code === 'auth/id-token-revoked') {
        throw new UnauthorizedException('Token has been revoked — please log in again');
      }

      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}