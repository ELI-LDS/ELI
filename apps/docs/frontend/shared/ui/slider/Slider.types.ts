import type { HTMLAttributes } from 'react';

export type SliderVariant = 'standard' | 'range';
export type SliderRangeValue = readonly [number, number];

interface SliderBaseProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'dangerouslySetInnerHTML' | 'aria-label' | 'children' | 'defaultValue' | 'onChange'
  > {
  /** Slider가 조절하는 값을 화면 낭독기가 읽을 수 있게 설명해요. */
  'aria-label': string;

  /** 조절할 수 있는 최솟값이에요. 기본값은 `0`이에요. */
  min?: number;

  /** 조절할 수 있는 최댓값이에요. 기본값은 `100`이에요. */
  max?: number;

  /** min 기준으로 이동할 양수 간격이에요. 초기값·제어값·콜백도 같은 간격에 맞춰요. 기본값은 1이며 유효하지 않은 간격은 1로 처리해요. */
  step?: number;

  /** 양 끝의 최솟값과 최댓값을 표시할지 정해요. 기본값은 `true`예요. */
  showMarker?: boolean;

  /** `true`이면 값을 조절할 수 없어요. 기본값은 `false`예요. */
  disabled?: boolean;

  /** Slider의 루트 `div`에 전달할 클래스 이름이에요. */
  className?: string;
}

export interface SliderStandardProps extends SliderBaseProps {
  /** 하나의 값을 선택하는 기본 형태예요. 기본값은 `standard`예요. */
  variant?: 'standard';

  /** 외부에서 제어하는 현재 값이에요. */
  value?: number;

  /** 제어하지 않을 때 처음 표시할 값이에요. 기본값은 전체 구간의 `60%`예요. */
  defaultValue?: number;

  /** 값이 바뀌면 다음 숫자를 전달해요. */
  onValueChange?: (value: number) => void;

  /** Handle 위에 현재 값을 표시할지 정해요. 기본값은 `true`예요. */
  showValueIndicator?: boolean;
}

export interface SliderRangeProps extends SliderBaseProps {
  /** 시작 값과 끝 값으로 범위를 선택하는 형태예요. */
  variant: 'range';

  /** 외부에서 제어하는 `[시작 값, 끝 값]`이에요. */
  value?: SliderRangeValue;

  /** 제어하지 않을 때 처음 표시할 범위예요. 기본값은 전체 구간의 `[27%, 60%]`예요. */
  defaultValue?: SliderRangeValue;

  /** 범위가 바뀌면 다음 `[시작 값, 끝 값]`을 전달해요. */
  onValueChange?: (value: SliderRangeValue) => void;

  /** 왼쪽 Handle 위에 시작 값을 표시할지 정해요. 기본값은 `true`예요. */
  showLeftValueIndicator?: boolean;

  /** 오른쪽 Handle 위에 끝 값을 표시할지 정해요. 기본값은 `true`예요. */
  showRightValueIndicator?: boolean;
}

export type SliderProps = SliderStandardProps | SliderRangeProps;
