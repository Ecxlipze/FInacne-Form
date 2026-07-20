import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { applySecurity } from './middleware/security';
import { env } from './config/env';

export function createApp(): Express {
  const app = express();

  applySecurity(app);
  app.use(express.json({ limit: '1mb' })); // form JSON only; file uploads go direct to S3
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ ok: true, ts: new Date().toISOString() });
  });

  // TODO Phase 3+: mount routers here
  // app.use('/api/application', applicationRouter);
  // app.use('/api/admin', adminRouter);

  // Central error handler — never leak stack traces to clients.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('[error]', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
