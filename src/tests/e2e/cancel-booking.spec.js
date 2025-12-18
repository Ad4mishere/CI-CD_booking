import { test, expect } from '@playwright/test';

test('användaren kan avboka en bokning via ordernummer', async ({ page }) => {
  await page.goto('/');

  // 1. Välj och boka en tid
  const firstSlot = page.locator('.slot').first();
  await expect(firstSlot).toBeVisible();
  await firstSlot.click();

  await page.locator('#book-btn').click();

  const statusText = page.locator('#status');
  await expect(statusText).toContainText('Ordernummer');

  // 2. Extrahera ordernummer från status-texten
  const statusMessage = await statusText.textContent();
  const orderNumber = statusMessage.match(/Ordernummer:\s*(\S+)/)[1];

  // 3. Öppna hantera-bokning-modal
  await page.locator('#manage-booking-btn').click();

  const modal = page.locator('#manageBookingModal');
  await expect(modal).toBeVisible();

  // 4. Ange ordernummer
  await page.locator('#orderNumberInput').fill(orderNumber);

  // 5. Klicka Avboka
  await page.locator('#cancelBookingBtn').click();

  // 6. Verifiera avbokningsmeddelande
  const manageMessage = page.locator('#manageBookingMessage');
  await expect(manageMessage).toContainText('Bokningen är avbokad');
});
