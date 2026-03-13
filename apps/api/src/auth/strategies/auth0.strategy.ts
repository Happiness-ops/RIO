import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import JwksClient from 'jwks-rsa';

/**
 * Auth0Strategy
 * Verifies an Auth0 access token using JWKS (JSON Web Key Set).
 * The JWKS is fetched from the Auth0 domain and cached in memory.
 * Called by JwtAuthGuard when AUTH_PROVIDER=auth0.
 */
@Injectable()
export class Auth0Strategy {
  private readonly logger = new Logger(Auth0Strategy.name);

  // JWKS client is a singleton — cached keys avoid repeated HTTP calls
  private readonly jwksClient = JwksClient({
    jwksUri:            `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache:              true,
    cacheMaxEntries:    5,
    cacheMaxAge:        600_000, // 10 minutes
    rateLimit:          true,
    jwksRequestsPerMinute: 10,
  });

  async verify(token: string): Promise<{
    uid: string;
    email: string;
    exp: number;
    jti?: string;
  }> {
    return new Promise((resolve, reject) => {
      const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
        if (!header.kid) {
          return callback(new Error('Token missing kid header'));
        }
        this.jwksClient.getSigningKey(header.kid, (err, key) => {
          if (err) return callback(err);
          callback(null, key?.getPublicKey());
        });
      };

      jwt.verify(
        token,
        getKey,
        {
          audience:   process.env.AUTH0_AUDIENCE,
          issuer:     `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256'],
        },
        (err, decoded: any) => {
          if (err) {
            this.logger.warn(`Auth0 token verification failed: ${err.message}`);

            if (err.name === 'TokenExpiredError') {
              return reject(new UnauthorizedException('Token has expired — please log in again'));
            }
            return reject(new UnauthorizedException('Invalid Auth0 token'));
          }

          if (!decoded?.email) {
            return reject(new UnauthorizedException('Auth0 token must contain an email claim'));
          }

          resolve({
            uid:   decoded.sub,   // Auth0 subject — e.g. "auth0|abc123"
            email: decoded.email,
            exp:   decoded.exp,
            jti:   decoded.jti,   // Auth0 includes jti — used for logout blocklisting
          });
        },
      );
    });
  }
}