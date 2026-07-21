/**
 * Security middleware applied globally. Order matters: sanitize/limit before routes run.
 */
import { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { env } from '../config/env';

// Global limiter: coarse protection against abuse of the public endpoints.
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

// Tight limiter for auth + submission endpoints (mount per-route).
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

export function applySecurity(app: Express): void {
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // required for correct client IPs behind a proxy/load balancer

  app.use(helmet());
  const allowedOrigins = env.corsOrigin.split(',').map((s) => s.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowed = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
        if (
          allowed.includes('*') ||
          allowed.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-cron-secret', 'x-scan-secret'],
    })
  );
  app.options('*', cors());
  app.use(mongoSanitize()); // strip $ and . from keys -> blocks Mongo operator injection
  app.use(hpp()); // HTTP parameter pollution guard
  app.use(globalLimiter);
}
