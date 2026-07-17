import { PrismaClient } from '@prisma/client';

import { seedCategories } from './seeds/category.seed';
import { seedDepartments } from './seeds/department.seed';
import { seedUsers } from './seeds/user.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const departmentMap = await seedDepartments(prisma);
  const categoryMap = await seedCategories(prisma);
  const userMap = await seedUsers(prisma, departmentMap);

  console.log(`ℹ️ Departments available: ${departmentMap.size}`);
  console.log(`ℹ️ Categories available: ${categoryMap.size}`);
  console.log(`ℹ️ Users available: ${userMap.size}`);

  console.log('✅ Database seed completed.');
}

main()
  .catch((error: unknown) => {
    console.error('❌ Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
