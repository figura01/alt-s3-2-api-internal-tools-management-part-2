import { Prisma } from '@prisma/client';

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  department: { select: { id: true, name: true } },
  createdAt: true,
} satisfies Prisma.UserSelect;
