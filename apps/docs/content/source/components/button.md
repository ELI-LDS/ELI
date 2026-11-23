# 버튼

상태: 진행 중

## 1. 컴포넌트 용도

Button은 사용자가 텍스트로 표현된 행동을 실행할 수 있도록 제공하는 버튼 컴포넌트예요.

- 저장, 취소, 확인, 제출 등 사용자가 수행할 행동을 명확하게 전달할 때 사용해요.
- 텍스트와 함께 아이콘을 표시할 수 있어요.
- 아이콘만으로 동작을 충분히 설명할 수 있는 경우에는 `IconButton`을 사용해요.

## 2. 컴포넌트 구조

### 2.1. 기본 구조

```
Button
├── Root: button
│   ├── Icon Wrapper (Optional)
│   │   └── Icon
│   └── Text Wrapper
│       └── Children
```

- **Root**: 실제 HTML `button` 요소로, 버튼의 스타일과 인터랙션을 담당해요.
- **Icon Wrapper**: 아이콘을 표시하는 영역이에요. `icon` 값이 존재하면 렌더링돼요.
- **Text Wrapper**: `children`으로 전달된 내용을 표시해요.

### 2.2. 콘텐츠 구성

| 요소 | 필수 여부 | 설명 |
| --- | --- | --- |
| Icon | 선택 | 버튼 왼쪽에 표시되는 아이콘이에요. 기본값은 Plus 아이콘이며, `null`을 전달하면 표시하지 않아요. |
| Children | 선택 | 버튼에 표시할 텍스트 또는 ReactNode예요. 생략하면 `버튼`이 표시돼요. |

아이콘은 텍스트 앞에 배치돼요. 아이콘과 텍스트 사이에는 4px의 간격이 적용돼요.

별도의 Props를 전달하지 않으면 Plus 아이콘과 `버튼` 텍스트가 함께 표시돼요. 텍스트만 표시하려면 `icon={null}`을 전달해야 해요.

## 3. Properties

### 3.1. 주요 Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `'버튼'` | 버튼에 표시할 내용이에요. |
| `icon` | `ReactNode` | `<PlusIcon />` | 버튼 왼쪽에 표시할 아이콘이에요. `null`을 전달하면 숨겨요. |
| `size` | `ButtonSize` | `'large'` | 버튼 크기예요. |
| `variant` | `ButtonVariant` | `'solid'` | 버튼 형태예요. |
| `color` | `ButtonColor` | `'brand'` | 버튼 색상 조합이에요. |
| `disabled` | `boolean` | `false` | 버튼의 비활성화 여부를 지정해요. |
| `className` | `string` | - | 루트 버튼에 추가할 CSS 클래스예요. |
| `backgroundColor` | `CSSProperties['backgroundColor']` | - | 버튼 배경색을 직접 지정해요. |
| `width` | `CSSProperties['width']` | - | 버튼 너비를 지정해요. 숫자는 px 단위로 처리하고 CSS 문자열도 사용할 수 있어요. |
| `height` | `CSSProperties['height']` | - | 버튼 높이를 지정해요. 숫자는 px 단위로 처리하고 CSS 문자열도 사용할 수 있어요. |

### 3.2. HTML Button 속성

`ButtonProps`는 HTML `ButtonHTMLAttributes<HTMLButtonElement>`를 상속해요. 단, `children`과 `color`는 기본 HTML 속성에서 제외하고 ELI 자체 Props로 정의해요.

따라서 다음과 같은 HTML Button 속성을 추가로 사용할 수 있어요.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `ButtonHTMLAttributes<HTMLButtonElement>['type']` | `'button'` | HTML 버튼의 기본 동작 유형을 지정해요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | - | 버튼 클릭 시 실행할 이벤트 핸들러예요. |
| `style` | `CSSProperties` | - | 루트 버튼에 적용할 인라인 스타일이에요. |
| `onFocus` | `FocusEventHandler<HTMLButtonElement>` | - | 버튼에 포커스가 적용될 때 실행할 이벤트 핸들러예요. |
| `aria-label` | `string` | - | 버튼의 접근성 이름을 지정해요. |
| `title` | `string` | - | 버튼에 추가 설명을 제공해요. |

이외에도 HTML Button에서 지원하는 속성을 사용할 수 있어요.

### 3.3. Size

| Size | Height | Horizontal Padding | Icon Size |
| --- | --- | --- | --- |
| `large` | 48px | 16px | 24px |
| `medium` | 40px | 12px | 20px |
- `large`: 기본 크기예요.
- `medium`: 상대적으로 작은 크기예요.

현재 `large`, `medium` 두 가지 크기를 지원해요.

### 3.4. Variant

| Variant | Description |
| --- | --- |
| `solid` | 배경색이 적용되는 기본 형태예요. |
| `outline` | 테두리가 적용되고 배경색이 있는 형태예요. |
| `ghost` | 기본 상태에서 테두리와 배경색이 없는 형태예요. |

### 3.5. Color

| Color | Description |
| --- | --- |
| `brand` | 브랜드 컬러를 사용하는 조합이에요. |
| `neutral` | 중립 컬러를 사용하는 조합이에요. |

`color`와 `variant`는 서로 조합하여 사용해요.

| Color | Solid | Outline | Ghost |
| --- | --- | --- | --- |
| `brand` | 지원 | 지원 | 지원 |
| `neutral` | 지원 | 지원 | 지원 |

총 6가지 Color·Variant 조합을 지원해요.

#### 3.5.1. Color · Variant 추천 조합

Color와 Variant는 버튼의 시각적 강조 수준과 행동의 위계를 구분하기 위해 조합해요.

| Color | Variant | 추천 역할 | 사용 상황 |
| --- | --- | --- | --- |
| `brand` | `solid` | 주요 행동 | 화면에서 가장 중요하고 우선적으로 실행해야 하는 행동에 사용해요. |
| `brand` | `outline` | 보조 주요 행동 | 주요 행동과 관련 있지만 시각적 강조를 한 단계 낮춰야 하는 행동에 사용해요. |
| `brand` | `ghost` | 낮은 강조의 브랜드 행동 | 배경이나 테두리 없이 브랜드 컬러로 행동을 표현해야 하는 경우에 사용해요. |
| `neutral` | `solid` | 일반 보조 행동 | 주요 행동을 보조하면서도 버튼 영역을 명확하게 구분해야 하는 경우에 사용해요. |
| `neutral` | `outline` | 중립적인 보조 행동 | 주요 행동과 구분되는 취소, 닫기 등의 행동에 사용해요. |
| `neutral` | `ghost` | 최소 강조 행동 | 시각적 비중을 최소화해야 하는 부가 행동에 사용해요. |

**사용 원칙**

- 화면에서 가장 중요한 행동에는 `brand + solid`를 사용해요.
- 주요 행동을 보조하는 버튼은 중요도와 시각적 위계에 따라 `brand + outline` 또는 `neutral + solid`를 사용해요.
- `brand + ghost`는 브랜드 컬러를 유지하면서 시각적 강조를 낮춰야 하는 행동에 사용해요.
- `neutral`은 브랜드 컬러로 강조할 필요가 없는 일반적인 보조 행동에 사용해요.
- `ghost`는 주변 UI보다 시각적 강조를 낮춰야 하는 행동에 사용해요.
- 동일한 화면에서 여러 버튼이 같은 강조 수준을 가지지 않도록 행동의 중요도와 화면 전체의 시각적 위계를 함께 고려해요.

## 4. Interaction

### 4.1. 상태

Button은 CSS를 통해 다음 상태를 구현해요.

| State | Description |
| --- | --- |
| Default | 기본 스타일을 표시해요. |
| Hover | 마우스 포인터가 버튼 위에 있을 때 배경색 또는 테두리 색상이 변경돼요. |
| Pressed | 버튼을 누르고 있는 동안 배경색 또는 테두리 색상이 변경돼요. |
| Disabled | 비활성화 스타일이 적용되며 버튼을 클릭할 수 없어요. |

각 상태의 스타일은 `color`와 `variant` 조합에 따라 다르게 적용돼요.

### 4.2. 이벤트 처리

Button 자체에서 데이터 변경이나 화면 전환 로직을 처리하지는 않아요. 필요한 동작은 사용하는 쪽에서 `onClick` 등의 이벤트 핸들러를 전달하여 구현해요.

`type`은 HTML 버튼의 기본 동작을 결정해요. 별도로 지정하지 않으면 `'button'`으로 동작해요.

### 4.3. 지원하지 않는 상태

- **Focus**: 별도의 Focus Variant나 전용 Focus 스타일 규칙은 `Button.css`에 정의되어 있지 않아요. 기본 HTML 버튼의 포커스 동작과 별도 디자인 상태를 구분해야 해요.
- **Loading**: Loading 전용 Props나 상태 스타일은 구현되어 있지 않아요.

참고로 `neutral + outline`의 Pressed 상태에서 Focus 관련 토큰을 사용하지만, 이는 `:active`에 적용되는 스타일이에요. 별도의 `:focus` 스타일과는 구분해야 해요.

## 5. Usage Guidelines

### 5.1. Button과 IconButton 선택

- 버튼의 행동을 텍스트로 설명해야 한다면 `Button`을 사용해요.
- 익숙한 아이콘 하나만으로 동작을 명확하게 이해할 수 있다면 `IconButton`을 사용해요.
- 아이콘만 사용하는 `IconButton`에는 화면 낭독기가 읽을 수 있도록 `aria-label`을 전달해야 해요.

### 5.2. Size, Color, Variant 선택

- `large`는 기본 크기로 사용하고, 상대적으로 작은 버튼이 필요한 경우 `medium`을 사용해요.
- Color와 Variant는 3.5.1의 추천 조합을 기준으로 선택해요.
- 버튼의 중요도뿐 아니라 주변 UI와의 시각적 위계, 함께 배치되는 다른 버튼과의 관계를 고려해요.

### 5.3. 콘텐츠 작성

- 버튼 텍스트는 사용자가 실행할 행동을 명확하게 전달해야 해요.
- 아이콘은 텍스트의 의미를 보조하는 용도로 사용해요.
- 아이콘이 필요하지 않은 경우 `icon={null}`을 전달해요.

### 5.4. 크기 및 스타일 직접 지정

- `width`, `height`로 버튼의 너비와 높이를 직접 지정할 수 있어요.
- `backgroundColor`로 버튼 배경색을 직접 지정할 수 있어요.
- `className`으로 외부 CSS 클래스를 추가할 수 있어요.
- `style`로 인라인 스타일을 지정할 수 있어요.

`backgroundColor`, `width`, `height`는 `style`에 동일한 속성이 지정되어 있더라도 전용 Props의 값이 우선 적용돼요.

특히 `backgroundColor`는 모든 상태의 기본 배경 스타일보다 우선 적용돼요. 따라서 Hover, Pressed, Disabled 상태에서 배경색이 변경되어야 하는 경우에는 사용에 주의해야 해요.

## 6. Composition

Button은 다른 컴포넌트와 조합하여 특정 행동을 수행하는 UI를 구성할 수 있어요.

| Composition | 역할 |
| --- | --- |
| TextField + Button | 입력한 내용을 제출하거나 검색을 실행해요. |
| Modal + Button | 모달 내부에서 확인, 취소 등의 행동을 제공해요. |

조합 시 Button은 행동을 실행하는 역할을 담당해요. 실제 데이터 처리와 화면 상태 관리는 이를 사용하는 상위 컴포넌트에서 담당해요.

## 7. 구현 파일

| 구분 | 파일 경로 | 역할 |
| --- | --- | --- |
| Implementation | `packages/ui/src/button/Button/Button.tsx` | Button 렌더링 및 Props 처리 |
| Props | `packages/ui/src/button/Button/Button.types.ts` | Props 및 타입 정의 |
| Styles | `packages/ui/src/button/Button/Button.css` | 크기, 색상, 형태 및 상태 스타일 |
| Storybook | `apps/storybook/stories/Button.stories.tsx` | 디자인 조합 및 인터랙션 확인 |