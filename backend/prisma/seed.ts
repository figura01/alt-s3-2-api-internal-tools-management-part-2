import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

import { departmentsSeed } from './seed-data/departments';
import { categoriesSeed } from './seed-data/categories';
import { usersSeed } from './seed-data/users';
import { toolsSeed } from './seed-data/tools';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  await prisma.user_tool_access.deleteMany();
  await prisma.usage_logs.deleteMany();
  await prisma.access_requests.deleteMany();
  await prisma.tool.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.department.deleteMany();

  const departmentMap = new Map<string, string>();
  const departmentNameMap = new Map<string, string>();
  const categoryMap = new Map<string, string>();

  for (const department of departmentsSeed) {
    const createdDepartment = await prisma.department.create({
      data: {
        name: department.name,
      },
    });

    departmentMap.set(department.oldId, createdDepartment.id);
    departmentNameMap.set(department.name, createdDepartment.id);
  }

  for (const category of categoriesSeed) {
    const createdCategory = await prisma.category.create({
      data: {
        name: category.name,
      },
    });

    categoryMap.set(category.name, createdCategory.id);
  }

  const defaultPasswordHash = await argon2.hash('password123');

  for (const user of usersSeed) {
    const departmentId = departmentMap.get(user.departmentOldId);

    if (!departmentId) {
      throw new Error(`Missing department for user ${user.email}`);
    }
    await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password_hash: defaultPasswordHash,
        department_id: departmentId,
        job_title: user.jobTitle,
        role: 'employee',
        status: user.active ? 'active' : 'inactive',
        hire_date: new Date(user.joinedAt),
      },
    });
  }

  for (const tool of toolsSeed) {
    const categoryId = categoryMap.get(tool.category);
    const ownerDepartmentId = departmentNameMap.get(tool.ownerDepartment);

    if (!categoryId) {
      throw new Error(`Missing category for tool ${tool.name}`);
    }

    if (!ownerDepartmentId) {
      throw new Error(`Missing department for tool ${tool.name}`);
    }

    await prisma.tool.create({
      data: {
        name: String(tool.name),
        vendor: tool.vendor,
        description: tool.description,
        monthly_cost: tool.monthlyCost,
        previous_month_cost: tool.previousMonthCost,
        active_users_count: tool.activeUsersCount,
        website_url: tool.websiteUrl,
        icon_url: tool.iconUrl,
        status: String(tool.status) || null || undefined,
        category_id: categoryId,
        owner_department_id: ownerDepartmentId,
      },
    });
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
