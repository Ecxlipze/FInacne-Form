import { Schema, model, Document, Types } from 'mongoose';

export type AuditAction =
  | 'login' | 'login_failed' | 'logout' | 'token_refresh'
  | 'application_submit' | 'application_view' | 'application_status_change'
  | 'application_delete' | 'document_download' | 'export'
  | 'rate_limit_triggered';

export interface AuditLogDoc extends Document {
  action: AuditAction;
  actor: Types.ObjectId | null; // admin id, or null for applicant/anonymous actions
  actorEmail: string | null;
  targetType: string | null; // e.g. 'Application'
  targetId: string | null;
  ip: string | null;
  meta: Record<string, unknown> | null;
  createdAt: Date;
}

const AuditLogSchema = new Schema<AuditLogDoc>(
  {
    action: { type: String, required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: 'Admin', default: null, index: true },
    actorEmail: { type: String, default: null },
    targetType: { type: String, default: null },
    targetId: { type: String, default: null, index: true },
    ip: { type: String, default: null },
    meta: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLog = model<AuditLogDoc>('AuditLog', AuditLogSchema);
