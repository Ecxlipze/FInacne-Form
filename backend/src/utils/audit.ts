import { Request } from 'express';
import { AuditLog, AuditAction } from '../models/AuditLog';

interface AuditInput {
  action: AuditAction;
  req?: Request;
  actor?: string | null;
  actorEmail?: string | null;
  targetType?: string | null;
  targetId?: string | null;
  meta?: Record<string, unknown> | null;
}

/**
 * Write an audit entry. Deliberately does not throw — an audit failure should never break the
 * user-facing action, but it is logged so the gap is visible.
 */
export async function audit(input: AuditInput): Promise<void> {
  try {
    await AuditLog.create({
      action: input.action,
      actor: input.actor ?? input.req?.admin?.id ?? null,
      actorEmail: input.actorEmail ?? input.req?.admin?.email ?? null,
      targetType: input.targetType ?? null,
      targetId: input.targetId ?? null,
      ip: input.req?.ip ?? null,
      meta: input.meta ?? null,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[audit] failed to write', (err as Error).message);
  }
}
