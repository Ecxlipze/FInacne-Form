import { AdminRole } from '../models/Admin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { id: string; email: string; role: AdminRole };
    }
  }
}

export {};
