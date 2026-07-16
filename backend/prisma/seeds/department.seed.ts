import type { PrismaClient } from '@prisma/client';

import { departmentsData } from '../data/departments.data';

export async function seedDepartments(
  prisma: PrismaClient,
): Promise<Map<string, string>> {
  console.log('🏢 Seeding departments...');

  const departmentMap = new Map<string, string>();

  for (const department of departmentsData) {
    const savedDepartment = await prisma.department.upsert({
      where: {
        slug: department.slug,
      },
      update: {
        name: department.name,
        description: department.description,
      },
      create: {
        name: department.name,
        slug: department.slug,
        description: department.description,
      },
    });

    departmentMap.set(savedDepartment.slug, savedDepartment.id);
  }

  console.log(`✅ ${departmentMap.size} departments seeded.`);

  return departmentMap;
}
