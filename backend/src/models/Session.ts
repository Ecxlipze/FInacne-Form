import { Schema, model, Document, Types } from 'mongoose';

/**
 * A refresh-token session. We store only the SHA-256 hash of the token, never the token itself,
 * so a database leak can't be used to mint access tokens. Rotation deletes the old row and
 * creates a new one; logout deletes it. Mongo's TTL index auto-expires stale rows.
 */
export interface SessionDoc extends Document {
  admin: Types.ObjectId;
  tokenHash: string;
  userAgent: string | null;
  ip: string | null;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<SessionDoc>(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// TTL index: Mongo removes the document once expiresAt passes.
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<SessionDoc>('Session', SessionSchema);
