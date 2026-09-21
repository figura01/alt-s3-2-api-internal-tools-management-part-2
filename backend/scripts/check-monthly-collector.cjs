// Executes the collector's actual SQL against isolated temporary tables.
require('dotenv').config({ quiet: true });
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const db = new PrismaClient();
const source = readFileSync('src/analytics/monthly-cost-collector.service.ts', 'utf8');
const sql = source.match(/\$executeRaw`([\s\S]*?)`/)[1];
(async () => {
  try {
    await db.$transaction(async tx => {
      await tx.$executeRawUnsafe('CREATE TEMP TABLE tools (id TEXT PRIMARY KEY, monthly_cost NUMERIC(10,2), active_users_count INTEGER) ON COMMIT DROP');
      await tx.$executeRawUnsafe('CREATE TEMP TABLE cost_tracking (LIKE public.cost_tracking INCLUDING ALL) ON COMMIT DROP');
      await tx.$executeRawUnsafe("INSERT INTO tools VALUES ('collector-test-a', 10.00, 3), ('collector-test-b', 8.00, 0)");
      assert.equal(await tx.$executeRawUnsafe(sql), 2);
      assert.equal(await tx.$executeRawUnsafe(sql), 0);
      const rows = await tx.$queryRawUnsafe('SELECT * FROM cost_tracking ORDER BY tool_id');
      assert.equal(Number(rows[0].cost_per_user), 3.33);
      assert.equal(Number(rows[1].cost_per_user), 0);
      await tx.$executeRawUnsafe('UPDATE tools SET monthly_cost = 99');
      assert.equal(await tx.$executeRawUnsafe(sql), 0);
      assert.equal(Number((await tx.$queryRawUnsafe('SELECT cost FROM cost_tracking ORDER BY tool_id'))[0].cost), 10);
      await tx.$executeRawUnsafe("INSERT INTO tools VALUES ('collector-test-c', 20, 2)");
      assert.equal(await tx.$executeRawUnsafe(sql), 1);
      const months = await tx.$queryRawUnsafe("SELECT count(*)::int AS count FROM cost_tracking WHERE month = date_trunc('month', CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date");
      assert.equal(months[0].count, 3);
    });
    console.log('PASS: monthly UTC snapshots, no duplicates, existing values preserved, new tools and zero-user costs. Temporary tables removed.');
  } finally { await db.$disconnect(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
