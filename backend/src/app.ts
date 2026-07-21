import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { applySecurity } from './middleware/security';
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminApplicationRoutes from './routes/adminApplicationRoutes';
import { env } from './config/env';
import { connectDb } from './config/db';
import { purgeExpired } from './jobs/purgeExpired';

export function createApp(): Express {
  const app = express();

  applySecurity(app);
  app.use(express.json({ limit: '1mb' })); // form JSON only; file uploads go direct to storage
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  // Ensure DB connection on every request for serverless cold-start resilience
  app.use(async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      await connectDb();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ts: new Date().toISOString() });
  });

  // Vercel Cron Endpoint for automated retention purging
  app.get('/api/cron/purge', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cronSecret = process.env.CRON_SECRET || env.scanCallbackSecret;
      const authHeader = req.headers.authorization;
      
      if (cronSecret && authHeader !== `Bearer ${cronSecret}` && req.headers['x-cron-secret'] !== cronSecret) {
        // In dev or without CRON_SECRET configured, log warning but process if allowed
        if (env.nodeEnv === 'production' && cronSecret) {
          return res.status(401).json({ error: 'Unauthorized cron request' });
        }
      }

      const count = await purgeExpired();
      res.json({ ok: true, purged: count, ts: new Date().toISOString() });
    } catch (err) {
      next(err);
    }
  });

  app.use('/api/admin', authRoutes);
  app.use('/api/admin', adminApplicationRoutes);
  app.use('/api', applicationRoutes); // /api/form/config, /api/application/*
  app.use('/api', uploadRoutes); // /api/upload/*

  // Central error handler — never leak stack traces to clients.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('[error]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

