import { createApp } from './app';
import { connectDb } from './config/db';
import { env, validateEnv } from './config/env';

async function main(): Promise<void> {
  validateEnv(); // fail fast on missing secrets
  await connectDb();
  const app = createApp();
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
