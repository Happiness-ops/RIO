import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * LoggingInterceptor — registered globally in app.module.ts.
 *
 * Per request it:
 *  - Generates a unique requestId (UUID v4)
 *  - Attaches requestId to the response header (X-Request-ID)
 *  - Logs method, url, statusCode, responseTime, userId on completion
 *  - Redacts Authorization header and sensitive body fields from logs
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req:  Request  = context.switchToHttp().getRequest();
    const res:  Response = context.switchToHttp().getResponse();
    const start = Date.now();

    // Generate or carry forward the request ID
    const requestId = (req.headers['x-request-id'] as string) ?? uuidv4();
    res.setHeader('X-Request-ID', requestId);

    // Attach to request for downstream use (e.g. in services for correlation)
    (req as any).requestId = requestId;

    return next.handle().pipe(
      tap({
        next: () => {
          const ms     = Date.now() - start;
          const userId = (req as any).user?.dbUserId ?? 'anonymous';
          const tabId  = req.headers['x-tab-id'] ?? '-';

          this.logger.log({
            requestId,
            userId,
            tabId,
            method:       req.method,
            url:          req.url,
            statusCode:   res.statusCode,
            responseTime: `${ms}ms`,
          });
        },
        error: (err) => {
          const ms     = Date.now() - start;
          const userId = (req as any).user?.dbUserId ?? 'anonymous';

          this.logger.warn({
            requestId,
            userId,
            method:       req.method,
            url:          req.url,
            statusCode:   err.status ?? 500,
            responseTime: `${ms}ms`,
            error:        err.message,
          });
        },
      }),
    );
  }
}