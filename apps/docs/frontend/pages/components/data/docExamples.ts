import type { ComponentId } from '../../../features/docs-catalog/catalog';
import type { DocExampleDefinition } from './docPage.types';
import { buttonDocExamples } from '../examples/button/button.docs.ts';
import { badgeDocExamples } from '../examples/badge/badge.docs.ts';
import { modalDocExamples } from '../examples/modal/modal.docs.ts';
import { alertDocExamples } from '../examples/alert/alert.docs.ts';
import { checkboxDocExamples } from '../examples/checkbox/checkbox.docs.ts';
import { chipDocExamples } from '../examples/chip/chip.docs.ts';
import { dividerDocExamples } from '../examples/divider/divider.docs.ts';
import { fabDocExamples } from '../examples/fab/fab.docs.ts';
import { iconButtonDocExamples } from '../examples/icon-button/icon-button.docs.ts';
import { loadingIndicatorDocExamples } from '../examples/loading-indicator/loading-indicator.docs.ts';
import { menuItemDocExamples } from '../examples/menu-item/menu-item.docs.ts';
import { navigationBarGlassDocExamples } from '../examples/navigation-bar-glass/navigation-bar-glass.docs.ts';
import { navigationBarDocExamples } from '../examples/navigation-bar/navigation-bar.docs.ts';
import { navigationDrawerDocExamples } from '../examples/navigation-drawer/navigation-drawer.docs.ts';
import { progressIndicatorDocExamples } from '../examples/progress-indicator/progress-indicator.docs.ts';
import { radioDocExamples } from '../examples/radio/radio.docs.ts';
import { segmentControlDocExamples } from '../examples/segment-control/segment-control.docs.ts';
import { selectDocExamples } from '../examples/select/select.docs.ts';
import { sliderDocExamples } from '../examples/slider/slider.docs.ts';
import { snackBarDocExamples } from '../examples/snack-bar/snack-bar.docs.ts';
import { tabDocExamples } from '../examples/tab/tab.docs.ts';
import { textAreaDocExamples } from '../examples/text-area/text-area.docs.ts';
import { textFieldDocExamples } from '../examples/text-field/text-field.docs.ts';
import { toggleDocExamples } from '../examples/toggle/toggle.docs.ts';
import { tooltipDocExamples } from '../examples/tooltip/tooltip.docs.ts';


// 공개 문서 등록 누락은 타입 검사로 확인하고 예시 정의는 각 컴포넌트가 소유해요.
export const docExamples = {
  'button': buttonDocExamples,
  'badge': badgeDocExamples,
  'modal': modalDocExamples,
  'alert': alertDocExamples,
  'checkbox': checkboxDocExamples,
  'chip': chipDocExamples,
  'divider': dividerDocExamples,
  'fab': fabDocExamples,
  'icon-button': iconButtonDocExamples,
  'loading-indicator': loadingIndicatorDocExamples,
  'menu-item': menuItemDocExamples,
  'navigation-bar': navigationBarDocExamples,
  'navigation-bar-glass': navigationBarGlassDocExamples,
  'navigation-drawer': navigationDrawerDocExamples,
  'progress-indicator': progressIndicatorDocExamples,
  'radio': radioDocExamples,
  'segment-control': segmentControlDocExamples,
  'select': selectDocExamples,
  'slider': sliderDocExamples,
  'snack-bar': snackBarDocExamples,
  'tab': tabDocExamples,
  'text-area': textAreaDocExamples,
  'text-field': textFieldDocExamples,
  'toggle': toggleDocExamples,
  'tooltip': tooltipDocExamples,
} satisfies Record<ComponentId, readonly DocExampleDefinition[]>;
