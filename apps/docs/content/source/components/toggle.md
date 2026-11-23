# 토글

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Toggle은 하나의 설정을 On 또는 Off로 전환하는 입력 컴포넌트예요.

- 알림 수신, 자동 저장, 다크 모드처럼 켜고 끌 수 있는 설정에 사용해요.
- 사용자가 설정을 변경하면 해당 상태가 즉시 적용되는 기능에 적합해요.
- 여러 선택지 중 하나를 고르는 것이 아니라, 하나의 기능을 활성화하거나 비활성화할 때 사용해요.

## 02. 컴포넌트 구조 (Structure)

Toggle은 네이티브 `button`과 내부 `span`으로 구성돼요.

- **Toggle (`button`)**: 클릭 입력을 처리하고 On/Off 상태를 전달해요. `role="switch"`와 `aria-checked`를 적용해 스위치의 접근성 의미를 제공해요.
- **Switch (`span`)**: 트랙 안에서 이동하는 원형 요소예요. 장식 요소이므로 `aria-hidden="true"`가 적용돼요.

Toggle 자체에는 설정 이름이나 설명을 표시하는 텍스트가 포함되어 있지 않아요. 어떤 기능을 제어하는지 별도의 텍스트와 접근성 이름으로 제공해야 해요.

## 03. 프로퍼티 (Properties)

### State

Toggle은 On/Off 상태와 Disabled 여부에 따라 동작해요.

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Off | `checked`가 `false`인 상태 | 기본 트랙 색상이 표시되고 내부 Switch가 왼쪽에 위치해요. |
| On | `checked`가 `true`인 상태 | 트랙이 브랜드 색상으로 변경되고 내부 Switch가 오른쪽으로 이동해요. |
| Off + Disabled | `disabled`가 `true`이고 선택되지 않은 상태 | Off 표시를 유지하며 사용자 입력을 제한해요. |
| On + Disabled | `disabled`가 `true`이고 선택된 상태 | On 표시를 유지하며 사용자 입력을 제한해요. |

상태별 구현 규칙은 다음과 같아요.

- **Off**: `data-state="off"`가 적용돼요. 기본 트랙 색상과 왼쪽 Switch 위치를 사용해요.
- **On**: `data-state="on"`이 적용돼요. 트랙 색상이 브랜드 색상으로 바뀌고 Switch가 오른쪽으로 이동해요.
- **Disabled**: 네이티브 `button`의 `disabled` 속성으로 입력을 제한해요. 별도의 Disabled 전용 색상이나 시각적 스타일은 구현되어 있지 않아요.
- **On + Disabled**: 선택 상태는 유지되지만 클릭으로 상태를 변경할 수 없어요.

On/Off 전환에는 트랙 색상과 Switch 위치의 애니메이션이 적용돼요. 사용자가 운영체제의 모션 감소 설정을 활성화하면 전환 시간을 최소화해요.

Hover와 Pressed에 대한 별도의 시각적 스타일은 구현되어 있지 않아요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `checked` | `boolean` | - | 외부에서 제어하는 On/Off 상태예요. |
| `defaultChecked` | `boolean` | `false` | 비제어 방식에서 최초 상태를 지정해요. |
| `onCheckedChange` | `(checked: boolean) => void` | - | 상태가 변경될 때 변경된 값을 전달하는 콜백이에요. |
| `disabled` | `boolean` | `false` | Toggle의 입력을 비활성화해요. |
| `type` | `ButtonHTMLAttributes`의 타입 | `button` | 내부 버튼의 타입을 지정해요. |
| `className` | `string` | - | 루트 `button`에 추가할 클래스 이름이에요. |
| `style` | `CSSProperties` | - | 루트 `button`에 인라인 스타일을 적용해요. |

그 외에도 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `aria-label`, `aria-labelledby`, `id` 등 일반적인 버튼 속성을 전달할 수 있어요. 단, `aria-checked`, `children`, `onChange`는 별도로 제외돼요.

`aria-label`과 `aria-labelledby`를 모두 전달하지 않으면 기본 접근성 이름으로 `토글`이 적용돼요. 실제 설정 이름을 전달하려면 둘 중 하나를 명시적으로 지정해야 해요.

## 04. 인터랙션 규칙 (Interaction)

### 상태 전환

- Off 상태에서 클릭하면 On으로 변경돼요.
- On 상태에서 클릭하면 Off로 변경돼요.
- 상태가 변경되면 `onCheckedChange`에 변경된 Boolean 값이 전달돼요.
- `disabled`가 `true`이면 클릭으로 상태를 변경할 수 없어요.

### 상태 제어

Toggle은 제어 방식에 따라 상태를 관리해요.

- **Uncontrolled**: `defaultChecked`로 최초 상태를 지정해요. 이후 클릭에 따른 상태 변경은 Toggle 내부에서 관리해요.
- **Controlled**: `checked`와 `onCheckedChange`를 함께 사용해요. 상태 변경 시 콜백으로 전달된 값을 외부 상태에 반영하고, 새로운 `checked` 값을 전달해야 화면에 변경된 상태가 표시돼요.

두 방식을 함께 사용하지 말고, 한 가지 제어 방식을 선택해요.

### 클릭 이벤트

Toggle의 클릭 처리 순서는 다음과 같아요.

1. 전달된 `onClick`을 먼저 실행해요.
2. `onClick`에서 `event.preventDefault()`가 호출되면 상태를 변경하지 않아요.
3. 기본 동작이 취소되지 않았다면 현재 상태의 반대 값을 계산해요.
4. 비제어 방식에서는 내부 상태를 변경하고, `onCheckedChange`가 전달되어 있다면 변경된 값을 호출해요.

`onClick`과 `onCheckedChange`는 역할이 달라요. 클릭 이벤트 자체를 처리하려면 `onClick`을, 실제 On/Off 변경을 감지하려면 `onCheckedChange`를 사용해요.

### 키보드 및 접근성

- 네이티브 버튼의 키보드 조작 방식을 지원해요.
- `role="switch"`와 `aria-checked`를 통해 화면 낭독기에 스위치 역할과 현재 상태를 전달해요.
- `aria-label` 또는 `aria-labelledby`로 어떤 설정을 제어하는지 명확하게 제공해야 해요.
- 비활성화 상태에서는 네이티브 `disabled` 속성이 적용돼요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 하나의 설정을 즉시 On/Off로 전환할 때 사용해요.
- Toggle 옆에 설정 이름을 배치해 어떤 기능을 제어하는지 명확하게 전달해요.
- 설정 변경 즉시 기능에 반영되는 경우에 사용해요.
- 외부에서 상태를 관리해야 한다면 `checked`와 `onCheckedChange`를 함께 사용해요.
- 별도의 초기 상태만 지정하면 되는 경우 `defaultChecked`를 사용해요.
- 접근성 이름에 실제 설정의 의미를 전달해요.

### Don't

- 여러 선택지 중 하나를 선택하는 용도로 사용하지 않아요.
- 변경 사항을 제출하거나 저장해야만 적용되는 설정에 무조건 사용하지 않아요.
- 설정 이름 없이 Toggle만 단독으로 배치하지 않아요.
- 색상만으로 On/Off 상태를 구분하지 않아요.
- Disabled 상태에 별도의 시각적 비활성화 스타일이 적용된다고 가정하지 않아요.

### 대안

- 여러 선택지 중 하나를 선택해야 한다면 `Radio`를 사용해요.
- 여러 항목을 각각 선택하거나 해제해야 한다면 `Checkbox`를 사용해요.
- 사용자가 선택한 뒤 별도의 제출이나 적용 과정을 거쳐야 한다면 `Checkbox` 등 선택형 입력 컴포넌트를 고려해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| Toggle + 설정 이름 | 개별 설정 변경 | 텍스트는 제어할 기능을 설명하고 Toggle은 활성화 여부를 변경해요. |
| Toggle + 설명 텍스트 | 설정에 추가 설명이 필요한 경우 | 설정 이름은 기능을 식별하고 설명은 변경 결과나 적용 범위를 안내해요. |
| Toggle + List Item | 여러 설정을 목록으로 제공하는 화면 | 각 목록 항목에 설정 이름과 Toggle을 배치해 독립적인 설정을 변경해요. |
| Toggle + Section Heading | 설정을 주제별로 분류하는 화면 | 제목으로 설정 영역을 구분하고 내부에 관련 Toggle을 배치해요. |

설정 이름과 Toggle은 하나의 제어 항목으로 인식되도록 배치해요. 설명이 필요한 경우에는 설정 이름과 설명을 함께 묶고 Toggle은 해당 항목의 오른쪽에 배치하는 구성이 적합해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/toggle/Toggle/Toggle.tsx` |
| Props Type | `packages/ui/src/toggle/Toggle/Toggle.types.ts` |
| State & Interaction | `packages/ui/src/toggle/Toggle/useToggle.ts` |
| CSS | `packages/ui/src/toggle/Toggle/Toggle.css` |
| Interaction CSS | `packages/ui/src/toggle/Toggle/Toggle.interaction.css` |
| Storybook | `apps/storybook/stories/Toggle.stories.tsx` |
| Export | `packages/ui/src/toggle/index.ts` |