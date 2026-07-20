import { Schema, model } from 'mongoose';

interface CounterDoc {
  _id: string; // e.g. 'app-20260720'
  seq: number;
}

const CounterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = model<CounterDoc>('Counter', CounterSchema);

/** Atomically increment and return the next sequence for a given key (concurrency-safe). */
async function nextSeq(key: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    key,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

/** Produce APP-YYYYMMDD-NNNNNN, unique and monotonically increasing per day. */
export async function nextAppId(now: Date = new Date()): Promise<string> {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = await nextSeq(`app-${ymd}`);
  return `APP-${ymd}-${String(seq).padStart(6, '0')}`;
}
