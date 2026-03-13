import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import JwksClient from 'jwks-rsa';
import { PrismaService } from '@/shared/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Verifies the incoming JWT and upserts the user in the database.
   * Called on every login — safe to call repeatedly (idempotent).
   */
  async syncUser(token: string) {
    const provider = process.env.AUTH_PROVIDER ?? 'firebase';
    let decoded: { uid?: string; sub?: string; email: string };

    try {
      if (provider === 'firebase') {
        decoded = await admin.auth().verifyIdToken(token);
      } else {
        decoded = await this.verifyAuth0Token(token);
      }
    } catch (err) {
      this.logger.warn(`Token verification failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!decoded.email) {
      throw new UnauthorizedException('Token must contain an email claim');
    }

    // Upsert user — create on first login, update auth provider on subsequent logins
    const user = await this.prisma.user.upsert({
      where: { email: decoded.email },
      create: {
        email:        decoded.email,
        authProvider: provider === 'firebase' ? 'firebase' : 'auth0',
        isVerified:   true,
        timezone:     'UTC', // Updated during onboarding
        profile: {
          create: {
            onboardingCompleted: false,
            preferences:         {},
          },
        },
      },
      update: {
        authProvider: provider === 'firebase' ? 'firebase' : 'auth0',
        isVerified:   true,
      },
      include: { profile: true },
    });

    this.logger.log(`User synced: ${user.email}`);

    return {
      id:                  user.id,
      email:               user.email,
      authProvider:        user.authProvider,
      timezone:            user.timezone,
      isVerified:          user.isVerified,
      onboardingCompleted: user.profile?.onboardingCompleted ?? false,
      createdAt:           user.createdAt,
    };
  }

  private async verifyAuth0Token(token: string): Promise<any> {
    const client = JwksClient({
      jwksUri:   `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      cache:     true,
      rateLimit: true,
    });

    return new Promise((resolve, reject) => {
      const getKey = (header: any, callback: any) => {
        client.getSigningKey(header.kid, (err: any, key: any) => {
          if (err) return callback(err);
          callback(null, key.getPublicKey());
        });
      };

      jwt.verify(
        token,
        getKey,
        {
          audience: process.env.AUTH0_AUDIENCE,
          issuer:   `https://${process.env.AUTH0_DOMAIN}/`,
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        },
      );
    });
  }
}