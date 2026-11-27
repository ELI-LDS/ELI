import type { ComponentId } from '../../../features/docs-catalog/catalog';
import type { DocPreview } from '../data/docPage.types';
import type { docExamples } from '../data/docExamples';
import { buttonDocPreviews } from './button/ButtonDocPreviews';
import { badgeDocPreviews } from './badge/BadgeDocPreviews';
import { modalDocPreviews } from './modal/ModalDocPreviews';
import { AlertBasicPreview, AlertStatusesPreview } from './alert/AlertDocPreviews';
import { CheckboxBasicPreview, CheckboxControlledPreview, CheckboxDisabledPreview } from './checkbox/CheckboxDocPreviews';
import { ChipBasicPreview, ChipMultiplePreview, ChipFilterPreview, ChipRemovePreview } from './chip/ChipDocPreviews';
import { DividerBasicPreview } from './divider/DividerDocPreviews';
import { FabBasicPreview, FabIconPreview, FabMenuPreview } from './fab/FabDocPreviews';
import { IconButtonBasicPreview, IconButtonVariantsPreview, IconButtonDisabledPreview } from './icon-button/IconButtonDocPreviews';
import { LoadingIndicatorBasicPreview, LoadingIndicatorProgressPreview, LoadingIndicatorCyclePreview } from './loading-indicator/LoadingIndicatorDocPreviews';
import { MenuItemBasicPreview, MenuItemShortcutPreview, MenuItemDisabledPreview } from './menu-item/MenuItemDocPreviews';
import { NavigationBarBasicPreview, NavigationBarControlledPreview } from './navigation-bar/NavigationBarDocPreviews';
import { NavigationDrawerBasicPreview, NavigationDrawerControlledPreview } from './navigation-drawer/NavigationDrawerDocPreviews';
import { ProgressIndicatorBasicPreview, ProgressIndicatorIndeterminatePreview } from './progress-indicator/ProgressIndicatorDocPreviews';
import { RadioBasicPreview, RadioControlledPreview } from './radio/RadioDocPreviews';
import { SegmentControlBasicPreview, SegmentControlControlledPreview, SegmentControlDisabledPreview } from './segment-control/SegmentControlDocPreviews';
import { SelectBasicPreview, SelectControlledPreview, SelectDisabledPreview } from './select/SelectDocPreviews';
import { SliderBasicPreview, SliderRangePreview, SliderControlledPreview } from './slider/SliderDocPreviews';
import { SnackBarBasicPreview, SnackBarOpenPreview } from './snack-bar/SnackBarDocPreviews';
import { TabBasicPreview, TabPanelsPreview } from './tab/TabDocPreviews';
import { TextAreaBasicPreview, TextAreaControlledPreview, TextAreaDisabledPreview } from './text-area/TextAreaDocPreviews';
import { TextFieldBasicPreview, TextFieldControlledPreview, TextFieldStatesPreview } from './text-field/TextFieldDocPreviews';
import { ToggleBasicPreview, ToggleControlledPreview, ToggleDisabledPreview } from './toggle/ToggleDocPreviews';
import { TooltipBasicPreview, TooltipTriggerPreview } from './tooltip/TooltipDocPreviews';

import { NavigationBarGlassBasicPreview, NavigationBarGlassControlledPreview } from './navigation-bar-glass/NavigationBarGlassDocPreviews';

// Client Component는 객체 속성이 아닌 개별 심벌로 가져와 SSR 경계를 유지해요.
export const docPreviews = {
  button: buttonDocPreviews,
  badge: badgeDocPreviews,
  modal: modalDocPreviews,
  'alert': {
    basic: AlertBasicPreview,
    statuses: AlertStatusesPreview,
  } satisfies Record<typeof docExamples['alert'][number]['id'], DocPreview>,
  'checkbox': {
    basic: CheckboxBasicPreview,
    controlled: CheckboxControlledPreview,
    disabled: CheckboxDisabledPreview,
  } satisfies Record<typeof docExamples['checkbox'][number]['id'], DocPreview>,
  'chip': {
    basic: ChipBasicPreview,
    multiple: ChipMultiplePreview,
    filter: ChipFilterPreview,
    remove: ChipRemovePreview,
  } satisfies Record<typeof docExamples['chip'][number]['id'], DocPreview>,
  'divider': {
    basic: DividerBasicPreview,
  } satisfies Record<typeof docExamples['divider'][number]['id'], DocPreview>,
  'fab': {
    basic: FabBasicPreview,
    icon: FabIconPreview,
    menu: FabMenuPreview,
  } satisfies Record<typeof docExamples['fab'][number]['id'], DocPreview>,
  'icon-button': {
    basic: IconButtonBasicPreview,
    variants: IconButtonVariantsPreview,
    disabled: IconButtonDisabledPreview,
  } satisfies Record<typeof docExamples['icon-button'][number]['id'], DocPreview>,
  'loading-indicator': {
    basic: LoadingIndicatorBasicPreview,
    progress: LoadingIndicatorProgressPreview,
    cycle: LoadingIndicatorCyclePreview,
  } satisfies Record<typeof docExamples['loading-indicator'][number]['id'], DocPreview>,
  'menu-item': {
    basic: MenuItemBasicPreview,
    shortcut: MenuItemShortcutPreview,
    disabled: MenuItemDisabledPreview,
  } satisfies Record<typeof docExamples['menu-item'][number]['id'], DocPreview>,
  'navigation-bar': {
    basic: NavigationBarBasicPreview,
    controlled: NavigationBarControlledPreview,
  } satisfies Record<typeof docExamples['navigation-bar'][number]['id'], DocPreview>,
  'navigation-bar-glass': {
    basic: NavigationBarGlassBasicPreview,
    controlled: NavigationBarGlassControlledPreview,
  } satisfies Record<typeof docExamples['navigation-bar-glass'][number]['id'], DocPreview>,
  'navigation-drawer': {
    basic: NavigationDrawerBasicPreview,
    controlled: NavigationDrawerControlledPreview,
  } satisfies Record<typeof docExamples['navigation-drawer'][number]['id'], DocPreview>,
  'progress-indicator': {
    basic: ProgressIndicatorBasicPreview,
    indeterminate: ProgressIndicatorIndeterminatePreview,
  } satisfies Record<typeof docExamples['progress-indicator'][number]['id'], DocPreview>,
  'radio': {
    basic: RadioBasicPreview,
    controlled: RadioControlledPreview,
  } satisfies Record<typeof docExamples['radio'][number]['id'], DocPreview>,
  'segment-control': {
    basic: SegmentControlBasicPreview,
    controlled: SegmentControlControlledPreview,
    disabled: SegmentControlDisabledPreview,
  } satisfies Record<typeof docExamples['segment-control'][number]['id'], DocPreview>,
  'select': {
    basic: SelectBasicPreview,
    controlled: SelectControlledPreview,
    disabled: SelectDisabledPreview,
  } satisfies Record<typeof docExamples['select'][number]['id'], DocPreview>,
  'slider': {
    basic: SliderBasicPreview,
    range: SliderRangePreview,
    controlled: SliderControlledPreview,
  } satisfies Record<typeof docExamples['slider'][number]['id'], DocPreview>,
  'snack-bar': {
    basic: SnackBarBasicPreview,
    open: SnackBarOpenPreview,
  } satisfies Record<typeof docExamples['snack-bar'][number]['id'], DocPreview>,
  'tab': {
    basic: TabBasicPreview,
    panels: TabPanelsPreview,
  } satisfies Record<typeof docExamples['tab'][number]['id'], DocPreview>,
  'text-area': {
    basic: TextAreaBasicPreview,
    controlled: TextAreaControlledPreview,
    disabled: TextAreaDisabledPreview,
  } satisfies Record<typeof docExamples['text-area'][number]['id'], DocPreview>,
  'text-field': {
    basic: TextFieldBasicPreview,
    controlled: TextFieldControlledPreview,
    states: TextFieldStatesPreview,
  } satisfies Record<typeof docExamples['text-field'][number]['id'], DocPreview>,
  'toggle': {
    basic: ToggleBasicPreview,
    controlled: ToggleControlledPreview,
    disabled: ToggleDisabledPreview,
  } satisfies Record<typeof docExamples['toggle'][number]['id'], DocPreview>,
  'tooltip': {
    basic: TooltipBasicPreview,
    trigger: TooltipTriggerPreview,
  } satisfies Record<typeof docExamples['tooltip'][number]['id'], DocPreview>,
} satisfies Record<ComponentId, Record<string, DocPreview>>;
