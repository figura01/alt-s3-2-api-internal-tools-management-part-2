// prisma/seeds/user.seed.ts

import type { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

import { usersData } from '../data/users.data';

export async function seedUsers(
  prisma: PrismaClient,
  departmentMap: Map<string, string>,
): Promise<Map<string, string>> {
  console.log('👤 Seeding users...');

  const userMap = new Map<string, string>();

  for (const user of usersData) {
    const departmentId = departmentMap.get(user.departmentSlug);

    if (!departmentId) {
      throw new Error(
        `Department "${user.departmentSlug}" not found for user ${user.email}`,
      );
    }

    const passwordHash = await argon2.hash(user.password);

    const savedUser = await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash,
        departmentId,
        role: user.role,
        status: user.status,
        jobTitle: user.jobTitle,
        hireDate: new Date(user.hireDate),
      },
      create: {
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash,
        departmentId,
        role: user.role,
        status: user.status,
        jobTitle: user.jobTitle,
        hireDate: new Date(user.hireDate),
      },
    });

    userMap.set(savedUser.email, savedUser.id);
  }

  console.log(`✅ ${userMap.size} users seeded.`);

  return userMap;
}
