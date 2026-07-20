/**
 * Retention purge. Deletes applications whose `purgeAfter` has passed (abandoned drafts by
 * default) along with their uploaded documents. Run on a schedule — external cron in production,
 * or the in-process scheduler for small deploys.
 *
 * As a script:  npx tsx src/jobs/purgeExpired.ts
 */
import { Application } from '../models/Application';
import { deleteForApplication } from '../services/uploadService';
import { audit } from '../utils/audit';

export async function purgeExpired(now: Date = new Date()): Promise<number> {
  const expired = await Application.find({
    purgeAfter: { $ne: null, $lte: now },
  }).select('_id appId');

  for (const app of expired) {
    const id = String(app._id);
    await deleteForApplication(id);
    await Application.findByIdAndDelete(id);
    await audit({
      action: 'application_delete',
      targetType: 'Application',
      targetId: id,
      meta: { reason: 'retention_purge', appId: app.appId ?? null },
    });
  }
  return expired.length;
}

// Allow running directly as a one-off script.
if (require.main === module) {
  (async () => {
    const { connectDb } = await import('../config/db');
    const mongoose = (await import('mongoose')).default;
    await connectDb();
    const n = await purgeExpired();
    // eslint-disable-next-line no-console
    console.log(`[purge] removed ${n} expired application(s)`);
    await mongoose.disconnect();
  })().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[purge] failed:', err.message);
    process.exit(1);
  });
}
