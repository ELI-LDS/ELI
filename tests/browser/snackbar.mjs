import { expect } from '@playwright/test';

/** 실제 tarball과 선택 설치 소스에서 같은 타이머·일시 정지·재표시 계약을 확인해요. */
export async function checkSnackBar(page, url) {
  await page.clock.install();
  await page.goto(`${url}?api-contracts`);
  await page.bringToFront();
  const snack = page.getByTestId('timed-snackbar');
  const initial = page.getByTestId('uncontrolled-snackbar');
  const open = page.getByRole('button', { name: '알림 열기', exact: true });
  await expect(initial).toBeVisible();
  await page.clock.runFor(5100);
  await expect(initial).toHaveCount(0);

  await open.click();
  await expect(snack).toBeVisible();
  await page.clock.runFor(2000);
  await snack.hover();
  await page.clock.runFor(6000);
  await expect(snack).toBeVisible();
  await snack.getByRole('button', { name: '실행' }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(6000);
  await expect(snack).toBeVisible();
  await snack.getByRole('button', { name: '실행' }).press('Enter');
  await expect(page.getByTestId('snackbar-actions')).toHaveText('1');
  await expect(snack).toBeVisible();
  await open.focus();
  await page.clock.runFor(3100);
  await expect(snack).toHaveCount(0);

  await open.click();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.clock.runFor(6000);
  await expect(snack).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await page.clock.runFor(5100);
  await expect(snack).toHaveCount(0);

  await page.getByRole('button', { name: '알림 유지', exact: true }).click();
  await open.click();
  await page.clock.runFor(20000);
  await expect(snack).toBeVisible();
  await page.getByRole('button', { name: '알림 1초', exact: true }).click();
  await page.clock.runFor(1100);
  await expect(snack).toHaveCount(0);
  await open.click();
  await page.getByRole('button', { name: '알림 닫기', exact: true }).click();
  await expect(snack).toHaveCount(0);
  await open.click();
  await page.getByRole('button', { name: '알림 제거', exact: true }).click();
  await page.clock.runFor(5000);
  await expect(snack).toHaveCount(0);
}
