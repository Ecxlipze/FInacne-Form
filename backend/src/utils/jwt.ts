import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminRole } from '../models/Admin';

export interface AccessTokenPayload {
  sub: string; // admin id
  email: string;
  role: AdminRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtl,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}
