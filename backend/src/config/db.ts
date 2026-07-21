import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export async function connectDb(): Promise<void> {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri);
  isConnected = true;
  // eslint-disable-next-line no-console
  console.log('[db] connected');
}

