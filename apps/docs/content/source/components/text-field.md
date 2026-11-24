# 텍스트 필드

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

`TextField`는 사용자가 한 줄의 텍스트를 입력하고 입력 결과 상태를 확인할 수 있도록 제공하는 컴포넌트예요.

- 이름, 이메일, 제목, 검색어 등 한 줄의 텍스트를 입력받을 때 사용해요.
- 회원가입, 정보 수정, 검색 등 입력 폼을 구성할 때 적합해요.
- 여러 줄의 텍스트를 입력받아야 하는 경우에는 `TextArea`를 사용해요.

## 02. 컴포넌트 구조 (Structure)

### 2.1 내부 구성 요소

| 구성 요소 | 역할 | 필수 여부 |
| --- | --- | --- |
| Label | 입력 항목의 이름을 표시해요. | 필수 |
| Input Container | Input과 X Icon을 감싸는 입력 영역이에요. | 필수 |
| Input | 사용자가 텍스트를 입력하는 영역이에요. | 필수 |
| X Icon | 입력 영역 오른쪽에 표시되는 아이콘이에요. | 필수 |

### 2.2 요소 간 계층 관계

- 바깥 Label 안에 입력 항목의 이름과 Input Container가 배치돼요.
- Input Container 안에는 Input과 X Icon이 배치돼요.
- Label은 `label` Props로 내용을 변경할 수 있으며, 생략하면 기본 문구인 `라벨`이 표시돼요.
- Input은 `placeholder` Props로 안내 문구를 변경할 수 있으며, 생략하면 `내용을 입력하세요`가 표시돼요.

## 03. 프로퍼티 (Properties)

### 3.1 Variant

별도의 Variant Props를 제공하지 않아요.

### 3.2 Size

별도의 Size Props를 제공하지 않아요.

### 3.3 State

`state` Props로 입력창의 시각적 상태를 지정해요.

| State | 설명 |
| --- | --- |
| `default` | 기본 입력 상태예요. |
| `error` | 입력 오류 상태를 표현해요. |
| `success` | 입력 성공 상태를 표현해요. |
| `disabled` | 입력할 수 없는 상태를 표현해요. |

기본값은 `default`예요. 네 가지 상태는 서로 중복되지 않아요.

### 3.4 주요 Props

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `'라벨'` | 입력창 위에 표시할 라벨을 지정해요. |
| `placeholder` | `string` | `'내용을 입력하세요'` | 입력값이 없을 때 표시할 안내 문구를 지정해요. |
| `state` | `TextFieldState` | `'default'` | 입력창의 시각적 상태를 지정해요. |
| `className` | `string` | - | 바깥 Label에 적용할 클래스 이름을 지정해요. |
| `style` | `CSSProperties` | - | 바깥 Label에 인라인 스타일을 적용해요. |

### 3.5 HTML Input 속성

`TextField`는 `InputHTMLAttributes<HTMLInputElement>`를 상속해 표준 HTML Input 속성을 사용할 수 있어요.

| 속성 | 설명 |
| --- | --- |
| `type` | 입력 유형을 지정해요. 기본값은 `text`예요. |
| `value` | 입력값을 지정해요. |
| `defaultValue` | 초기 입력값을 지정해요. |
| `onChange` | 입력값이 변경될 때 실행할 함수를 지정해요. |
| `name` | 입력 데이터의 이름을 지정해요. |
| `id` | Input 요소의 식별자를 지정해요. |
| `required` | 필수 입력 여부를 지정해요. |
| `readOnly` | 입력값을 읽기 전용으로 설정해요. |
| `aria-invalid` | 입력값의 유효성 상태를 접근성 속성으로 전달해요. |

`children`, `disabled`, `placeholder`는 상속 대상에서 제외돼요. `placeholder`는 별도 Props로 제공하고, 비활성화는 `state="disabled"`로 설정해요.

### 3.6 프로퍼티 조합 및 사용 조건

- `state`는 표준 HTML Input 속성과 함께 사용할 수 있어요.
- `state="disabled"`를 지정하면 실제 Input 요소에 `disabled`가 적용돼요. 별도의 `disabled` Props는 제공하지 않아요.
- `state="error"`를 지정하면 `aria-invalid`의 기본값이 `true`로 설정돼요. 단, `aria-invalid`를 직접 전달하면 전달한 값이 우선해요.
- `value`와 `defaultValue`는 각각 제어 컴포넌트와 비제어 컴포넌트 방식으로 사용할 수 있으며, 두 방식을 동시에 사용하지 않아요.
- `className`과 `style`은 실제 Input이 아닌 바깥 Label에 적용돼요.

## 04. 인터랙션 규칙 (Interaction)

### 4.1 사용자 행동에 따른 반응

| 상태 | 동작 및 표현 |
| --- | --- |
| Default | 기본 테두리와 배경색으로 표시돼요. |
| Hover | 입력 영역에 마우스를 올리면 테두리 색상이 변경돼요. |
| Focus | 입력 영역에 포커스가 적용되면 Placeholder 색상이 변경돼요. |
| Error | 입력 영역의 테두리가 오류 색상으로 변경돼요. |
| Success | 입력 영역의 테두리가 성공 색상으로 변경돼요. |
| Disabled | 입력이 비활성화되고 테두리와 배경색, 텍스트 색상이 변경돼요. |

Focus 상태에서는 Placeholder 색상만 변경되며, 별도의 테두리 Focus 스타일은 적용되지 않아요.

### 4.2 입력 및 상태 변화

- 사용자가 입력하면 표준 HTML Input의 입력 동작에 따라 값이 변경돼요.
- `onChange`를 전달하면 입력값이 변경될 때 해당 함수가 실행돼요.
- `state`는 Props로 전달한 값에 따라 결정되며, 입력 동작만으로 자동 변경되지 않아요.
- `error`와 `success`는 시각적 상태만 표현해요. 입력값 검증이나 상태 변경 로직은 포함하지 않아요.
- `disabled` 상태에서는 Input에 실제 `disabled` 속성이 적용돼 입력할 수 없어요.

### 4.3 예외 상황 및 제한 사항

- X Icon은 입력 영역 오른쪽에 표시되지만, 클릭 이벤트나 입력값 초기화 기능은 연결되어 있지 않아요.
- Error와 Success 상태를 표시하기 위한 별도의 검증 로직은 제공하지 않아요.
- Focus 상태에 별도의 테두리 스타일은 제공하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### 5.1 입력 유형에 따른 컴포넌트 선택

**Do**

- 한 줄의 텍스트를 입력받을 때 `TextField`를 사용해요.
- 여러 줄의 긴 텍스트를 입력받을 때 `TextArea`를 사용해요.

**Don't**

- 긴 설명이나 자기소개처럼 여러 줄 입력이 필요한 영역에 `TextField`를 사용하지 않아요.

**Alternative**

여러 줄 입력이 필요한 경우 `TextArea`를 사용해요.

**Reason**

`TextField`는 한 줄 입력을, `TextArea`는 여러 줄 입력을 담당해요.

### 5.2 Label과 Placeholder 사용

**Do**

- Label에는 입력해야 할 항목의 이름을 작성해요.
- Placeholder에는 입력 형식이나 작성 방법을 안내해요.
- 입력 항목을 명확하게 구분할 수 있도록 Label을 구체적으로 작성해요.

**Don't**

- Placeholder만으로 입력 항목의 의미를 전달하지 않아요.
- Label과 Placeholder에 동일한 문구를 반복하지 않아요.

**Alternative**

입력 항목의 목적은 Label로 전달하고, 추가 안내가 필요한 경우 Placeholder를 활용해요.

**Reason**

Label은 입력 항목의 목적을 알려주고, Placeholder는 입력 전에 필요한 추가 정보를 안내해요.

### 5.3 State 선택

**Do**

- 입력값 검증 결과에 따라 `error` 또는 `success`를 지정해요.
- 입력할 수 없는 상황에서는 `disabled`를 사용해요.
- 별도의 상태가 필요하지 않다면 기본값인 `default`를 사용해요.

**Don't**

- 실제 검증 결과와 관계없이 `error`나 `success`를 지정하지 않아요.
- 사용자가 입력할 수 있어야 하는 상황에서 `disabled`를 사용하지 않아요.

**Alternative**

입력값 검증과 상태 변경이 필요한 경우, 컴포넌트를 사용하는 측에서 검증 로직을 구현하고 결과에 따라 `state`를 전달해요.

**Reason**

TextField는 상태를 시각적으로 표현하는 역할을 담당하며, 입력값 검증은 컴포넌트 자체에서 수행하지 않아요.

## 06. 추천 조합 (Composition)

### 6.1 TextField + Button

**조합이 필요한 상황**

사용자가 입력한 값을 제출하거나 검색하는 폼을 구성할 때 사용해요.

| 컴포넌트 | 역할 |
| --- | --- |
| TextField | 사용자 입력을 받아요. |
| Button | 입력값 제출이나 검색을 실행해요. |

**조합 시 동작 규칙**

- TextField는 입력값을 받아요.
- Button은 입력값을 제출하거나 다음 동작을 실행해요.
- 입력값 검증과 제출 가능 여부는 조합을 사용하는 측에서 처리해요.

### 6.2 TextField + TextArea

**조합이 필요한 상황**

한 화면에서 짧은 정보와 긴 설명을 함께 입력받을 때 사용해요.

| 컴포넌트 | 역할 |
| --- | --- |
| TextField | 이름, 제목 등 한 줄의 정보를 입력받아요. |
| TextArea | 상세 설명 등 여러 줄의 정보를 입력받아요. |

**조합 시 동작 규칙**

- 입력할 내용의 형태에 따라 적절한 컴포넌트를 선택해요.
- 각 입력 영역에 명확한 Label을 제공해요.
- 입력값과 검증 상태는 각 컴포넌트에 개별적으로 전달해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 | 설명 |
| --- | --- | --- |
| Component | `packages/ui/src/text/TextField/TextField.tsx` | TextField 컴포넌트의 JSX 구조와 렌더링 로직 |
| Props Type | `packages/ui/src/text/TextField/TextField.types.ts` | Props 타입, 기본값 및 HTML Input 속성 상속 정의 |
| CSS | `packages/ui/src/text/TextField/TextField.css` | 입력 영역의 크기, 간격, 색상, 테두리 및 상태별 스타일 |
| Storybook | `apps/storybook/stories/TextField.stories.tsx` | 컴포넌트 사용 예시와 Props 및 상태별 표현 |