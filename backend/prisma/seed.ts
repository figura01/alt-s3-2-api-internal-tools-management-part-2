import { PrismaClient } from '@prisma/client';

import { seedCategories } from './seeds/category.seed';
import { seedDepartments } from './seeds/department.seed';
import { seedTools } from './seeds/tool.seed';
import { seedUsers } from './seeds/user.seed';
import { seedUserToolAccesses } from './seeds/user-tool-access.seed';
import { seedAccessRequests } from './data/access-request.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const departmentMap = await seedDepartments(prisma);
  const categoryMap = await seedCategories(prisma);
  const userMap = await seedUsers(prisma, departmentMap);
  const toolMap = await seedTools(prisma, departmentMap, categoryMap);
  const userToolAccessCount = await seedUserToolAccesses(
    prisma,
    userMap,
    toolMap,
  );

  const accessRequestCount = await seedAccessRequests(prisma, userMap, toolMap);

  console.log(`ℹ️ Departments available: ${departmentMap.size}`);
  console.log(`ℹ️ Categories available: ${categoryMap.size}`);
  console.log(`ℹ️ Users available: ${userMap.size}`);
  console.log(`ℹ️ Tools available: ${toolMap.size}`);
  console.log(`ℹ️ User tool accesses available: ${userToolAccessCount}`);
  console.log(`ℹ️ Access requests available: ${accessRequestCount}`);

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
