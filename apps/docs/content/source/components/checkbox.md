# 체크박스

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Checkbox는 사용자가 개별 항목을 선택하거나 해제할 수 있도록 제공하는 체크박스 컴포넌트예요.

- 여러 항목 중 하나 이상을 선택해야 하는 UI에 사용해요.
- 선택 여부가 서로 독립적인 항목을 표현할 때 적합해요.
- 약관 동의, 관심 항목 선택, 필터 조건 설정 등 다중 선택이 가능한 상황에 사용해요.
- 하나의 항목만 선택할 수 있어야 한다면 Radio를 사용해요.

## 02. 컴포넌트 구조 (Structure)

### 2.1 구성 요소

Checkbox는 실제 입력을 처리하는 Input과 선택 상태를 시각적으로 표시하는 Icon으로 구성돼요.

| 요소 | 역할 | 구현 요소 |
| --- | --- | --- |
| Container | Checkbox의 구성 요소를 감싸요. | `span.eli-checkbox` |
| Input | 선택 및 해제 상태를 처리해요. | `input.eli-checkbox__input` |
| Icon | 선택 상태에서 체크 아이콘을 표시해요. | `span.eli-checkbox__icon` |

### 2.2 요소 간 계층 관계

- 최상위 요소는 `span.eli-checkbox`예요.
- Container 내부에 실제 입력을 담당하는 `input` 요소가 배치돼요.
- Input 다음에 체크 아이콘을 표시하는 `span`이 배치돼요.
- 체크 아이콘은 `CheckIcon` 컴포넌트를 사용해요.
- 체크 아이콘의 `span`에는 `aria-hidden="true"`가 적용돼요.
- 별도의 Label 요소는 포함하지 않아요.

### 2.3 필수 및 선택 요소

| 요소 | 구분 | 기준 |
| --- | --- | --- |
| Container | 필수 | Checkbox의 전체 영역을 감싸요. |
| Input | 필수 | 실제 선택 및 해제 동작을 처리해요. |
| Icon | 필수 | 선택 상태에서 체크 표시를 나타내요. |
| Label | 미포함 | 설명 텍스트는 Checkbox 외부에서 구성해야 해요. |

## 03. 프로퍼티 (Properties)

### 3.1 Variant

별도의 Variant Props는 제공하지 않아요.

### 3.2 Size

별도의 Size Props는 제공하지 않아요.

- Checkbox의 너비와 높이는 CSS에서 각각 24px로 정의돼요.
- 별도의 크기 변경 Props는 없어요.

### 3.3 State

Checkbox는 선택 여부에 따라 두 가지 상태로 구분돼요.

| 상태 | 조건 | 구현 결과 |
| --- | --- | --- |
| Unchecked | `checked={false}` 또는 선택되지 않은 상태 | 기본 배경과 테두리를 표시해요. 체크 아이콘은 숨겨요. |
| Checked | `checked={true}` 또는 선택된 상태 | 배경과 테두리를 브랜드 색상으로 변경하고 체크 아이콘을 표시해요. |
| Disabled | `disabled={true}` | 실제 Input의 선택 및 해제 동작을 비활성화해요. |
- 선택 상태는 HTML Input의 `checked` 상태를 기준으로 표현해요.
- Checked 상태에서는 `:checked` 선택자를 통해 배경과 테두리 색상을 변경해요.
- 체크 아이콘은 Input이 Checked 상태일 때 표시돼요.
- Disabled는 HTML Input의 기본 속성으로 처리하며 별도의 비활성화 시각 스타일은 CSS에 정의돼 있지 않아요.
- Hover, Focus에 따른 별도 시각 상태 스타일은 구현돼 있지 않아요.

### 3.4 주요 Props

| Prop | 타입 | 기본값 | 필수 여부 | 설명 |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | - | 선택 | 외부에서 제어하는 선택 상태예요. |
| `defaultChecked` | `boolean` | `false` | 선택 | 비제어 방식에서 처음 표시할 선택 상태예요. |
| `disabled` | `boolean` | `false` | 선택 | 선택 및 해제 동작을 비활성화해요. |
| `className` | `string` | - | 선택 | 최상위 Container에 적용할 클래스 이름이에요. |

### 3.5 HTML Input 속성

Checkbox는 `InputHTMLAttributes<HTMLInputElement>`를 상속해 표준 HTML Input 속성을 사용할 수 있어요.

단, `type`은 상속 대상에서 제외돼요. Checkbox 내부에서 `type="checkbox"`를 고정해 사용하기 때문이에요.

| 속성 | 설명 |
| --- | --- |
| `onChange` | 선택 상태가 변경될 때 실행할 함수를 지정해요. |
| `value` | 체크박스에 해당하는 값을 지정해요. |
| `name` | 체크박스의 이름을 지정해요. |
| `id` | 입력 요소의 식별자를 지정해요. |
| `required` | 필수 선택 여부를 지정해요. |
| `aria-label` | 별도 Label이 없을 때 입력 요소의 목적을 전달해요. |
| `aria-labelledby` | 외부 요소를 통해 입력 요소의 이름을 지정해요. |
| `style` | 최상위 Container에 적용할 인라인 스타일이에요. |

그 외에도 상속된 HTML Input 속성을 사용할 수 있어요.

### 3.6 Props 조합 및 선택 상태 관리

Checkbox는 `checked` 또는 `defaultChecked`를 사용해 선택 상태를 관리해요.

| 사용 방식 | Props | 상태 관리 주체 | 동작 |
| --- | --- | --- | --- |
| 제어 컴포넌트 | `checked`, `onChange` | 외부 | 외부에서 `checked` 값을 변경해야 선택 상태가 반영돼요. |
| 비제어 컴포넌트 | `defaultChecked` | Input 내부 | 최초 선택 상태를 지정하고 이후 상태 변경은 Input이 관리해요. |
- `checked`를 전달하면 외부에서 선택 상태를 제어해요.
- 제어 방식에서는 `onChange`를 통해 변경된 상태를 전달받고 외부에서 `checked` 값을 갱신해야 해요.
- `defaultChecked`는 최초 선택 상태만 지정해요. 이후 변경된 상태는 내부에서 관리해요.
- `checked`와 `defaultChecked`를 동시에 사용하는 방식은 피해야 해요.
- `onChange`는 React의 HTML Input 변경 이벤트를 전달해요. 변경된 선택 여부는 이벤트의 `target.checked`로 확인할 수 있어요.
- `value`는 체크박스의 선택 상태가 아니라 해당 항목의 값을 지정하는 HTML 속성이에요.
- `className`과 `style`은 실제 Input이 아닌 최상위 Container에 적용돼요.

## 04. 인터랙션 규칙 (Interaction)

### 4.1 선택 및 해제 동작

| 사용자 행동 | 구현 결과 |
| --- | --- |
| 체크박스 선택 | `checked` 상태가 `true`로 변경돼요. |
| 선택된 체크박스 클릭 | `checked` 상태가 `false`로 변경돼요. |
| 선택 상태 변경 | `onChange` 이벤트가 실행돼요. |
| 비활성화된 체크박스 클릭 | 선택 상태가 변경되지 않아요. |
- 실제 선택 및 해제 동작은 HTML Input의 기본 Checkbox 동작을 사용해요.
- 선택 상태가 변경되면 `onChange`가 호출돼요.
- 선택 여부에 따라 체크 아이콘의 표시 여부와 배경 및 테두리 색상이 변경돼요.

### 4.2 다중 선택 규칙

Checkbox는 개별 항목의 선택 상태를 관리하는 컴포넌트예요. 여러 개의 Checkbox를 함께 배치하면 다중 선택 UI를 구성할 수 있어요.

| 구분 | 선택 상태 관리 기준 |
| --- | --- |
| 개별 선택 | 각 Checkbox가 독립적인 선택 상태를 가져요. |
| 복수 항목 선택 | 여러 Checkbox를 동시에 선택할 수 있어요. |
| 개별 해제 | 선택된 Checkbox 하나만 해제할 수 있어요. |
| 전체 선택 | 그룹에 포함된 Checkbox의 선택 상태를 외부에서 일괄 변경해야 해요. |
| 선택 개수 제한 | 선택 가능한 개수를 외부 로직으로 관리해야 해요. |
| 상호 배타적 선택 | 하나를 선택하면 나머지를 해제하는 규칙은 별도로 구현해야 해요. |
- Checkbox 자체에는 여러 항목의 선택값을 배열로 관리하는 기능이 없어요.
- Checkbox 그룹의 전체 선택 상태나 선택 개수는 사용하는 측에서 관리해야 해요.
- 각 항목의 `checked` 상태를 개별적으로 전달하거나, 외부 상태를 기준으로 제어할 수 있어요.
- `value`는 개별 항목을 식별하는 값으로 활용할 수 있지만, 선택된 값의 배열을 자동으로 생성하거나 관리하지는 않아요.
- 여러 항목의 선택 상태를 동기화하려면 외부에서 선택값을 관리하고 각 Checkbox의 `checked`와 `onChange`를 연결해야 해요.

### 4.3 Disabled 동작

- `disabled={true}`를 전달하면 실제 Input에 `disabled` 속성이 적용돼요.
- 비활성화된 Checkbox는 사용자의 클릭으로 선택 상태를 변경할 수 없어요.
- 이미 선택된 상태에서 Disabled가 적용되면 선택 상태는 유지돼요.
- Disabled 상태의 별도 배경색이나 테두리 색상은 CSS에 정의돼 있지 않아요.

### 4.4 예외 상황 및 제한 사항

- Checkbox에는 `state` Props가 없어요.
- Error, Success, Indeterminate 상태를 별도 Props로 제공하지 않아요.
- 전체 선택과 부분 선택 상태를 자동으로 계산하지 않아요.
- 선택 개수 제한이나 최소·최대 선택 조건을 자체적으로 처리하지 않아요.
- Checkbox 그룹을 위한 별도 Group 컴포넌트는 포함돼 있지 않아요.
- Label은 내부에 포함되지 않으므로 접근 가능한 이름을 제공하려면 `aria-label`, `aria-labelledby` 또는 외부 Label 연결을 구성해야 해요.

## 05. 사용 가이드 (Usage Guidelines)

### 5.1 Do

- 여러 항목을 동시에 선택할 수 있는 상황에 사용해요.
- 각 항목의 선택 여부가 서로 독립적일 때 사용해요.
- 여러 Checkbox를 그룹으로 구성할 때 각 항목의 `value`를 구분해요.
- 그룹의 선택값을 관리해야 한다면 외부 상태로 선택된 항목을 관리해요.
- 체크박스의 목적을 알 수 있도록 외부 Label이나 접근성 이름을 제공해요.
- 선택 가능한 개수에 제한이 있다면 외부 로직으로 제어해요.

### 5.2 Don't

- 하나의 항목만 선택할 수 있는 상황에 Checkbox를 사용하지 않아요.
- 여러 Checkbox를 배치했다는 이유만으로 선택값이 자동으로 그룹화된다고 가정하지 않아요.
- `value`가 선택 상태를 나타내는 값이라고 간주하지 않아요.
- `checked`를 전달한 상태에서 외부 상태를 갱신하지 않고 선택 상태가 자동으로 변경된다고 기대하지 않아요.
- Checkbox에 Indeterminate 상태나 전체 선택 기능이 내장돼 있다고 가정하지 않아요.

### 5.3 Alternative

- 여러 항목 중 하나만 선택해야 한다면 Radio를 사용해요.
- 선택 가능한 항목이 많고 검색이나 필터링이 필요하다면 Select 등 적합한 선택 컴포넌트를 고려해요.
- 전체 선택과 부분 선택 상태를 표현해야 한다면 해당 상태를 관리하는 별도 로직과 시각적 표현을 구성해야 해요.

### 5.4 Reason

Checkbox는 각 항목의 선택 여부를 독립적으로 관리하는 컴포넌트예요. 따라서 여러 항목을 동시에 선택할 수 있는 상황에 적합해요.

반면 하나의 항목만 선택할 수 있어야 하는 경우에는 Radio를 사용해야 해요. 전체 선택, 선택 개수 제한, 부분 선택과 같은 그룹 단위의 규칙은 Checkbox 자체의 기능이 아니므로 사용하는 측에서 관리해야 해요.

## 06. 추천 조합 (Composition)

### 6.1 Checkbox + Label

**조합이 필요한 상황**

Checkbox의 선택 대상과 의미를 텍스트로 전달해야 할 때 사용해요.

| 구성 요소 | 역할 | 관계 |
| --- | --- | --- |
| Checkbox | 항목의 선택 및 해제 상태를 처리해요. | 선택 입력 |
| Label | 선택 항목의 의미를 설명해요. | 입력 설명 |

**조합 시 동작 규칙**

- Checkbox와 설명 텍스트를 하나의 항목으로 배치해요.
- 외부 Label을 사용하는 경우 Checkbox의 `id`와 Label의 `htmlFor`를 연결해요.
- Label을 클릭했을 때도 해당 Checkbox를 선택하거나 해제할 수 있도록 구성해요.

### 6.2 Checkbox Group

**조합이 필요한 상황**

여러 항목 중 하나 이상을 선택할 수 있는 목록을 구성할 때 사용해요.

| 구성 요소 | 역할 | 관계 |
| --- | --- | --- |
| Checkbox | 개별 항목의 선택 및 해제를 처리해요. | 개별 선택 요소 |
| 외부 상태 관리 | 선택된 항목의 목록을 관리해요. | 그룹 선택 상태 |
| Label | 각 선택 항목의 의미를 설명해요. | 항목 설명 |

**조합 시 동작 규칙**

- 각 Checkbox에 고유한 `value`를 지정해요.
- 선택된 항목의 `value`를 외부 상태에서 배열로 관리해요.
- Checkbox의 `checked`는 해당 항목의 `value`가 선택 목록에 포함돼 있는지를 기준으로 지정해요.
- `onChange`에서 변경된 선택 여부를 확인해 선택 목록을 갱신해요.
- 선택 해제 시 해당 항목의 `value`를 선택 목록에서 제거해요.
- 전체 선택이나 선택 개수 제한이 필요하다면 그룹을 관리하는 측에서 별도로 처리해요.

### 6.3 Checkbox + Button

**조합이 필요한 상황**

여러 항목을 선택한 후 선택한 항목을 일괄 삭제하거나 제출하는 UI를 구성할 때 사용해요.

| 컴포넌트 | 역할 | 관계 |
| --- | --- | --- |
| Checkbox | 작업 대상을 선택해요. | 대상 선택 |
| Button | 선택된 대상에 작업을 실행해요. | 실행 |

**조합 시 동작 규칙**

- Checkbox 그룹의 선택값을 외부 상태로 관리해요.
- Button의 실행 동작은 외부 상태에 저장된 선택값을 기준으로 처리해요.
- 선택된 항목이 없을 때 Button을 비활성화하는 등의 조건은 사용하는 측에서 구현해요.

※ Checkbox 자체는 그룹 상태나 다른 컴포넌트와의 데이터 연결 기능을 제공하지 않아요. 조합에 필요한 상태 관리와 동작은 사용하는 측에서 구현해야 해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 | 설명 |
| --- | --- | --- |
| Component | `packages/ui/src/checkbox/Checkbox/Checkbox.tsx` | Checkbox의 JSX 구조와 Input 및 체크 아이콘 렌더링 |
| Props Type | `packages/ui/src/checkbox/Checkbox/Checkbox.types.ts` | CheckboxProps 정의 및 HTML Input 속성 상속 |
| CSS | `packages/ui/src/checkbox/Checkbox/Checkbox.css` | 기본 및 선택 상태의 크기, 배경, 테두리와 체크 아이콘 표시 |
| Storybook | `apps/storybook/stories/Checkbox.stories.tsx` | 선택 및 해제 상태와 직접 조작 가능한 Playground 예시 |