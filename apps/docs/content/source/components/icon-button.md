# 아이콘 버튼

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

IconButton은 아이콘 하나로 사용자의 행동을 실행하는 버튼 컴포넌트예요.

- 아이콘만으로 행동의 의미를 명확하게 전달할 수 있을 때 사용해요.
- 툴바, 카드, 목록, 헤더 등 제한된 공간에 부가 행동을 배치할 때 적합해요.
- 행동을 텍스트로 설명해야 하거나 아이콘만으로 의미를 파악하기 어렵다면 Button을 사용해요.

## 02. 컴포넌트 구조 (Structure)

IconButton은 HTML `button` 요소 안에 아이콘을 배치하는 구조예요.

- **Button Element**: 클릭과 키보드 입력을 처리하는 버튼 요소예요.
- **Icon**: 버튼이 실행하는 행동을 시각적으로 표현해요.

아이콘은 `icon` Props로 전달하며, 생략하면 기본 `PlusIcon`이 표시돼요. 별도의 텍스트 영역은 제공하지 않아요.

## 03. 프로퍼티 (Properties)

### Variant

버튼의 배경과 테두리 표현을 결정해요.

| 값 | 설명 |
| --- | --- |
| `solid` | 배경색이 있는 버튼이에요. |
| `outline` | 테두리와 배경색이 있는 버튼이에요. |

기본값은 `solid`예요.

### Color

버튼의 색상 계열을 결정해요.

| 값 | 설명 |
| --- | --- |
| `brand` | 브랜드 컬러를 사용하는 버튼이에요. |
| `neutral` | 중립 컬러를 사용하는 버튼이에요. |

기본값은 `brand`예요.

### Size

버튼과 아이콘의 크기를 결정해요.

| 값 | 버튼 크기 | 아이콘 영역 크기 |
| --- | --- | --- |
| `large` | 48 × 48px | 24 × 24px |
| `medium` | 40 × 40px | 20 × 20px |

기본값은 `large`예요.

### State

CSS에서 지원하는 버튼 상태예요.

| 상태 | 설명 |
| --- | --- |
| Default | 기본 상태예요. |
| Hover | 포인터가 버튼 위에 올라간 상태예요. |
| Pressed | 버튼을 누르고 있는 상태예요. |
| Disabled | 버튼을 사용할 수 없는 상태예요. |

### 기타 Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 화면 낭독기에 전달할 버튼의 행동 설명이에요. |
| `icon` | `ReactNode` | `PlusIcon` | 버튼에 표시할 아이콘이에요. |
| `disabled` | `boolean` | `false` | 버튼의 비활성화 여부를 지정해요. |
| `className` | `string` | - | 루트 `button` 요소에 추가할 CSS 클래스예요. |
| `type` | `button` | `submit` | `reset` | `button` | HTML 버튼의 동작 유형을 지정해요. |

그 외에 `onClick`, `style` 등 HTML `button` 요소의 속성을 사용할 수 있어요.

### 프로퍼티 조합

- `color`, `variant`, `size`는 각각 독립적으로 지정할 수 있어요.
- `color`와 `variant`의 조합에 따라 아이콘, 배경, 테두리 색상이 달라져요.
- 모든 `color`와 `variant` 조합에서 `large`, `medium` 크기를 사용할 수 있어요.
- `disabled`는 다른 Props와 함께 사용할 수 있어요.

## 04. 인터랙션 규칙 (Interaction)

### 사용자 입력 및 상태 변화

- 클릭하면 전달된 `onClick` 함수가 실행돼요.
- `type`이 `submit`이면 폼을 제출하고, `reset`이면 폼을 초기화해요.
- 포인터가 버튼 위에 올라가면 Hover 스타일이 적용돼요.
- 버튼을 누르고 있는 동안 Pressed 스타일이 적용돼요.
- `disabled`가 `true`이면 버튼을 클릭할 수 없으며 Disabled 스타일이 적용돼요.

### 상태별 스타일

상태별 배경색과 테두리 표현은 `color`와 `variant` 조합에 따라 달라져요.

- **Brand + Solid**: Hover와 Pressed 상태에서 브랜드 배경색이 변경돼요.
- **Brand + Outline**: Hover와 Pressed 상태에서 브랜드 계열의 배경색이 적용돼요.
- **Neutral + Solid**: Hover와 Pressed 상태에서 중립 배경색이 변경돼요.
- **Neutral + Outline**: Hover와 Pressed 상태에서 배경색과 테두리 색상이 변경돼요.
- **Disabled**: 각 조합에 해당하는 비활성화 색상이 적용돼요.

### 접근성

- `aria-label`은 필수 Props예요.
- `aria-label`에는 아이콘의 모양이 아니라 버튼을 눌렀을 때 실행되는 행동을 작성해요.
    - 적절한 예: `항목 추가`, `닫기`, `검색`
    - 부적절한 예: `플러스 아이콘`, `X 아이콘`

### 제한 사항

- CSS에 별도의 `:focus` 스타일 규칙은 구현되어 있지 않아요.
- 전용 Loading Props나 Loading 상태는 제공하지 않아요.
- 텍스트를 표시하는 구조는 제공하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 아이콘만으로 행동을 쉽게 이해할 수 있는 경우 사용해요.
- 추가, 삭제, 닫기, 검색, 더보기 등 행동의 의미가 명확한 아이콘을 사용해요.
- 모든 IconButton에 실제 행동을 설명하는 `aria-label`을 제공해요.
- 여러 IconButton을 함께 배치할 때 각 버튼의 기능을 명확하게 구분해요.

### Don't

- 아이콘만으로 행동을 이해하기 어려운 기능에 사용하지 않아요.
- 사용자가 행동의 의미를 추측해야 하는 상황에서 사용하지 않아요.
- 텍스트 설명이 필요한 주요 행동을 IconButton만으로 표현하지 않아요.
- 실제 동작 없이 장식 목적으로 사용하지 않아요.

### Alternative

- 행동을 텍스트로 명확하게 전달해야 한다면 Button을 사용해요.
- 아이콘과 텍스트를 함께 표시해야 한다면 Button을 사용해요.

### Reason

IconButton은 텍스트 없이 아이콘으로 행동을 전달하므로 공간을 효율적으로 사용할 수 있어요. 하지만 아이콘의 의미가 명확하지 않으면 사용자가 행동을 잘못 이해할 수 있어요. 따라서 아이콘만으로 의미를 전달할 수 있는 행동에 사용하고, 설명이 필요한 행동에는 텍스트를 제공해야 해요.

## 06. 추천 조합 (Composition)

### Button + IconButton

주요 행동과 보조 행동을 같은 영역에 배치할 때 함께 사용해요.

| 컴포넌트 | 역할 | 사용 예시 |
| --- | --- | --- |
| Button | 텍스트로 주요 행동을 전달해요. | 저장, 제출, 확인 |
| IconButton | 아이콘으로 보조 행동을 전달해요. | 더보기, 설정, 닫기 |

**사용 상황**

- 폼 하단에 `저장` Button과 `닫기` IconButton을 배치할 수 있어요.
- 카드 헤더에 제목과 `더보기` IconButton을 배치할 수 있어요.
- 편집 화면에 `게시` Button과 `설정` IconButton을 배치할 수 있어요.

**조합 규칙**

- 사용자가 수행해야 할 주요 행동은 Button으로 제공해요.
- 추가 메뉴나 설정 등 보조 행동은 IconButton으로 제공해요.
- 두 컴포넌트는 각각 독립적인 버튼으로 동작해요.
- IconButton에는 각 버튼의 행동을 설명하는 `aria-label`을 제공해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/button/IconButton/IconButton.tsx` |
| Props Type | `packages/ui/src/button/IconButton/IconButton.types.ts` |
| CSS | `packages/ui/src/button/IconButton/IconButton.css` |
| Storybook | `apps/storybook/stories/IconButton.stories.tsx` |