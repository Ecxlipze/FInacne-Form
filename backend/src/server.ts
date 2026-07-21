import { createApp } from './app';
import { connectDb } from './config/db';
import { env, validateEnv } from './config/env';
import { startScheduler } from './jobs/scheduler';

validateEnv(); // fail fast on missing secrets

const app = createApp();

if (process.env.VERCEL !== '1') {
  async function main(): Promise<void> {
    await connectDb();
    startScheduler();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] listening on :${env.port} (${env.nodeEnv})`);
    });
  }

  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[fatal]', err);
    process.exit(1);
  });
}

export default app;

