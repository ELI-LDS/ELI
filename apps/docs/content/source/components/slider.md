# 슬라이더

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Slider는 사용자가 정해진 범위 안에서 값을 조절하거나 구간을 선택하는 입력 컴포넌트예요.

- 볼륨, 밝기처럼 연속적인 범위에서 하나의 값을 선택할 때 사용해요.
- 가격대, 기간처럼 시작 값과 끝 값을 함께 지정해야 할 때 사용할 수 있어요.
- 값의 범위와 현재 위치를 시각적으로 확인하면서 조절해야 하는 경우에 적합해요.

선택 방식에 따라 두 가지 형태를 제공해요.

- **Standard**: 하나의 값을 선택해요.
- **Range**: 시작 값과 끝 값으로 하나의 구간을 선택해요.

## 02. 컴포넌트 구조 (Structure)

Slider는 루트 `div`, 트랙, 활성 트랙, 값 표시 요소, 네이티브 `input[type="range"]`로 구성돼요.

### Standard

- **Root (`div`)**: Slider 전체를 감싸는 요소예요.
- **Track**: 전체 조절 범위를 표시해요.
- **Active Track**: 최솟값부터 현재 값까지의 구간을 표시해요.
- **Value Indicator**: Handle 위에 현재 값을 표시해요. 표시 여부를 설정할 수 있어요.
- **Input**: 실제 값 조절을 처리하는 네이티브 Range input이에요.
- **Markers**: 트랙 아래에 최솟값과 최댓값을 표시해요.

### Range

- **Root (`div`)**: 두 입력을 하나의 그룹으로 묶으며 `role="group"`이 적용돼요.
- **Track**: 전체 조절 범위를 표시해요.
- **Active Track**: 두 Handle 사이의 선택된 구간을 표시해요.
- **Value Indicator**: 시작 값과 끝 값을 각각 표시해요. 양쪽의 표시 여부를 개별적으로 설정할 수 있어요.
- **Input**: 시작 값과 끝 값을 조절하는 네이티브 Range input 두 개로 구성돼요.
- **Markers**: 트랙 아래에 최솟값과 최댓값을 표시해요.

## 03. 프로퍼티 (Properties)

### Variant

| 값 | 설명 |
| --- | --- |
| `standard` | 하나의 값을 선택해요. 기본값이에요. |
| `range` | 시작 값과 끝 값으로 범위를 선택해요. |

### State

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Default | 입력이 활성화된 상태 | Handle을 드래그하거나 키보드로 값을 조절할 수 있어요. |
| Focus | Handle에 키보드 포커스가 있는 상태 | 해당 Handle에 포커스 아웃라인이 표시돼요. |
| Disabled | `disabled`가 `true`인 상태 | 값 조절이 제한되고 Handle의 커서가 기본 커서로 변경돼요. |

상태별 구현 규칙은 다음과 같아요.

- **Default**: 선택된 구간은 활성 트랙으로 표시해요.
- **Focus**: `:focus-visible` 상태의 Handle에 아웃라인이 표시돼요. Range에서는 포커스된 Handle이 다른 입력보다 위에 표시돼요.
- **Disabled**: 네이티브 input에 `disabled`가 적용돼요. 선택 값과 활성 트랙은 유지되며 별도의 비활성화 색상은 지정되어 있지 않아요.
- **Hover / Pressed**: 별도의 시각적 스타일은 구현되어 있지 않아요.

### 공통 Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | Slider가 조절하는 값을 설명해요. |
| `min` | `number` | `0` | 조절할 수 있는 최솟값이에요. |
| `max` | `number` | `100` | 조절할 수 있는 최댓값이에요. |
| `step` | `number` | `1` | 값이 변경되는 간격이에요. |
| `showMarker` | `boolean` | `true` | 최솟값과 최댓값을 표시할지 정해요. |
| `disabled` | `boolean` | `false` | 값 조절을 비활성화해요. |
| `className` | `string` | - | 루트 `div`에 추가할 클래스 이름이에요. |

### Standard 전용 Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `number` | - | 외부에서 제어하는 현재 값이에요. |
| `defaultValue` | `number` | 전체 범위의 60% | 비제어 방식에서 최초 값을 지정해요. |
| `onValueChange` | `(value: number) => void` | - | 값이 변경되면 변경된 숫자를 전달해요. |
| `showValueIndicator` | `boolean` | `true` | Handle 위에 현재 값을 표시할지 정해요. |

### Range 전용 Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `SliderRangeValue` | - | 외부에서 제어하는 `[시작 값, 끝 값]`이에요. |
| `defaultValue` | `SliderRangeValue` | 전체 범위의 `[27%, 60%]` | 비제어 방식에서 최초 범위를 지정해요. |
| `onValueChange` | `(value: SliderRangeValue) => void` | - | 범위가 변경되면 `[시작 값, 끝 값]`을 전달해요. |
| `showLeftValueIndicator` | `boolean` | `true` | 왼쪽 Handle 위에 시작 값을 표시할지 정해요. |
| `showRightValueIndicator` | `boolean` | `true` | 오른쪽 Handle 위에 끝 값을 표시할지 정해요. |

`SliderRangeValue`는 `[number, number]` 형태의 읽기 전용 튜플이에요.

그 외에도 `HTMLAttributes<HTMLDivElement>`를 상속하므로 일반적인 HTML 속성을 전달할 수 있어요. `style`도 상속된 속성이며 루트 `div`에 적용돼요. 단, `aria-label`, `children`, `defaultValue`, `onChange`는 별도로 제외돼요.

## 04. 인터랙션 규칙 (Interaction)

### 값 조절

- Handle을 드래그해 값을 변경할 수 있어요.
- 네이티브 Range input의 키보드 조작을 사용해요.
- `step`에 지정한 간격을 기준으로 값이 변경돼요.
- 값이 변경되면 `onValueChange`가 실행돼요.

### Standard 선택

- 하나의 Handle로 현재 값을 조절해요.
- 활성 트랙은 최솟값부터 현재 값까지 표시돼요.
- `onValueChange`에는 변경된 숫자를 전달해요.

### Range 선택

- 왼쪽 Handle은 시작 값, 오른쪽 Handle은 끝 값을 조절해요.
- 활성 트랙은 두 Handle 사이에 표시돼요.
- 시작 값은 끝 값보다 커질 수 없어요.
- 끝 값은 시작 값보다 작아질 수 없어요.
- 두 Handle은 서로 교차할 수 없어요.
- `onValueChange`에는 변경된 `[시작 값, 끝 값]`을 전달해요.

### 값 보정

- `min`과 `max`가 반대 순서로 전달되면 내부에서 두 값을 오름차순으로 정렬해 사용해요.
- 선택값이 조절 범위를 벗어나면 최솟값 또는 최댓값으로 제한해요.
- Range의 초기값이 반대 순서로 전달되면 두 값을 오름차순으로 정렬해요.

### 상태 제어

Slider는 제어 방식에 따라 값을 관리해요.

- **Uncontrolled**: `defaultValue`로 최초 값을 지정하고 이후 변경된 값은 내부에서 관리해요.
- **Controlled**: `value`와 `onValueChange`를 함께 사용해요. 값이 변경되면 외부에서 새로운 `value`를 전달해야 화면에 반영돼요.

두 방식을 함께 사용하지 말고 한 가지 제어 방식을 선택해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 하나의 값을 조절할 때는 `standard`를 사용해요.
- 시작 값과 끝 값을 함께 선택해야 할 때는 `range`를 사용해요.
- `min`, `max`, `step`을 설정해 선택 가능한 범위를 지정해요.
- `aria-label`에 Slider가 조절하는 값의 의미를 전달해요.
- 값의 의미를 이해하기 쉽도록 필요한 경우 최솟값과 최댓값을 표시해요.
- 현재 값을 확인해야 하는 경우 Value Indicator를 표시해요.
- Range에서는 시작 값과 끝 값이 각각 어떤 의미인지 설명해요.

### Don't

- 여러 개의 독립적인 항목을 선택하는 용도로 사용하지 않아요.
- 정확한 값을 직접 입력해야 하는 경우 Slider만 사용하지 않아요.
- 선택 가능한 범위나 단위를 설명하지 않은 채 배치하지 않아요.
- Range의 두 Handle이 서로 교차할 수 있다고 가정하지 않아요.
- `showValueIndicator`를 Range에 사용하지 않아요. Range에서는 `showLeftValueIndicator`와 `showRightValueIndicator`를 사용해요.

### 대안

- 정확한 숫자를 직접 입력해야 한다면 `TextField`를 사용해요.
- 여러 선택지 중 하나를 선택해야 한다면 `Radio` 또는 `Select`를 사용해요.
- 여러 항목을 각각 선택하거나 해제해야 한다면 `Checkbox`를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| Slider + 설정 이름 | 볼륨, 밝기 등 단일 값 조절 | 설정 이름은 조절할 대상을 설명하고 Slider는 값을 변경해요. |
| Slider + 현재 값 텍스트 | 정확한 수치 확인이 필요한 경우 | Slider는 값을 조절하고 텍스트는 현재 수치를 전달해요. |
| Range Slider + 시작·끝 값 설명 | 가격대, 기간 등 구간 선택 | 각 Handle이 나타내는 시작 값과 끝 값의 의미를 설명해요. |
| Slider + TextField | 정밀한 값 입력이 필요한 경우 | Slider로 값을 조절하고 TextField로 정확한 숫자를 입력해요. |

선택 기준은 값의 입력 방식과 정밀도예요.

- **Slider 단독**: 범위 안에서 값을 직관적으로 조절하는 경우에 적합해요.
- **Slider + 현재 값 텍스트**: 조절 중인 숫자를 명확하게 확인해야 할 때 적합해요.
- **Slider + TextField**: 드래그 조절과 정확한 숫자 입력을 모두 제공해야 할 때 적합해요.
- **Range Slider**: 하나의 기준에서 시작 값과 끝 값으로 연속된 구간을 선택할 때 사용해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/slider/Slider/Slider.tsx` |
| Props Type | `packages/ui/src/slider/Slider/Slider.types.ts` |
| State & Interaction | `packages/ui/src/slider/Slider/useSlider.ts` |
| CSS | `packages/ui/src/slider/Slider/Slider.css` |
| Indicator Asset | `packages/ui/src/slider/Slider/indicator-arrow.svg` |
| Storybook | `apps/storybook/stories/Slider.stories.tsx` |
| Export | `packages/ui/src/slider/index.ts` |