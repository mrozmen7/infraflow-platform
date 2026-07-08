import { expect, test } from '@playwright/test';

test('starts an acknowledged Incident response through the operations console', async ({
  page,
}) => {
  await page.goto('/incidents');

  await expect(page.getByRole('heading', { name: 'Incidents', exact: true })).toBeVisible();

  const incidentRow = page
    .getByRole('listitem')
    .filter({ hasText: 'Emergency phone inspection due' });

  await incidentRow.getByRole('button', { name: 'Inspect' }).click();

  const inspector = page.locator('app-incident-inspector');
  await expect(inspector).toContainText('Emergency phone inspection due');
  await expect(inspector.locator('.status')).toHaveText('Acknowledged');

  await inspector.getByRole('button', { name: 'Start response' }).click();

  await expect(inspector.locator('.status')).toHaveText('In Progress');
  await expect(incidentRow).toContainText('Status: In Progress');
  await expect(page.locator('p.visually-hidden')).toContainText(
    'INC-2026-0003 response started by the operator.',
  );
  await expect(page.locator('.operations-summary div').nth(2).locator('dd')).toHaveText('2');
});
