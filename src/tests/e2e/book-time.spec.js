import { test, expect } from '@playwright/test';

test('användaren kan boka en vald tid', async ({ page }) => {
  await page.goto('/');

  const firstSlot = page.locator('.slot').first();
  await expect(firstSlot).toBeVisible();

  await firstSlot.click();

 const bookButton = page.locator('#book-btn');
  await bookButton.click();

 
  const statusText = page.locator('#status');
  await expect(statusText).toContainText('Bokning klar! Ordernummer');
});