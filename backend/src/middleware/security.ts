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
        if (
          env.corsOrigin === '*' ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );
  app.use(mongoSanitize()); // strip $ and . from keys -> blocks Mongo operator injection
  app.use(hpp()); // HTTP parameter pollution guard
  app.use(globalLimiter);
}
