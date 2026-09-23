import { test, expect, type Page } from '@playwright/test';
import { createHmac } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const api = 'http://localhost:3101/api';
const csrf = { 'X-CSRF-Protection': '1' };
async function login(page: Page, role = 'admin') {
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill(`${role}@e2e.test`);
  await page.getByLabel('Password', { exact: true }).fill('E2e-password123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('http://localhost:3100/');
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
}

test('login errors, HttpOnly cookies, reload and logout revoke the session', async ({ page, context }) => {
  await page.goto('/tools');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Email', { exact: true }).fill('admin@e2e.test');
  await page.getByLabel('Password', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Invalid email or password.' })).toBeVisible();
  await login(page);
  const cookies = await context.cookies();
  for (const name of ['techcorp_session', 'techcorp_refresh']) {
    expect(cookies.find(c => c.name === name)?.httpOnly).toBe(true);
  }
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(cookies.find(c => c.name === 'techcorp_session')!.value);
  await page.reload();
  await page.getByRole('button', { name: 'Account menu' }).click();
  await page.getByRole('menuitem', { name: 'Logout', exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  // Replay the original cookies: revocation must be enforced by the server.
  await context.addCookies(cookies);
  expect((await context.request.get(`${api}/auth/me`)).status()).toBe(401);
  expect((await context.request.post(`${api}/auth/refresh`, { headers: csrf })).status()).toBe(401);
});

test('expired signed access token refreshes, then missing refresh returns to login', async ({ page, context }) => {
  await login(page);
  const cookie = (await context.cookies()).find(c => c.name === 'techcorp_session')!;
  const [header, body] = cookie.value.split('.');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  payload.exp = Math.floor(Date.now() / 1000) - 60;
  const unsigned = `${header}.${Buffer.from(JSON.stringify(payload)).toString('base64url')}`;
  const expired = `${unsigned}.${createHmac('sha256', 'e2e-only-secret').update(unsigned).digest('base64url')}`;
  await context.addCookies([{ ...cookie, value: expired }]);
  expect((await context.request.get(`${api}/auth/me`)).status()).toBe(401);
  const refreshed = page.waitForResponse(r => r.url() === `${api}/auth/refresh` && r.request().method() === 'POST');
  await page.reload();
  expect((await refreshed).status()).toBe(201);
  await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
  expect((await context.request.get(`${api}/auth/me`)).status()).toBe(200);
  await context.clearCookies();
  await page.goto('/tools');
  await expect(page).toHaveURL(/\/login$/);
});

for (const role of ['employee', 'manager']) {
  test(`${role}: page and API enforce role permissions`, async ({ page, context }) => {
    await login(page, role);
    await page.goto('/tools/create');
    await expect(page.getByRole('alert').filter({ hasText: 'Access denied' })).toBeVisible();
    expect((await context.request.post(`${api}/tools`, { headers: csrf, data: {} })).status()).toBe(403);
    await page.goto('/settings');
    await expect(page.getByRole('alert').filter({ hasText: 'Access denied' })).toBeVisible();
    await page.goto('/analytics');
    if (role === 'employee') {
      await expect(page.getByRole('alert').filter({ hasText: 'Access denied' })).toBeVisible();
      expect((await context.request.get(`${api}/analytics`)).status()).toBe(403);
    } else {
      await expect(page.getByRole('heading', { name: 'Analytics Overview' })).toBeVisible();
      expect((await context.request.get(`${api}/analytics`)).status()).toBe(200);
    }
  });
}

test('admin creates, edits, exports and deletes a tool', async ({ page, context }) => {
  await login(page);
  const name = `E2E Disposable ${Date.now()}`;
  await page.goto('/tools/create');
  await page.getByLabel('Tool name', { exact: true }).fill(name);
  await page.getByLabel('Vendor', { exact: true }).fill('E2E Vendor');
  await page.getByRole('combobox').nth(0).click();
  await page.getByRole('option', { name: 'E2E Tools', exact: true }).click();
  await page.getByRole('combobox').nth(1).click();
  await page.getByRole('option', { name: 'E2E Engineering', exact: true }).click();
  await page.getByLabel('Monthly cost', { exact: true }).fill('12.5');
  await page.getByLabel('Active users', { exact: true }).fill('2');
  await page.getByLabel('Description', { exact: true }).fill('Disposable browser test fixture');
  const created = page.waitForResponse(r => r.url() === `${api}/tools` && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Create tool', exact: true }).click();
  const response = await created;
  expect(response.status()).toBe(201);
  await expect(page).toHaveURL(/\/tools$/);
  const row = page.getByRole('row').filter({ hasText: name });
  await row.getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Monthly cost', { exact: true }).fill('24.75');
  const updated = page.waitForResponse(r => r.url().includes('/api/tools/') && r.request().method() === 'PUT');
  await page.getByRole('button', { name: 'Update tool', exact: true }).click();
  expect((await updated).ok()).toBe(true);
  await expect(page).toHaveURL(/\/tools$/);
  await page.goto('/analytics');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^analytics-all-3m-.*\.csv$/);
  const csv = await readFile((await download.path())!, 'utf8');
  expect(csv).toContain(`"Tools","${name}",24.75`);
  expect(csv).toContain('"Tools","E2E Reference",42');
  expect(csv).toContain('"Spend evolution"');
  await page.goto('/tools');
  await page.getByRole('row').filter({ hasText: name }).getByRole('button').click();
  await page.getByRole('menuitem', { name: 'Delete', exact: true }).click();
  const deleted = page.waitForResponse(r => r.url().includes('/api/tools/') && r.request().method() === 'DELETE');
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  const result = await deleted;
  expect(result.ok()).toBe(true);
  await expect(page.getByRole('row').filter({ hasText: name })).toHaveCount(0);
  expect((await context.request.get(result.url())).status()).toBe(404);
});

test('notifications persist read state and hide the badge at zero', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Notifications (2 unread)', exact: true }).click();
  const list = page.getByRole('list', { name: 'Notification list' });
  await expect(list.getByText('e2e-notification-one', { exact: true })).toBeVisible();
  await list.getByRole('button', { name: 'Mark as read', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Notifications (1 unread)', exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Notifications (1 unread)', exact: true }).click();
  await page.getByRole('button', { name: 'Mark all as read', exact: true }).click();
  const bell = page.getByRole('button', { name: 'Notifications', exact: true });
  await expect(bell).toBeVisible();
  await expect(bell.locator('[data-slot="badge"]')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Notifications', exact: true })).toBeVisible();
});

test('notifications require authentication and cannot cross account boundaries', async ({ page, context }) => {
  expect((await context.request.get(`${api}/notifications`)).status()).toBe(401);
  await login(page, 'employee');
  const response = await context.request.get(`${api}/notifications`);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ items: [], unreadCount: 0, total: 0 });
  expect((await context.request.patch(`${api}/notifications/e2e-notification-one/read`, { headers: csrf })).status()).toBe(404);
  expect((await context.request.get(`${api}/notifications?offset=-1`)).status()).toBe(400);
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  await expect(page.getByText('No notifications.', { exact: true })).toBeVisible();
});

test('automatic alerts target managers, deduplicate budget thresholds and status transitions', async ({ page, context, browser }) => {
  await login(page);
  const created = await context.request.post(`${api}/tools`, { headers: csrf, data: {
    name: `Alert test ${Date.now()}`, description: 'Disposable notification scenario', vendor: 'E2E', category: 'E2E Tools', owner_department: 'E2E Engineering', monthly_cost: 26958,
  } });
  expect(created.status()).toBe(201);
  const tool = await created.json();
  const id = tool.id;
  const notifications = async () => (await (await context.request.get(`${api}/notifications`)).json()).items as { type: string; eventKey: string; href: string; readAt: string | null }[];
  try {
    expect((await notifications()).filter(n => n.type === 'BUDGET_WARNING')).toHaveLength(1);
    expect((await notifications()).filter(n => n.type === 'BUDGET_EXCEEDED')).toHaveLength(0);
    const results = await Promise.all([1, 2].map(() => context.request.put(`${api}/tools/${id}`, { headers: csrf, data: { status: 'EXPIRING', monthly_cost: 29958 } })));
    for (const response of results) expect(response.status()).toBe(200);
    let items = await notifications();
    expect(items.filter(n => n.type === 'TOOL_EXPIRING' && n.href === `/tools/${id}`)).toHaveLength(1);
    expect(items.filter(n => n.type === 'BUDGET_EXCEEDED')).toHaveLength(1);
    await context.request.patch(`${api}/notifications/read-all`, { headers: csrf });
    for (const monthly_cost of [0, 31000]) {
      expect((await context.request.put(`${api}/tools/${id}`, { headers: csrf, data: { monthly_cost } })).status()).toBe(200);
    }
    items = await notifications();
    const budget = items.filter(n => n.type.startsWith('BUDGET_'));
    expect(budget).toHaveLength(2);
    expect(budget.every(n => n.readAt !== null)).toBe(true);
    const other = await browser.newContext();
    try {
      const managerPage = await other.newPage();
      await login(managerPage, 'manager');
      const manager = await (await other.request.get(`${api}/notifications`)).json();
      expect(manager.items.filter((n: {type: string}) => n.type !== 'GENERAL')).toHaveLength(3);
    } finally { await other.close(); }
    for (const status of ['ACTIVE', 'EXPIRING']) {
      expect((await context.request.put(`${api}/tools/${id}`, { headers: csrf, data: { status } })).status()).toBe(200);
    }
    expect((await notifications()).filter(n => n.type === 'TOOL_EXPIRING' && n.href === `/tools/${id}`)).toHaveLength(2);
  } finally {
    expect((await context.request.delete(`${api}/tools/${id}`, { headers: csrf })).ok()).toBe(true);
  }
});
