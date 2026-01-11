import { test, expect } from '@playwright/test';

test('visual regression basic check', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Wait for hero to load
  await expect(page.locator('h1')).toBeVisible();
  
  // Check title
  await expect(page).toHaveTitle(/Merlion Brews/);
  
  // Take a screenshot of the top fold
  await page.screenshot({ path: 'tests/visual/hero.png' });
  
  // Check footer compliance
  await expect(page.locator('footer')).toContainText('Business Registration: 2015123456K');
  await expect(page.locator('footer')).toContainText('GST Registration: M9-1234567-8');
});
