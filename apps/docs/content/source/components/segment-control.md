# 세그먼트 버튼

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

SegmentControl은 여러 옵션 중 하나를 선택할 수 있도록 제공하는 단일 선택 컴포넌트예요.

- 서로 배타적인 옵션 중 하나를 선택할 때 사용해요.
- 보기 방식, 정렬 기준, 기간 등 동일한 영역의 콘텐츠를 전환할 때 적합해요.
- 선택 가능한 옵션은 최소 2개, 최대 4개예요.
- 여러 옵션을 동시에 선택해야 하는 경우에는 Checkbox를 사용해요.

## 02. 컴포넌트 구조 (Structure)

SegmentControl은 선택 영역을 감싸는 컨테이너와 개별 옵션 버튼으로 구성돼요.

- **Container**: 전체 선택 영역을 감싸고 옵션들을 배치해요. `role="radiogroup"`으로 단일 선택 그룹임을 전달해요.
- **Segment**: 각각의 선택지를 나타내는 버튼이에요. `role="radio"`와 `aria-checked`를 통해 선택 상태를 전달해요.
- **Label**: 각 옵션의 이름을 텍스트로 표시해요.

각 Segment는 `options` 배열의 항목을 기준으로 생성돼요.

옵션은 다음 두 가지 속성으로 구성돼요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `value` | `string` | 옵션을 구분하는 값이며, 선택 결과로 전달돼요. |
| `label` | `string` | 화면에 표시되는 옵션 이름이에요. |
- `options`는 필수이며 2~4개의 옵션을 전달해야 해요.
- 각 옵션의 `value`는 서로 다른 값으로 지정해야 해요.
- `aria-label`은 선택 영역 전체를 설명하기 위해 필수로 제공해야 해요.

## 03. 프로퍼티 (Properties)

### Variant

별도의 Variant Props는 제공하지 않아요.

### Size

별도의 Size Props는 제공하지 않아요.

CSS에 고정된 크기가 적용돼요.

- 컨테이너: 너비 333px, 높이 40px
- 개별 Segment: 높이 32px
- 컨테이너 너비는 최대 100%까지 줄어들 수 있어요.

### State

선택 여부에 따라 두 가지 상태로 구분돼요.

| 상태 | 설명 |
| --- | --- |
| Selected | 현재 선택된 옵션이에요. |
| Unselected | 현재 선택되지 않은 옵션이에요. |

선택 상태는 `value` 또는 내부 선택 값과 각 옵션의 `value`를 비교해 결정해요.

### 기타 Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 선택 영역의 목적을 설명해요. |
| `options` | `SegmentControlOptions` | 필수 | 표시할 옵션 목록이에요. 2~4개를 전달해요. |
| `value` | `string` | - | 외부에서 제어하는 현재 선택 값이에요. |
| `defaultValue` | `string` | 첫 번째 옵션의 `value` | 비제어 방식에서 초기 선택 값을 지정해요. |
| `onValueChange` | `(value: string) => void` | - | 옵션 선택 시 선택된 옵션의 `value`를 전달해요. |
| `className` | `string` | - | 루트 컨테이너에 추가할 CSS 클래스예요. |

그 외에 `id`, `style` 등 HTML `div` 요소의 속성을 사용할 수 있어요.

### 프로퍼티 조합 및 선택 값 관리

SegmentControl은 제어 방식과 비제어 방식 중 하나로 사용할 수 있어요.

- **제어 방식**: `value`를 전달하고, `onValueChange`에서 전달받은 값으로 부모 컴포넌트의 상태를 갱신해요.
- **비제어 방식**: `value`를 전달하지 않고 `defaultValue`로 초기 선택 값을 지정해요. 선택 상태는 컴포넌트 내부에서 관리해요.
- `value`가 전달되면 `defaultValue`보다 `value`가 우선해요.
- `defaultValue`를 생략하면 첫 번째 옵션이 초기 선택돼요.
- `value`와 `defaultValue`에는 `options`에 포함된 `value`를 사용해야 해요.

## 04. 인터랙션 규칙 (Interaction)

### 선택 규칙

- 각 Segment를 클릭하면 해당 옵션이 선택돼요.
- 한 번에 하나의 옵션만 선택할 수 있어요.
- 새로운 옵션을 선택하면 이전 선택은 해제돼요.
- 옵션을 선택하면 `onValueChange`가 실행되고 선택한 옵션의 `value`가 전달돼요.
- 이미 선택된 옵션을 다시 클릭해도 선택 콜백이 실행돼요.

### 제어 방식에 따른 상태 변화

- `value`를 사용하는 제어 방식에서는 부모 컴포넌트가 전달하는 `value`가 선택 상태를 결정해요.
- 제어 방식에서 옵션을 선택하면 `onValueChange`가 실행되지만, 컴포넌트 내부에서 선택 값을 변경하지는 않아요. 부모 컴포넌트가 전달하는 `value`를 갱신해야 선택 상태가 변경돼요.
- 비제어 방식에서는 옵션을 선택하면 컴포넌트 내부의 선택 값이 갱신돼요.

### 키보드 조작

SegmentControl은 라디오 그룹의 키보드 조작 규칙을 적용해요.

| 키 | 동작 |
| --- | --- |
| `ArrowRight` / `ArrowDown` | 다음 옵션으로 이동하고 선택해요. |
| `ArrowLeft` / `ArrowUp` | 이전 옵션으로 이동하고 선택해요. |
| `Home` | 첫 번째 옵션으로 이동하고 선택해요. |
| `End` | 마지막 옵션으로 이동하고 선택해요. |
- 방향키로 마지막 옵션에서 다음으로 이동하면 첫 번째 옵션으로 순환해요.
- 첫 번째 옵션에서 이전으로 이동하면 마지막 옵션으로 순환해요.
- 키보드로 옵션을 이동하면 포커스와 선택 상태가 함께 변경돼요.
- `Tab` 키로 그룹에 진입할 때는 선택된 옵션에 포커스가 위치해요. 선택된 옵션이 없으면 첫 번째 옵션에 포커스가 위치해요.

### 예외 상황 및 제한 사항

- `options`는 2~4개를 전달해야 해요.
- `value` 또는 `defaultValue`가 `options`에 존재하지 않는 값이면 선택된 옵션이 표시되지 않아요. 초기 포커스 가능 위치는 첫 번째 옵션으로 설정돼요.
- 옵션의 `value`는 고유해야 해요. 중복된 값을 사용하면 선택 상태와 React 요소 식별에 문제가 발생할 수 있어요.
- 개별 옵션을 비활성화하는 기능은 제공하지 않아요.
- 별도의 Loading 상태나 Disabled 상태 Props는 제공하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 서로 배타적인 선택지 중 하나를 선택하는 상황에 사용해요.
- 옵션은 2~4개로 구성해요.
- 각 옵션의 `label`은 선택 결과를 사용자가 쉽게 이해할 수 있도록 작성해요.
- `value`는 각 옵션을 구분할 수 있는 고유한 문자열로 지정해요.
- 선택 영역의 목적을 설명하는 `aria-label`을 제공해요.
- 선택 결과에 따라 콘텐츠가 전환된다면 `onValueChange`를 사용해 화면의 콘텐츠를 갱신해요.

### Don't

- 여러 옵션을 동시에 선택해야 하는 상황에 사용하지 않아요.
- 5개 이상의 선택지가 필요한 상황에 사용하지 않아요.
- 옵션마다 다른 동작을 실행하는 독립적인 액션 버튼으로 사용하지 않아요.
- `value`가 중복되거나 `options`에 포함되지 않는 선택 값을 사용하지 않아요.
- 선택 영역의 목적을 설명하지 않는 모호한 `aria-label`을 사용하지 않아요.

### Alternative

- 여러 항목을 동시에 선택해야 한다면 Checkbox를 사용해요.
- 선택지가 많아 한 화면에 4개 이하로 표현하기 어렵다면 Select를 사용해요.
- 각각 독립적인 행동을 실행하는 버튼이 필요하다면 Button을 사용해요.

### Reason

SegmentControl은 하나의 선택 영역에서 옵션 간 선택을 전환하는 컴포넌트예요. 선택지가 서로 배타적이고 개수가 적을 때 적합해요. 다중 선택이나 많은 선택지가 필요한 상황에서는 다른 선택 컴포넌트를 사용하는 것이 적절해요.

## 06. 추천 조합 (Composition)

### SegmentControl + 콘텐츠 영역

선택한 옵션에 따라 동일한 영역의 콘텐츠를 전환할 때 함께 사용해요.

| 구성 요소 | 역할 | 사용 예시 |
| --- | --- | --- |
| SegmentControl | 콘텐츠 전환 기준을 선택해요. | 목록형 / 카드형 |
| 콘텐츠 영역 | 선택한 옵션에 해당하는 내용을 표시해요. | 목록 또는 카드 형태의 콘텐츠 |

**조합 규칙**

- SegmentControl의 `value`를 기준으로 표시할 콘텐츠를 결정해요.
- `onValueChange`에서 선택된 값을 갱신해요.
- 선택 값과 콘텐츠의 표시 상태가 일치하도록 관리해요.
- SegmentControl은 선택 상태를 관리하고, 실제 콘텐츠 전환은 이를 사용하는 상위 컴포넌트에서 구현해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/segment-control/SegmentControl/SegmentControl.tsx` |
| Props Type | `packages/ui/src/segment-control/SegmentControl/SegmentControl.types.ts` |
| CSS | `packages/ui/src/segment-control/SegmentControl/SegmentControl.css` |
| State / Interaction | `packages/ui/src/segment-control/SegmentControl/useSegmentControl.ts` |
| Storybook | `apps/storybook/stories/SegmentControl.stories.tsx` |