import { UserRole } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  sid?: string;
  email: string;
  role: UserRole;
};
