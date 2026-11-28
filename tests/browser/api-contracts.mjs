import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { checkSnackBar } from './snackbar.mjs';

/** 감사에서 재현한 실제 입력·표시·선택·참조의 불일치가 다시 생기지 않는지 확인해요. */
export async function checkApiContracts(page, url) {
  await page.goto(`${url}?api-contracts`);
  const chip = page.getByRole('region', { name: 'Chip 역할 검증' });
  const selectable = chip.getByRole('button', { name: '역할 선택', exact: true });
  await selectable.focus();
  await page.keyboard.press('Space');
  await expect(selectable).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Enter');
  await expect(selectable).toHaveAttribute('aria-pressed', 'false');
  await chip.getByRole('button', { name: '선택 취소', exact: true }).click();
  await expect(chip.getByTestId('chip-action')).toHaveText('없음');
  await chip.getByRole('button', { name: /디자인.*외 1/ }).click();
  await expect(chip.getByTestId('chip-action')).toHaveText('필터 열기');
  await chip.getByRole('button', { name: '태그 라벨', exact: true }).click();
  await expect(chip.getByTestId('chip-action')).toHaveText('라벨 클릭');
  await chip.getByRole('button', { name: '역할 삭제', exact: true }).click();
  await expect(chip.getByTestId('chip-action')).toHaveText('삭제');
  await chip.getByRole('button', { name: '칩 비활성화', exact: true }).click();
  for (const name of ['역할 선택', '태그 라벨', '역할 삭제']) await expect(chip.getByRole('button', { name, exact: true })).toBeDisabled();
  await expect(chip.getByRole('button', { name: /디자인.*외 1/ })).toBeDisabled();
  // DOM에 전달한 className·이벤트 대상·역할별 최대 너비도 기존 계약을 유지해요.
  await expect(selectable).not.toHaveAttribute('variant');
  assert.equal(await selectable.evaluate(node => getComputedStyle(node).maxWidth), '160px');
  assert.equal(await chip.locator('.eli-chip--filter').evaluate(node => getComputedStyle(node).maxWidth), '180px');
  assert.equal(await chip.locator('.eli-chip--removable').evaluate(node => getComputedStyle(node).maxWidth), '180px');
  const slider = name => page.getByRole('slider', { name, exact: true });
  const expectSlider = async (name, value) => {
    const input = slider(name);
    await expect(input).toHaveValue(String(value));
    const label = input.locator('..').locator('.eli-slider__value-indicator > span:first-child');
    await expect(label).toHaveText(String(value));
  };
  await expectSlider('간격 값', 6);
  assert.equal(await slider('간격 값').locator('..').locator('.eli-slider__active-track').evaluate(node => node.style.right), '40%');
  await expectSlider('제어 간격', 6);
  await expectSlider('소수 간격', 0.5);
  await expectSlider('소수 중간값', 0.2);
  await expectSlider('끝 간격', 9);
  await expectSlider('동일 경계', 3);
  await expectSlider('큰 간격', 2);
  await expect(slider('범위 간격 시작 값')).toHaveValue('3');
  await expect(slider('범위 간격 끝 값')).toHaveValue('6');
  await slider('간격 값').focus();
  await page.keyboard.press('ArrowRight');
  await expectSlider('간격 값', 9);
  await expect(page.getByTestId('api-changes')).toHaveText('9');
  await slider('제어 간격').focus();
  await page.keyboard.press('ArrowLeft');
  await expectSlider('제어 간격', 3);
  await expect(page.getByTestId('slider-value')).toHaveText('3');
  await slider('범위 간격 시작 값').focus();
  await page.keyboard.press('End');
  await expect(slider('범위 간격 시작 값')).toHaveValue('6');
  await expect(page.getByTestId('api-changes')).toHaveText('6,6');

  await page.getByRole('button', { name: '참조 포커스' }).click();
  await expect(page.getByRole('textbox', { name: '객체 참조' })).toBeFocused();
  const readRefs = async () => {
    await page.getByRole('button', { name: '참조 확인' }).click();
    return JSON.parse(await page.getByTestId('ref-report').textContent());
  };
  const initial = await readRefs();
  assert.equal(initial.field, 'INPUT');
  assert.equal(initial.checkbox, 'INPUT');
  assert.equal(initial.radio, 'INPUT');
  assert.equal(initial.area, 'TEXTAREA');
  await page.getByRole('button', { name: '참조 교체' }).click();
  const replaced = await readRefs();
  assert.equal(replaced.cleaned, initial.cleaned + 1);
  assert.equal(replaced.attached, initial.attached + 1);
  await page.getByRole('button', { name: '입력 제거' }).click();
  const removed = await readRefs();
  assert.equal(removed.field, null);
  assert.equal(removed.cleaned, replaced.cleaned + 1);

  const beforeRemoval = await page.getByTestId('api-changes').textContent();
  await page.getByRole('button', { name: '첫 항목 제거' }).click();
  await expect(page.getByTestId('api-changes')).toHaveText(beforeRemoval);
  await expect(page.getByTestId('segment-dynamic').getByRole('radio', { name: 'b' })).toBeChecked();
  await expect(page.getByTestId('segment-controlled').locator('[aria-checked="true"]')).toHaveCount(0);
  await expect(page.getByTestId('segment-controlled').locator('.eli-segment-control__indicator')).toHaveCount(0);
  for (const id of ['nav-dynamic', 'glass-dynamic']) {
    await expect(page.getByTestId(id).getByRole('button', { name: 'b', exact: true })).toHaveAttribute('aria-current', 'page');
  }
  await expect(page.getByTestId('glass-controlled').locator('.eli-navigation-bar-glass__indicator')).toHaveCount(0);
  await page.getByRole('button', { name: '항목 재추가' }).click();
  await expect(page.getByTestId('segment-dynamic').getByRole('radio', { name: 'b' })).toBeChecked();
  await expect(page.getByTestId('glass-controlled').getByRole('button', { name: 'a', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByTestId('glass-controlled').getByRole('button', { name: 'c', exact: true }).click();
  await expect(page.getByTestId('glass-controlled').getByRole('button', { name: 'a', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: '전체 항목 제거' }).click();
  for (const id of ['segment-dynamic', 'segment-controlled', 'glass-dynamic', 'glass-controlled']) {
    await expect(page.getByTestId(id).locator('[class$="__indicator"]')).toHaveCount(0);
  }

  const trigger = page.getByRole('button', { name: /옵션 비활성화/ });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'a', exact: true })).toBeFocused();
  await expect(page.getByRole('option', { name: 'b', exact: true })).toBeDisabled();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'c', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('api-changes')).toHaveText('c');
  const group = page.getByRole('radiogroup', { name: '세그먼트 비활성화' });
  await expect(group.getByRole('radio', { name: 'b', exact: true })).toBeDisabled();
  await group.getByRole('radio', { name: 'a', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('radio', { name: 'c', exact: true })).toBeChecked();
  await expect(group.getByRole('radio', { name: 'c', exact: true })).toBeFocused();
  for (const name of ['탐색 이동', '글래스 이동']) {
    const navigation = page.getByRole('navigation', { name, exact: true });
    await expect(navigation.locator('button:disabled')).toHaveCount(0);
    await navigation.getByRole('button', { name: 'b', exact: true }).click();
    await expect(navigation.getByRole('button', { name: 'b', exact: true })).toHaveAttribute('aria-current', 'page');
  }
  const glass = page.getByRole('navigation', { name: '글래스 이동', exact: true });
  await glass.getByRole('button', { name: 'a', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(glass.getByRole('button', { name: 'b', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(glass.getByRole('button', { name: 'b', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: '차단 액션', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '허용 액션', exact: true }).click();
  await expect(page.getByTestId('api-changes')).toHaveText('허용');
  await trigger.click();
  await page.getByRole('button', { name: '전체 비활성화 전환' }).click();
  await expect(trigger).toBeDisabled();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(group.getByRole('radio', { name: 'a', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '전체 비활성화 전환' }).click();
  await expect(page.getByRole('listbox')).toHaveCount(0);

  for (const [index, value] of [37, 0, 100, undefined, undefined, undefined].entries()) {
    for (const label of ['막대', '원형']) {
      const progress = page.getByRole('progressbar', { name: `${label} ${index}`, exact: true });
      if (value === undefined) await expect(progress).not.toHaveAttribute('aria-valuenow');
      else await expect(progress).toHaveAttribute('aria-valuenow', String(value));
    }
    if (value !== undefined) {
      const progress = page.getByRole('progressbar', { name: `막대 ${index}`, exact: true });
      const width = await progress.locator('span').evaluate(node => node.getBoundingClientRect().width);
      assert.ok(Math.abs(width - value * 2) < 1, `진행률 ${value}의 너비: ${width}`);
    }
  }
  await checkSnackBar(page, url);
}
