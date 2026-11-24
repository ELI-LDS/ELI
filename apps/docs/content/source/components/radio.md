# 래디오

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Radio는 여러 선택지 중 하나만 선택해야 할 때 사용하는 입력 컴포넌트예요.

- 사용자가 하나의 선택지를 결정해야 하는 단일 선택 항목에 사용해요.
- 선택지가 서로 배타적인 경우에 적합해요.
- 같은 `name`을 가진 Radio를 하나의 그룹으로 구성해요.

## 02. 컴포넌트 구조 (Structure)

Radio는 바깥 `span`과 내부 네이티브 `input`으로 구성돼요.

- **Wrapper (`span`)**: Radio의 스타일과 외부 클래스를 적용하는 요소예요.
- **Input (`input[type="radio"]`)**: 실제 선택 상태와 입력 동작을 처리하는 요소예요.

Radio 자체에는 선택지 텍스트를 표시하는 라벨이 포함되어 있지 않아요. 선택지 설명은 외부의 `label` 요소나 접근성 속성으로 제공해야 해요.

## 03. 프로퍼티 (Properties)

### State

Radio의 시각적 상태는 선택 여부와 비활성화 여부에 따라 결정돼요.

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Unchecked | `checked`가 `false`인 상태 | 기본 배경과 테두리가 표시돼요. |
| Checked | `checked`가 `true`인 상태 | 기본 테두리가 제거되고 선택 상태 이미지가 배경으로 표시돼요. |
| Disabled | `disabled`가 `true`인 상태 | 커서가 `not-allowed`로 변경되고 사용자의 입력이 제한돼요. |

상태별 구현 규칙은 다음과 같아요.

- **Unchecked**: 기본 배경색과 테두리가 적용돼요.
- **Checked**: `state-on.svg` 이미지가 배경으로 표시돼요. 기본 테두리는 제거돼요.
- **Disabled**: 커서만 `not-allowed`로 변경돼요. 별도의 비활성화 배경색이나 테두리 색상은 지정되어 있지 않아요.
- **Checked + Disabled**: 선택 상태 이미지가 유지되며 커서만 `not-allowed`로 변경돼요.

Hover와 Focus에 대한 별도의 시각적 스타일은 구현되어 있지 않아요. 키보드 조작과 선택 동작은 네이티브 Radio의 동작을 따라요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | 필수 | Radio가 선택됐을 때 폼에 전달할 값이에요. |
| `name` | `string` | - | 같은 선택 그룹에 속한 Radio가 공유하는 이름이에요. |
| `checked` | `boolean` | - | 외부에서 선택 상태를 제어해요. |
| `defaultChecked` | `boolean` | `false` | 제어하지 않을 때 최초 선택 상태를 지정해요. |
| `disabled` | `boolean` | `false` | Radio의 입력을 비활성화해요. |
| `className` | `string` | - | 바깥 `span`에 적용할 클래스 이름이에요. |
| `style` | `CSSProperties` | - | 바깥 `span`에 인라인 스타일을 적용해요. |

그 외에도 `InputHTMLAttributes<HTMLInputElement>`를 상속하므로 `onChange`, `aria-label`, `aria-labelledby`, `required`, `id` 등 네이티브 input 속성을 전달할 수 있어요. 단, `type`은 내부에서 `radio`로 지정하므로 외부에서 변경할 수 없어요.

## 04. 인터랙션 규칙 (Interaction)

### 선택 동작

- 같은 `name`을 가진 Radio는 하나의 선택 그룹으로 동작해요.
- 그룹 내에서 다른 Radio를 선택하면 기존 선택은 해제되고 새로 선택한 항목이 선택돼요.
- 선택 상태가 변경되면 `onChange`가 실행돼요.
- `name`이 다르면 서로 다른 선택 그룹으로 동작해요.

### 상태 제어

Radio는 네이티브 input의 상태 제어 방식을 사용해요.

- **Uncontrolled**: `defaultChecked`로 최초 선택 상태를 지정해요. 이후 선택 변경은 브라우저가 관리해요.
- **Controlled**: `checked`와 `onChange`를 함께 사용해요. 선택 상태가 변경되면 외부에서 새로운 `checked` 값을 전달해야 해요.

`checked`와 `defaultChecked`를 동시에 사용하지 말고, 한 가지 제어 방식을 선택해요.

### Disabled

- `disabled`가 `true`이면 해당 Radio를 직접 선택할 수 없어요.
- 비활성화된 Radio는 폼 제출 시 값이 전달되지 않아요.
- 그룹 내 일부 항목만 비활성화할 수 있어요.
- Disabled 상태에서도 Checked 여부에 따른 표시 규칙은 유지돼요.

### 키보드 및 접근성

- 네이티브 Radio의 키보드 조작 방식을 지원해요.
- 선택지 설명은 `label` 요소로 연결하거나 `aria-label`, `aria-labelledby`를 제공해야 해요.
- 여러 Radio를 하나의 질문으로 묶을 때는 `fieldset`과 `legend`를 사용해 그룹의 맥락을 전달해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 하나의 항목만 선택할 수 있는 경우에 사용해요.
- 같은 선택 그룹에 속한 Radio에는 동일한 `name`을 지정해요.
- 각 Radio에 서로 다른 `value`를 지정해 선택 결과를 구분해요.
- 각 선택지에 사용자가 이해할 수 있는 텍스트 라벨을 제공해요.
- 선택지가 여러 개인 경우 `fieldset`과 `legend`로 질문과 선택지를 묶어요.
- 초기 선택 항목이 필요한 경우 `defaultChecked` 또는 `checked`를 사용해요.

### Don't

- 여러 항목을 동시에 선택할 수 있는 경우에 사용하지 않아요.
- 하나의 선택 그룹에 서로 다른 `name`을 지정하지 않아요.
- 선택지 설명 없이 Radio만 단독으로 배치하지 않아요.
- Disabled 상태를 단순히 선택 불가능한 상태로만 이해하고, 별도의 비활성화 시각 효과가 구현되어 있다고 가정하지 않아요.

### 대안

- 여러 항목을 동시에 선택할 수 있어야 한다면 `Checkbox`를 사용해요.
- 선택지가 많아 화면 공간을 절약해야 한다면 `Select`를 고려해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| Radio + Label | 개별 선택지 표시 | Radio는 선택을 처리하고 Label은 선택지의 의미를 전달해요. |
| Fieldset + Legend + Radio | 하나의 질문에 대한 선택지 구성 | Legend는 질문을, Radio 그룹은 선택 가능한 답변을 제공해요. |
| Radio + 설명 텍스트 | 선택지에 추가 설명이 필요한 경우 | Radio는 선택을 처리하고 설명 텍스트는 선택 기준이나 조건을 전달해요. |

하나의 질문에 해당하는 Radio는 같은 `name`으로 묶고, 선택지마다 고유한 `value`를 지정해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/radio/Radio/Radio.tsx` |
| Props Type | `packages/ui/src/radio/Radio/Radio.types.ts` |
| CSS | `packages/ui/src/radio/Radio/Radio.css` |
| State Image | `packages/ui/src/radio/Radio/state-on.svg` |
| Storybook | `apps/storybook/stories/Radio.stories.tsx` |
| Export | `packages/ui/src/radio/index.ts` |