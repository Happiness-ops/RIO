import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @CurrentUser() — extracts the decoded JWT + dbUserId from the request.
 * Populated by JwtAuthGuard before the route handler runs.
 *
 * Usage:
 *   async getProfile(@CurrentUser() user: RequestUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export type RequestUser = {
  uid: string;
  email: string;
  authProvider: 'firebase' | 'auth0';
  dbUserId: string;
  jti?: string;
  exp: number;
};