import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { FirebaseStrategy } from '@/auth/strategies/firebase.strategy';
import { Auth0Strategy } from '@/auth/strategies/auth0.strategy';
import { RedisService } from '@/shared/redis.service';
import { PrismaService } from '@/shared/prisma.service';

/**
 * JwtAuthGuard — applied globally via APP_GUARD in app.module.ts.
 *
 * Flow per request:
 *  1. Skip if route is @Public()
 *  2. Extract Bearer token from Authorization header
 *  3. Verify via FirebaseStrategy or Auth0Strategy (resolved from AUTH_PROVIDER env)
 *  4. Check Redis blocklist (enforces logout immediately)
 *  5. Look up internal DB user ID by email
 *  6. Attach decoded user to request.user for @CurrentUser() downstream
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector:        Reflector,
    private readonly redis:            RedisService,
    private readonly prisma:           PrismaService,
    private readonly firebaseStrategy: FirebaseStrategy,
    private readonly auth0Strategy:    Auth0Strategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Step 1 — skip public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token   = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    try {
      // Step 2 — verify via the correct strategy
      const provider = process.env.AUTH_PROVIDER ?? 'firebase';
      const decoded  = provider === 'firebase'
        ? await this.firebaseStrategy.verify(token)
        : await this.auth0Strategy.verify(token);

      // Step 3 — check blocklist
      if (decoded.jti) {
        const blocked = await this.redis.isJwtBlocklisted(decoded.jti);
        if (blocked) {
          throw new UnauthorizedException('Session has been terminated — please log in again');
        }
      }

      // Step 4 — look up DB user ID
      const dbUser = await this.prisma.user.findUnique({
        where:  { email: decoded.email },
        select: { id: true, isVerified: true },
      });

      if (!dbUser) {
        throw new UnauthorizedException('User not found — please call /auth/sync after login');
      }

      if (!dbUser.isVerified) {
        throw new UnauthorizedException('Account is pending deletion');
      }

      // Step 5 — attach to request
      request.user = {
        uid:          decoded.uid,
        email:        decoded.email,
        authProvider: provider as 'firebase' | 'auth0',
        dbUserId:     dbUser.id,
        jti:          decoded.jti,
        exp:          decoded.exp,
        iat:          0,
      };

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.warn(`Auth failed: ${err.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' && token ? token : null;
  }
}