import { test, expect } from '@playwright/test';

for (const width of [320, 390, 768]) {
  test(`mobile navigation, catalogue, form and analytics fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/login');
    await page.getByLabel('Email', { exact: true }).fill('admin@e2e.test');
    await page.getByLabel('Password', { exact: true }).fill('E2e-password123!');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL('http://localhost:3100/');
    for (const [label, path] of [['Tools', '/tools'], ['Analytics', '/analytics'], ['Dashboard', '/']]) {
      const trigger = page.getByRole('button', { name: 'Open navigation menu' });
      await expect(trigger).toBeInViewport();
      await trigger.click();
      await page.getByRole('dialog').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(`http://localhost:3100${path}`);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      if (path === '/tools') {
        for (const name of ['Previous', 'Next']) {
          const button = page.getByRole('button', { name, exact: true });
          await button.scrollIntoViewIfNeeded();
          await expect(button).toBeInViewport({ ratio: 1 });
        }
      }
      if (path === '/analytics') await expect(page.getByRole('heading', { name: 'Analytics Overview' })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
    await page.goto('/tools/create');
    await expect(page.getByLabel('Tool name', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create tool', exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });
}
