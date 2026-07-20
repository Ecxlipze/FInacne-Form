import cron from 'node-cron';
import { purgeExpired } from './purgeExpired';
import { env } from '../config/env';

/** Start scheduled jobs if enabled. In production prefer a dedicated cron/worker over this. */
export function startScheduler(): void {
  if (!env.enablePurgeCron) return;
  // Daily at 03:15.
  cron.schedule('15 3 * * *', async () => {
    try {
      const n = await purgeExpired();
      // eslint-disable-next-line no-console
      console.log(`[scheduler] purge removed ${n} expired application(s)`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[scheduler] purge failed', (err as Error).message);
    }
  });
  // eslint-disable-next-line no-console
  console.log('[scheduler] retention purge scheduled (03:15 daily)');
}
