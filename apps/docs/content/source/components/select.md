# 셀렉트

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Select는 사용자가 미리 정의된 옵션 목록에서 하나의 값을 선택할 수 있도록 제공하는 선택 컴포넌트예요.

- 정해진 선택지 중 하나를 선택해야 하는 입력 UI에 사용해요.
- 선택 영역을 클릭하면 컴포넌트 바로 아래에 옵션 목록이 펼쳐져요.
- 옵션을 선택하면 선택 영역에 해당 옵션의 Label이 표시돼요.
- 여러 선택지를 한 번에 표시하기 어렵거나 입력 영역을 간결하게 구성해야 할 때 사용해요.

## 02. 컴포넌트 구조 (Structure)

### 2.1 구성 요소

Select는 Label, 선택 버튼, 선택값 표시 영역, 펼침 아이콘, 옵션 목록으로 구성돼요.

| 요소 | 역할 | 구현 요소 |
| --- | --- | --- |
| Label | 선택 영역의 이름을 표시해요. | `div.eli-select__label` |
| Control | 선택 버튼과 옵션 목록을 감싸요. | `div.eli-select__control` |
| Trigger | 옵션 목록을 열거나 닫는 버튼이에요. | `button.eli-select__trigger` |
| Value | 선택된 옵션의 Label 또는 Placeholder를 표시해요. | `span.eli-select__value` |
| Arrow | 옵션 목록의 펼침 방향을 표시해요. | `span.eli-select__arrow` |
| Menu | 선택 가능한 옵션 목록을 표시해요. | `div.eli-select__menu` |
| Option | 개별 선택 항목을 표시해요. | `MenuItem` 컴포넌트 |

### 2.2 요소 간 계층 관계

- 최상위 요소는 `div.eli-select`예요.
- Label과 Control은 최상위 요소 내부에 세로 방향으로 배치돼요.
- Control 내부에는 Trigger가 배치돼요.
- Trigger 내부에는 Value와 Arrow가 배치돼요.
- Menu는 옵션 목록이 열린 경우에만 렌더링돼요.
- Menu 내부에는 `options` 배열의 각 항목을 기반으로 MenuItem이 생성돼요.

### 2.3 필수 및 선택 요소

| 요소 | 구분 | 기준 |
| --- | --- | --- |
| Label | 선택 | 생략하면 기본값 `라벨`이 표시돼요. |
| Trigger | 필수 | 선택 영역을 구성하는 버튼이에요. |
| Value | 필수 | 선택값 또는 Placeholder를 표시해요. |
| Arrow | 필수 | 펼침 방향을 표시하는 아이콘이에요. |
| Menu | 조건부 | 옵션 목록이 열린 경우에만 표시돼요. |
| Option | 필수 데이터 | `options`에 전달된 항목을 기반으로 생성돼요. |
- Trigger와 Menu는 Control을 기준으로 배치돼요.
- Menu는 `position: absolute`와 `top: 100%`를 사용해 Trigger 아래에 표시돼요.
- Menu에는 `z-index: 1`이 적용돼요.
- Menu의 높이는 별도로 지정하지 않으며 옵션 개수에 따라 구성돼요.
- 전체 너비는 332px이며 부모 요소보다 커지지 않도록 `max-width: 100%`가 적용돼요.

## 03. 프로퍼티 (Properties)

### 3.1 Variant

별도의 Variant Props는 제공하지 않아요.

### 3.2 Size

별도의 Size Props는 제공하지 않아요.

- 전체 너비는 CSS에서 332px로 정의돼요.
- Trigger 높이는 54px로 고정돼요.
- 별도의 크기 변경 Props는 없어요.

### 3.3 State

별도의 State Props는 제공하지 않아요.

| 상태 | 구현 조건 | 시각적 표현 |
| --- | --- | --- |
| Default | 옵션 목록이 닫힌 상태 | 기본 테두리와 Placeholder 또는 선택값을 표시해요. |
| Hover | Trigger에 마우스를 올린 상태 | 테두리 색상이 Focus 색상으로 변경돼요. |
| Focus | Trigger에 키보드 포커스가 적용된 상태 | 테두리 색상이 Focus 색상으로 변경돼요. |
| Open | 옵션 목록이 열린 상태 | 테두리와 선택값 색상이 변경되고 Arrow가 180도 회전해요. |
| Selected | 옵션이 선택된 상태 | 선택한 옵션의 Label을 표시해요. |
- Open 여부는 내부 상태 `isOpen`으로 관리해요.
- 선택값은 `value` 또는 내부 상태 `internalValue`를 기준으로 결정해요.
- Hover와 Focus는 CSS로 처리해요.
- Selected는 별도의 시각적 State Props가 아니라 선택된 옵션의 값에 따라 표시돼요.

### 3.4 주요 Props

| Prop | 타입 | 기본값 | 필수 여부 | 설명 |
| --- | --- | --- | --- | --- |
| `label` | `ReactNode` | `'라벨'` | 선택 | 선택 영역 위에 표시할 이름이에요. |
| `placeholder` | `ReactNode` | `'선택해주세요.'` | 선택 | 선택 전 표시할 안내 문구예요. |
| `options` | `readonly SelectOption[]` | - | 필수 | 선택 목록에 표시할 옵션 배열이에요. |
| `value` | `string` | - | 선택 | 외부에서 제어하는 선택값이에요. |
| `defaultValue` | `string` | - | 선택 | 비제어 방식에서 초기 선택값을 지정해요. |
| `onValueChange` | `(value: string) => void` | - | 선택 | 옵션 선택 시 선택한 `value`를 전달하는 함수예요. |
| `className` | `string` | - | 선택 | 최상위 `div`에 적용할 클래스 이름이에요. |

### 3.5 SelectOption 타입

`options`는 `SelectOption` 객체의 배열로 전달해요.

| 속성 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | 필수 | 옵션을 식별하고 선택값으로 사용하는 문자열이에요. |
| `label` | `ReactNode` | 필수 | 옵션 목록과 선택 영역에 표시할 내용이에요. |
- 각 옵션의 `value`는 중복되지 않아야 해요.
- `label`은 ReactNode 타입이므로 문자열 외에도 React 요소를 전달할 수 있어요.
- 선택 영역에는 선택된 옵션의 `label`이 표시돼요.
- 옵션 목록에는 각 옵션의 `label`이 표시돼요.

### 3.6 HTML 속성 상속

Select는 `HTMLAttributes<HTMLDivElement>`를 상속해 일반적인 HTML `div` 속성을 사용할 수 있어요.

단, `children`, `defaultValue`, `onChange`는 상속 대상에서 제외돼요.

| 속성 | 설명 |
| --- | --- |
| `id` | 최상위 요소의 식별자를 지정해요. |
| `style` | 최상위 요소의 인라인 스타일을 지정해요. |
| `onBlur` | Select 영역에서 포커스가 벗어날 때 실행할 함수를 지정해요. |
| `onKeyDown` | Select 영역에서 키보드 입력이 발생할 때 실행할 함수를 지정해요. |
| `aria-*` | 최상위 요소에 접근성 관련 속성을 전달할 수 있어요. |

그 외에도 상속된 HTML `div` 속성을 사용할 수 있어요.

### 3.7 Props 조합 및 적용 기준

- `value`를 전달하면 외부에서 선택값을 제어하는 방식으로 동작해요.
- `value`가 `undefined`이면 내부 상태 `internalValue`를 선택값으로 사용해요.
- `defaultValue`는 내부 상태의 초기값으로 사용돼요.
- `value`와 `defaultValue`를 함께 전달하는 방식은 권장하지 않아요.
- `value`가 전달된 상태에서는 옵션 선택 시 내부 선택값을 변경하지 않고 `onValueChange`만 호출해요. 외부에서 `value`를 갱신해야 선택 결과가 반영돼요.
- `onValueChange`는 선택한 옵션의 `value`를 인자로 전달해요.
- `className`은 Trigger나 Menu가 아닌 최상위 `div`에 적용돼요.
- `onBlur`와 `onKeyDown`은 내부 인터랙션 처리와 함께 호출돼요.

## 04. 인터랙션 규칙 (Interaction)

### 4.1 Trigger 동작

| 사용자 행동 | 구현 결과 |
| --- | --- |
| Trigger 클릭 | 옵션 목록을 열어요. |
| 열린 상태에서 Trigger 클릭 | 옵션 목록을 닫아요. |
| Hover | Trigger 테두리 색상이 변경돼요. |
| Focus | Trigger 테두리 색상이 변경돼요. |
- Trigger는 HTML `button` 요소로 구현돼요.
- 클릭할 때 내부 상태 `isOpen`을 반전시켜 목록을 열고 닫아요.
- Trigger에는 `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-labelledby`가 적용돼요.

### 4.2 Option 선택 동작

| 사용자 행동 | 구현 결과 |
| --- | --- |
| 옵션 클릭 | 해당 옵션의 `value`를 선택값으로 처리해요. |
| 옵션 선택 완료 | 옵션 목록을 닫아요. |
| 옵션 선택 완료 | Trigger로 포커스를 이동해요. |
| 옵션 선택 완료 | `onValueChange`에 선택한 `value`를 전달해요. |
- 각 옵션은 `MenuItem` 컴포넌트로 렌더링돼요.
- 옵션에는 `role="option"`과 `aria-selected`가 적용돼요.
- 현재 선택된 옵션의 `aria-selected`는 `true`로 설정돼요.
- 옵션을 선택하면 목록을 닫고 Trigger로 포커스를 되돌려요.
- 옵션에 아이콘이나 단축키 안내를 전달하는 별도 Props는 Select에서 제공하지 않아요.

### 4.3 키보드 인터랙션

| 키보드 입력 | 조건 | 구현 결과 |
| --- | --- | --- |
| `ArrowDown` | 목록이 닫힌 상태 | 목록을 열고 첫 번째 옵션으로 포커스를 이동해요. |
| `ArrowDown` | 목록이 열린 상태 | 다음 옵션으로 포커스를 이동해요. |
| `ArrowUp` | 목록이 닫힌 상태 | 목록을 열고 마지막 옵션으로 포커스를 이동해요. |
| `ArrowUp` | 목록이 열린 상태 | 이전 옵션으로 포커스를 이동해요. |
| `Home` | 목록이 열린 상태 | 첫 번째 옵션으로 포커스를 이동해요. |
| `End` | 목록이 열린 상태 | 마지막 옵션으로 포커스를 이동해요. |
| `Escape` | 목록이 열린 상태 | 목록을 닫고 Trigger로 포커스를 이동해요. |
- 옵션 이동은 Menu 내부의 `role="option"` 요소를 조회해 처리해요.
- 다음 또는 이전 옵션으로 이동할 때 목록의 첫 번째와 마지막 항목을 넘어 순환하지 않고 해당 끝에서 이동을 멈춰요.
- 목록이 비어 있으면 옵션 포커스 이동을 수행하지 않아요.
- Enter와 Space는 별도 키 이벤트 로직을 구현하지 않고 Trigger와 MenuItem의 기본 버튼 동작을 사용해요.

### 4.4 Focus 및 Blur 동작

- Select 영역에서 포커스가 완전히 벗어나면 옵션 목록을 닫아요.
- Select 내부의 다른 요소로 포커스가 이동하는 경우에는 목록을 닫지 않아요.
- `onBlur`가 전달돼 있다면 내부 Blur 처리와 함께 호출돼요.
- `onKeyDown`이 전달돼 있다면 내부 키보드 처리보다 먼저 호출돼요.
- 외부 `onKeyDown`에서 `event.preventDefault()`를 실행하면 Select의 내부 키보드 처리는 중단돼요.

### 4.5 예외 상황 및 제한 사항

- `options`는 필수 Props이므로 옵션 배열을 전달해야 해요.
- 각 옵션의 `value`는 고유해야 해요.
- 선택값과 일치하는 옵션이 없으면 선택 영역에는 Placeholder가 표시돼요.
- 옵션이 비어 있으면 펼쳐지는 목록에 선택 항목이 표시되지 않아요.
- 옵션 목록 외부 클릭을 별도로 감지하는 로직은 없어요. Select 영역에서 포커스가 벗어나는 Blur 동작으로 목록을 닫아요.
- 검색, 다중 선택, 옵션별 비활성화, 옵션별 아이콘 및 단축키 표시 기능은 Select 구현에서 제공하지 않아요.
- 옵션 목록의 높이 제한이나 내부 스크롤 높이는 별도로 지정돼 있지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### 5.1 Do

- 정해진 선택지 중 하나를 선택해야 하는 경우 사용해요.
- 각 옵션의 `value`와 `label`을 명확하게 구분해 작성해요.
- 선택 영역의 목적을 알 수 있도록 Label을 제공해요.
- 선택 전 사용자에게 안내가 필요하다면 Placeholder를 작성해요.
- 외부에서 선택값을 관리해야 한다면 `value`와 `onValueChange`를 함께 사용해요.
- 내부에서 초기 선택값을 설정하고 이후 선택 상태를 관리하려면 `defaultValue`를 사용해요.

### 5.2 Don't

- 여러 항목을 동시에 선택해야 하는 상황에 사용하지 않아요.
- 옵션이 많아 검색이나 필터링이 필요한 상황에 무리하게 사용하지 않아요.
- 옵션의 `value`를 중복해서 지정하지 않아요.
- `value`를 전달한 상태에서 `onValueChange`만으로 선택값이 자동 변경된다고 가정하지 않아요.
- 옵션에 아이콘이나 단축키 안내를 표시할 수 있다고 가정하지 않아요.

### 5.3 Alternative

- 여러 항목을 동시에 선택해야 한다면 Checkbox 등 다중 선택 컴포넌트를 사용해요.
- 선택지가 적고 모든 항목을 한눈에 보여주는 것이 중요하다면 Radio Group을 고려해요.
- 선택 조건을 설정하고 별도의 바텀시트나 모달을 열어야 하는 경우에는 Filter Chip과 같은 트리거형 컴포넌트를 고려해요.

### 5.4 Reason

Select는 클릭 시 컴포넌트 바로 아래에 옵션 목록을 펼치고, 하나의 옵션을 선택하는 입력 컴포넌트예요. 선택 영역과 옵션 목록이 하나의 컴포넌트 안에서 연결되므로 단일 선택에 적합해요.

Filter Chip은 Select와 달리 별도의 바텀시트나 모달을 여는 트리거로 사용되므로 두 컴포넌트의 역할을 구분해야 해요.

## 06. 추천 조합 (Composition)

### 6.1 Select + Button

**조합이 필요한 상황**

사용자가 옵션을 선택한 후 해당 선택값을 기준으로 검색하거나 다음 작업을 실행하는 UI를 구성할 때 사용해요.

| 컴포넌트 | 역할 | 관계 |
| --- | --- | --- |
| Select | 미리 정의된 옵션 중 하나를 선택받아요. | 조건 입력 영역 |
| Button | 선택된 값을 기준으로 작업을 실행해요. | 실행 영역 |

**조합 시 동작 규칙**

- Select의 `onValueChange`로 선택값을 전달받아요.
- 전달받은 선택값을 기준으로 Button의 실행 동작을 처리해요.
- Button 클릭 시 선택값을 검색, 조회 또는 제출에 활용해요.
- 선택값의 유효성 검사와 실행 조건은 조합을 사용하는 측에서 관리해요.

### 6.2 Select + TextField

**조합이 필요한 상황**

선택한 분류나 유형에 따라 추가 입력값을 받는 UI를 구성할 때 사용해요.

| 컴포넌트 | 역할 | 관계 |
| --- | --- | --- |
| Select | 입력할 정보의 분류나 유형을 선택받아요. | 조건 선택 영역 |
| TextField | 선택한 유형에 해당하는 세부 정보를 입력받아요. | 추가 입력 영역 |

**조합 시 동작 규칙**

- Select에서 선택한 값을 기준으로 TextField의 입력 목적을 구성해요.
- 필요한 경우 선택값에 따라 TextField의 Label이나 안내 문구를 변경할 수 있어요.
- 두 컴포넌트의 값과 표시 조건은 조합을 사용하는 측에서 관리해요.

※ 위 조합은 사용 패턴을 설명하며, Select 자체가 Button 또는 TextField와의 데이터 연결 기능을 제공하는 것은 아니에요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 | 설명 |
| --- | --- | --- |
| Component | `packages/ui/src/select/Select/Select.tsx` | Select의 JSX 구조, 옵션 렌더링 및 MenuItem 연결 |
| Props Type | `packages/ui/src/select/Select/Select.types.ts` | SelectProps 및 SelectOption 타입 정의 |
| CSS | `packages/ui/src/select/Select/Select.css` | 선택 영역, Trigger, Arrow, Menu의 크기와 시각적 스타일 |
| Hook | `packages/ui/src/select/Select/useSelect.ts` | 선택값, 목록 열림 상태, 키보드 및 포커스 인터랙션 관리 |
| Storybook | `apps/storybook/stories/Select.stories.tsx` | Select의 기본 사용 예시, 선택 전·후 상태 및 옵션 편집 Playground |
| Storybook CSS | `apps/storybook/stories/Select.stories.css` | Storybook Playground의 미리보기 및 옵션 편집 영역 스타일 |