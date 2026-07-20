import { PrismaClient } from '@prisma/client';

import { seedDepartments } from './seeds/department.seed';
import { seedCategories } from './seeds/category.seed';
import { seedUsers } from './seeds/user.seed';
import { seedTools } from './seeds/tool.seed';
import { seedUserToolAccesses } from './seeds/user-tool-access.seed';
import { seedAccessRequests } from './seeds/access-request.seed';
import { seedUsageLogs } from './seeds/usage-log.seed';
import { seedCostTrackings } from './seeds/cost-tracking.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Reference data
  const departmentMap = await seedDepartments(prisma);
  const categoryMap = await seedCategories(prisma);

  // Core data
  const userMap = await seedUsers(prisma, departmentMap);

  const toolMap = await seedTools(prisma, departmentMap, categoryMap);

  // Business data
  const userToolAccessCount = await seedUserToolAccesses(
    prisma,
    userMap,
    toolMap,
  );

  const accessRequestCount = await seedAccessRequests(prisma, userMap, toolMap);

  const usageLogCount = await seedUsageLogs(prisma, userMap, toolMap);

  const costTrackingCount = await seedCostTrackings(prisma, toolMap);

  console.log('\n📊 Seed summary');
  console.log('────────────────────────────────');

  console.log(`🏢 Departments       : ${departmentMap.size}`);
  console.log(`📂 Categories        : ${categoryMap.size}`);
  console.log(`👥 Users             : ${userMap.size}`);
  console.log(`🛠️  Tools            : ${toolMap.size}`);
  console.log(`🔑 User accesses     : ${userToolAccessCount}`);
  console.log(`📨 Access requests   : ${accessRequestCount}`);
  console.log(`📈 Usage logs        : ${usageLogCount}`);
  console.log(`💰 Cost trackings    : ${costTrackingCount}`);

  console.log('\n✅ Database seed completed!');
}

main()
  .catch(async (error) => {
    console.error('❌ Seed failed');
    console.error(error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
