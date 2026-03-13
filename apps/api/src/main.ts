import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import * as admin from 'firebase-admin';

import { AppModule } from './app.module';
import { validationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  // ── Firebase Admin SDK init ──────────────────────────────────────────────
  if (!admin.apps.length && process.env.AUTH_PROVIDER !== 'auth0') {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  // ── App bootstrap ────────────────────────────────────────────────────────
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // Buffer logs until Pino logger is ready
  });

  // Pino structured logger
  app.useLogger(app.get(Logger));

  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

  app.enableCors({
    origin:           allowedOrigins,
    methods:          ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders:   ['Authorization', 'Content-Type', 'X-Request-ID', 'X-Tab-ID'],
    exposedHeaders:   ['Retry-After', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    credentials:      true,
    maxAge:           86400,
  });

  // ── Global pipes ──────────────────────────────────────────────────────────
  app.useGlobalPipes(validationPipe);

  // ── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('v1');

  // ── Start ─────────────────────────────────────────────────────────────────
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`RIO AI API running on port ${port}`);
}

bootstrap();