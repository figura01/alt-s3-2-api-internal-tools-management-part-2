import { user_role_type } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  email: string;
  role: user_role_type | null;
};
