/**
 * Create the first super_admin. Run once:
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='strong-pass' SEED_ADMIN_NAME='You' \
 *     npx tsx src/scripts/seedAdmin.ts
 */
import { connectDb } from '../config/db';
import { Admin, hashPassword } from '../models/Admin';
import mongoose from 'mongoose';

async function main(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME ?? 'Super Admin';
  if (!email || !password) throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD');
  if (password.length < 12) throw new Error('Choose a password of at least 12 characters');

  await connectDb();
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log('[seed] admin already exists:', email);
  } else {
    await Admin.create({
      email,
      name,
      role: 'super_admin',
      passwordHash: await hashPassword(password),
    });
    // eslint-disable-next-line no-console
    console.log('[seed] created super_admin:', email);
  }
  await mongoose.disconnect();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed] failed:', err.message);
  process.exit(1);
});
