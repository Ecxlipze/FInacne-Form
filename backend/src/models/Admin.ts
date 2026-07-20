import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type AdminRole = 'super_admin' | 'reviewer' | 'viewer';

export interface AdminDoc extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  verifyPassword(plain: string): Promise<boolean>;
}

const AdminSchema = new Schema<AdminDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false }, // never returned by default
    name: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['super_admin', 'reviewer', 'viewer'],
      default: 'viewer',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AdminSchema.methods.verifyPassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};

/** Hash a plaintext password. Cost 12 is a reasonable default for interactive logins. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export const Admin = model<AdminDoc>('Admin', AdminSchema);
