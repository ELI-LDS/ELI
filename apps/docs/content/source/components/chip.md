# 칩

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Chip은 짧은 텍스트를 작은 단위로 표시하고, 선택·필터 설정·항목 제거 등의 상호작용을 제공하는 컴포넌트예요.

사용 목적에 따라 세 가지 유형으로 구분해요.

| 컴포넌트 | 용도 |
| --- | --- |
| `Chip` | 여러 옵션 중 하나 또는 여러 항목을 선택할 때 사용해요. |
| `FilterChip` | 필터 설정 화면을 여는 진입점으로 사용해요. |
| `RemovableChip` | 선택하거나 추가한 항목을 표시하고 개별적으로 제거할 때 사용해요. |

## 02. 컴포넌트 구조 (Structure)

### Chip

- 하나의 버튼으로 구성돼요.
- 내부에 선택 항목의 이름을 표시하는 라벨이 있어요.
- 선택 상태에 따라 활성 스타일이 적용돼요.

### FilterChip

- 하나의 버튼으로 구성돼요.
- 필터 항목명 또는 선택된 옵션을 표시하는 라벨이 있어요.
- 여러 옵션이 선택되면 추가 선택 개수를 표시해요.
- 오른쪽에 펼침 아이콘을 표시해요.

### RemovableChip

- 바깥쪽 `span` 안에 라벨 영역과 삭제 버튼이 배치돼요.
- 라벨 영역은 `onClick` 전달 여부에 따라 버튼 또는 일반 `span`으로 렌더링돼요.
- 삭제 버튼은 X 아이콘을 표시하는 별도의 버튼이에요.
- 라벨 클릭과 삭제 동작은 서로 독립적으로 실행돼요.

## 03. 프로퍼티 (Properties)

### Chip

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | 칩에 표시할 라벨이에요. |
| `selected` | `boolean` | `false` | 선택 상태를 지정해요. |
| `onSelectedChange` | `(selected: boolean) => void` | `undefined` | 클릭 시 다음 선택 상태를 전달해요. |
| `className` | `string` | `undefined` | 루트 버튼에 적용할 클래스 이름이에요. |
| `type` | `ButtonHTMLAttributes`의 `type` | `button` | 버튼 타입을 지정해요. |

`Chip`은 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `disabled`, `style`, `aria-label` 등 일반 버튼 속성도 전달할 수 있어요. 단, `children`은 별도 Prop으로 정의해요.

### FilterChip

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | 필수 | 선택값이 없을 때 표시할 필터 항목명이에요. |
| `options` | `readonly FilterChipOption[]` | 필수 | 필터에 사용할 전체 옵션 목록이에요. |
| `selectedValues` | `readonly string[]` | `[]` | 현재 적용된 옵션의 `value` 목록이에요. |
| `className` | `string` | `undefined` | 루트 버튼에 적용할 클래스 이름이에요. |
| `type` | `ButtonHTMLAttributes`의 `type` | `button` | 버튼 타입을 지정해요. |

각 `options` 항목은 다음 속성으로 구성해요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `label` | `string` | 화면에 표시할 옵션 이름이에요. |
| `value` | `string` | 옵션을 구분하는 고유 값이에요. |

`FilterChip`은 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `disabled`, `style` 등 일반 버튼 속성도 전달할 수 있어요.

### RemovableChip

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | 칩에 표시할 라벨이에요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | `undefined` | 라벨 영역을 클릭했을 때 실행해요. |
| `onRemove` | `MouseEventHandler<HTMLButtonElement>` | 필수 | 삭제 버튼을 클릭했을 때 실행해요. |
| `removeLabel` | `string` | `삭제` | 화면 낭독기에 전달할 삭제 버튼 설명이에요. |
| `disabled` | `boolean` | `false` | 라벨과 삭제 버튼을 비활성화해요. |
| `className` | `string` | `undefined` | 바깥 `span`에 적용할 클래스 이름이에요. |

`RemovableChip`은 `HTMLAttributes<HTMLSpanElement>`를 상속하므로 `style` 등 일반 `span` 속성을 전달할 수 있어요. 단, `children`과 `onClick`은 별도 Prop으로 정의해요.

## 04. 인터랙션 규칙 (Interaction)

### Chip

- 클릭하면 현재 `selected` 값의 반대 값을 `onSelectedChange`에 전달해요.
- 실제 선택 상태는 컴포넌트 내부에서 변경하지 않아요. 부모에서 전달하는 `selected` 값을 갱신해야 화면에 선택 상태가 반영돼요.
- 선택 상태는 `aria-pressed`와 `data-selected`에도 반영돼요.
- `disabled`가 `true`이면 버튼을 클릭할 수 없어요.
- `onClick`에서 `event.preventDefault()`를 호출하면 `onSelectedChange`가 실행되지 않아요.

### FilterChip

- 클릭하면 전달된 `onClick`을 실행해요. 필터 바텀시트나 모달을 여는 동작은 사용하는 쪽에서 구현해요.
- 선택된 옵션이 없으면 `label`을 표시해요.
- 하나 이상의 옵션이 선택되면 선택된 옵션 중 첫 번째 항목의 라벨을 표시해요.
- 두 개 이상의 옵션이 선택되면 첫 번째 항목의 라벨 뒤에 `외 N`을 추가로 표시해요.
- 선택 여부는 `aria-pressed`와 `data-selected`에 반영돼요.
- 선택된 옵션이 있으면 활성 스타일이 적용되고 펼침 아이콘도 활성 색상으로 표시돼요.
- `disabled`가 `true`이면 버튼을 클릭할 수 없어요.

### RemovableChip

- `onClick`을 전달하면 라벨 영역이 버튼으로 렌더링되고, 클릭 시 해당 함수가 실행돼요.
- `onClick`을 생략하면 라벨 영역은 일반 `span`으로 표시돼요.
- 삭제 버튼을 클릭하면 `onRemove`가 실행돼요.
- 삭제 버튼 클릭 시 이벤트 전파를 중단하므로 라벨 영역의 `onClick`은 실행되지 않아요.
- `disabled`가 `true`이면 라벨 버튼과 삭제 버튼이 모두 비활성화돼요.
- 삭제 버튼에는 `removeLabel`이 `aria-label`로 전달돼요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 단순한 선택 항목에는 `Chip`을 사용해요.
- 필터 설정 화면을 여는 버튼에는 `FilterChip`을 사용해요.
- 선택한 검색 조건이나 추가한 태그를 개별적으로 제거해야 한다면 `RemovableChip`을 사용해요.
- `Chip`의 선택 상태는 부모에서 관리하고, `selected`와 `onSelectedChange`를 함께 연결해요.
- `FilterChip`의 `options`에는 전체 옵션을 화면에 표시할 순서대로 전달해요.
- `FilterChip`의 `selectedValues`에는 현재 적용된 옵션의 `value`를 전달해요.
- `RemovableChip`의 `removeLabel`에는 삭제 대상이 명확히 드러나는 설명을 작성해요.

### Don't

- `Chip`을 클릭하면 내부에서 선택 상태가 자동으로 변경된다고 가정하지 않아요. 부모에서 선택 상태를 갱신해야 해요.
- `FilterChip` 자체에서 필터 옵션을 선택하거나 적용한다고 가정하지 않아요. 실제 필터 설정 화면과 적용 로직은 사용하는 쪽에서 구현해요.
- `FilterChip`의 `selectedValues` 순서가 화면 표시 순서에 영향을 준다고 가정하지 않아요. 표시 순서는 `options`의 순서를 기준으로 결정돼요.
- `RemovableChip`을 단순 선택 용도로 사용하지 않아요. 선택 상태를 표시하고 전환하는 목적이라면 `Chip`을 사용해요.
- `RemovableChip`의 `onRemove`를 생략하지 않아요. 필수 Prop이므로 삭제 동작을 전달해야 해요.

## 06. 추천 조합 (Composition)

| 조합 | 역할 및 사용 상황 |
| --- | --- |
| `Chip` + `selected` + `onSelectedChange` | 선택 가능한 옵션 목록을 구성하고 선택 상태를 관리할 때 사용해요. |
| 여러 `Chip` + 부모 상태 | 여러 항목 중 하나 또는 여러 항목을 선택하는 UI를 구성할 때 사용해요. 선택 규칙은 부모에서 관리해요. |
| `FilterChip` + BottomSheet | 필터 버튼을 누르면 바텀시트에서 옵션을 설정하는 구조에 사용해요. |
| `FilterChip` + Modal | 필터 설정을 모달로 제공할 때 사용해요. |
| `RemovableChip` + 검색 조건 목록 | 적용된 검색 조건을 표시하고 개별 조건을 제거할 때 사용해요. |
| 여러 `RemovableChip` + 태그 목록 | 사용자가 추가한 태그를 나열하고 각각 삭제할 수 있도록 구성할 때 사용해요. |

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Chip | `packages/ui/src/chip/Chip/Chip.tsx` |
| Chip Props | `packages/ui/src/chip/Chip/Chip.types.ts` |
| FilterChip | `packages/ui/src/chip/FilterChip/FilterChip.tsx` |
| FilterChip Props | `packages/ui/src/chip/FilterChip/FilterChip.types.ts` |
| RemovableChip | `packages/ui/src/chip/RemovableChip/RemovableChip.tsx` |
| RemovableChip Props | `packages/ui/src/chip/RemovableChip/RemovableChip.types.ts` |
| 공통 CSS | `packages/ui/src/chip/Chip.css` |
| Storybook - Chip | `apps/storybook/stories/Chip.stories.tsx` |
| Storybook - FilterChip | `apps/storybook/stories/FilterChip.stories.tsx` |
| Storybook - RemovableChip | `apps/storybook/stories/RemovableChip.stories.tsx` |