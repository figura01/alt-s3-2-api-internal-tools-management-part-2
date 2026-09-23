// Only deterministic fixtures in an explicitly selected, dedicated test database.
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
if (!process.env.DATABASE_URL || !new URL(process.env.DATABASE_URL).pathname.endsWith('_e2e')) {
  throw new Error('Refusing to seed a database without the _e2e suffix');
}
const db = new PrismaClient();
(async () => {
  const department = await db.department.upsert({ where: { slug: 'e2e-engineering' }, update: {}, create: { name: 'E2E Engineering', slug: 'e2e-engineering' } });
  const category = await db.category.upsert({ where: { slug: 'e2e-tools' }, update: {}, create: { name: 'E2E Tools', slug: 'e2e-tools' } });
  const passwordHash = await argon2.hash('E2e-password123!');
  for (const role of ['ADMIN', 'MANAGER', 'EMPLOYEE']) {
    const data = { name: `E2E ${role}`, firstName: 'E2E', lastName: role, role, status: 'ACTIVE', passwordHash, departmentId: department.id };
    const user = await db.user.upsert({ where: { email: `${role.toLowerCase()}@e2e.test` }, update: data, create: { ...data, email: `${role.toLowerCase()}@e2e.test` } });
    await db.notification.deleteMany({ where: { userId: user.id } });
  }
  const admin = await db.user.findUniqueOrThrow({ where: { email: 'admin@e2e.test' } });
  for (const id of ['e2e-notification-one', 'e2e-notification-two']) {
    const data = { userId: admin.id, title: id, message: 'E2E inbox fixture', readAt: null };
    await db.notification.upsert({ where: { id }, create: { id, ...data }, update: data });
  }
  const tool = await db.tool.upsert({ where: { name: 'E2E Reference' }, update: {}, create: { name: 'E2E Reference', categoryId: category.id, ownerDepartmentId: department.id, monthlyCost: 42, activeUsersCount: 2 } });
  const now = new Date();
  const month = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  await db.costTracking.upsert({ where: { toolId_month: { toolId: tool.id, month } }, update: {}, create: { toolId: tool.id, month, cost: 42, userCount: 2, costPerUser: 21 } });
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
