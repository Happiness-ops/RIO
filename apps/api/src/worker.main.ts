import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { WorkersBootstrapModule } from './workers/workers-bootstrap.module';

/**
 * worker.main.ts
 *
 * Separate entry point for the BullMQ worker process.
 * Boots only the WorkersBootstrapModule — no HTTP server, no controllers.
 *
 * This file is compiled to dist/worker.main.js and run by workers.Dockerfile.
 */
async function bootstrap() {
  const logger = new Logger('WorkerProcess');

  // Firebase Admin SDK — needed by processors that verify tokens or call Firebase
  if (!admin.apps.length && process.env.AUTH_PROVIDER !== 'auth0') {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  const app = await NestFactory.createApplicationContext(WorkersBootstrapModule, {
    bufferLogs: true,
  });

  // Graceful shutdown — wait for active BullMQ jobs to finish before exiting
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received — shutting down workers gracefully...');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received — shutting down workers gracefully...');
    await app.close();
    process.exit(0);
  });

  logger.log('Worker process started — BullMQ processors are active');
}

bootstrap();
