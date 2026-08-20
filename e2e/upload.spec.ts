import { test, expect } from '@playwright/test';

test('shows the upload landing page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Translate your XML' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create project' })).toBeDisabled();
});
