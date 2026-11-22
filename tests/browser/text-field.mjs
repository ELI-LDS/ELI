import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';

/** 지우기 버튼은 입력과 연결되고 폼을 제출하거나 readonly·disabled 값을 바꾸면 안 돼요. */
export async function checkTextField(page, url) {
  await page.goto(`${url}?text-field`);
  const controlled = page.getByRole('textbox', { name: '제어 입력', exact: true });
  const clearFor = input => input.locator('..').getByRole('button', { name: '입력 내용 지우기' });
  await expect(controlled).toHaveValue('처음 입력');
  await page.getByText('제어 입력', { exact: true }).click();
  await expect(controlled).toBeFocused();
  await clearFor(controlled).click();
  await expect(controlled).toHaveValue('');
  await expect(controlled).toBeFocused();
  await expect(page.getByTestId('field-value')).toHaveText('빈 값');
  await expect(page.getByTestId('field-changes')).toHaveText('1');
  await controlled.fill('다시 입력');
  // 버튼으로 이동하는 시스템 키 설정과 구분해, 포커스를 받은 버튼의 키보드 동작을 확인해요.
  await clearFor(controlled).focus();
  await expect(clearFor(controlled)).toBeFocused();
  await page.keyboard.press('Space');
  await expect(controlled).toHaveValue('');
  await expect(controlled).toBeFocused();
  const uncontrolled = page.getByRole('textbox', { name: '비제어 입력' });
  await clearFor(uncontrolled).focus();
  await page.keyboard.press('Enter');
  await expect(uncontrolled).toHaveValue('');
  await expect(uncontrolled).toBeFocused();
  const number = page.getByRole('spinbutton', { name: '숫자 입력' });
  await clearFor(number).click();
  await expect(number).toHaveValue('');
  for (const name of ['읽기 전용 입력', '비활성 입력']) {
    const input = page.getByRole('textbox', { name });
    await expect(clearFor(input)).toBeDisabled();
    await expect(input).toHaveValue('보존');
  }
  await expect(page.getByTestId('form-submits')).toHaveText('0');
  await page.getByRole('button', { name: '초기화' }).click();
  await expect(uncontrolled).toHaveValue('기본 입력');
  const a11y = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  assert.deepEqual(a11y.violations.map(v => v.id), []);
}
