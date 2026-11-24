# 텍스트 에리어

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

`TextArea`는 사용자가 여러 줄의 텍스트를 입력할 수 있도록 제공하는 컴포넌트예요.

- 자기소개, 상세 설명, 의견 등 여러 줄의 텍스트를 입력받을 때 사용해요.
- 입력 내용이 길거나 문장 형태의 응답이 필요한 폼을 구성할 때 적합해요.
- 이름, 제목 등 한 줄의 텍스트를 입력받아야 하는 경우에는 `TextField`를 사용해요.

## 02. 컴포넌트 구조 (Structure)

### 2.1 내부 구성 요소

| 구성 요소 | 역할 | 필수 여부 |
| --- | --- | --- |
| Label | 입력 영역의 이름을 표시해요. | 필수 |
| Textarea | 사용자가 여러 줄의 텍스트를 입력하는 영역이에요. | 필수 |

### 2.2 요소 간 계층 관계

- 바깥 Label 안에 입력 항목의 이름과 Textarea가 세로로 배치돼요.
- Label은 `label` Props로 내용을 변경할 수 있으며, 생략하면 기본 문구인 `라벨`이 표시돼요.
- Textarea는 `placeholder` Props로 안내 문구를 변경할 수 있으며, 생략하면 `내용을 입력하세요`가 표시돼요.
- 입력 영역은 기본 너비 323px, 최소 높이 129px로 구성되며, 부모 너비에 맞춰 최대 너비가 조정돼요.
- 입력 영역의 크기를 사용자가 직접 조절할 수 없도록 설정되어 있어요.

## 03. 프로퍼티 (Properties)

### 3.1 Variant

별도의 Variant Props를 제공하지 않아요.

### 3.2 Size

별도의 Size Props를 제공하지 않아요.

입력 영역의 기본 너비는 323px이며, 최소 높이는 129px이에요. 너비는 부모 영역을 초과하지 않도록 설정돼요.

### 3.3 State

별도의 `state` Props를 제공하지 않아요.

| 상태 | 설명 |
| --- | --- |
| Default | 기본 입력 상태예요. |
| Hover | 마우스를 올린 상태예요. |
| Focus | 입력 영역에 포커스가 적용된 상태예요. |
| Disabled | 입력할 수 없는 상태예요. |

### 3.4 주요 Props

| Prop | Type | Default | 설명 |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `'라벨'` | 입력 영역 위에 표시할 라벨을 지정해요. |
| `placeholder` | `string` | `'내용을 입력하세요'` | 입력값이 없을 때 표시할 안내 문구를 지정해요. |
| `disabled` | `boolean` | `false` | 입력 영역의 비활성화 여부를 지정해요. |
| `className` | `string` | - | 바깥 Label에 적용할 클래스 이름을 지정해요. |
| `style` | `CSSProperties` | - | 바깥 Label에 인라인 스타일을 적용해요. |

### 3.5 HTML Textarea 속성

`TextArea`는 `TextareaHTMLAttributes<HTMLTextAreaElement>`를 상속해 표준 HTML Textarea 속성을 사용할 수 있어요.

| 속성 | 설명 |
| --- | --- |
| `value` | 입력값을 지정해요. |
| `defaultValue` | 초기 입력값을 지정해요. |
| `onChange` | 입력값이 변경될 때 실행할 함수를 지정해요. |
| `name` | 입력 데이터의 이름을 지정해요. |
| `id` | Textarea 요소의 식별자를 지정해요. |
| `rows` | 입력 영역의 행 수를 지정해요. |
| `cols` | 입력 영역의 열 수를 지정해요. |
| `minLength` | 입력할 수 있는 최소 글자 수를 지정해요. |
| `maxLength` | 입력할 수 있는 최대 글자 수를 지정해요. |
| `required` | 필수 입력 여부를 지정해요. |
| `readOnly` | 입력값을 읽기 전용으로 설정해요. |
| `aria-invalid` | 입력값의 유효성 상태를 접근성 속성으로 전달해요. |

`children`과 `placeholder`는 상속 대상에서 제외돼요. `placeholder`는 별도 Props로 제공해요.

### 3.6 프로퍼티 조합 및 사용 조건

- `value`와 `defaultValue`는 각각 제어 컴포넌트와 비제어 컴포넌트 방식으로 사용할 수 있으며, 두 방식을 동시에 사용하지 않아요.
- `disabled`는 기본값이 `false`이며, `true`로 설정하면 입력할 수 없어요.
- `className`과 `style`은 실제 Textarea가 아닌 바깥 Label에 적용돼요.
- 표준 HTML Textarea 속성은 컴포넌트에 전달되어 실제 Textarea 요소에 적용돼요.

## 04. 인터랙션 규칙 (Interaction)

### 4.1 사용자 행동에 따른 반응

| 상태 | 동작 및 표현 |
| --- | --- |
| Default | 기본 테두리와 배경색으로 표시돼요. |
| Hover | 마우스를 올리면 테두리 색상이 변경돼요. |
| Focus | 입력 영역에 포커스가 적용되면 테두리와 Placeholder 색상이 변경돼요. |
| Disabled | 입력이 비활성화되고 테두리, 배경색, 텍스트 색상이 변경돼요. |

### 4.2 입력 및 상태 변화

- 사용자가 입력하면 표준 HTML Textarea의 입력 동작에 따라 값이 변경돼요.
- `onChange`를 전달하면 입력값이 변경될 때 해당 함수가 실행돼요.
- `value`와 `defaultValue`를 통해 입력값을 제어하거나 초기값을 지정할 수 있어요.
- `disabled`를 `true`로 설정하면 실제 Textarea 요소에 `disabled` 속성이 적용돼 입력할 수 없어요.
- Hover와 Focus 상태는 마우스 및 포커스 동작에 따라 CSS로 표현돼요.

### 4.3 예외 상황 및 제한 사항

- 입력 영역의 크기는 `resize: none`으로 설정되어 있어 사용자가 직접 조절할 수 없어요.
- Error와 Success에 해당하는 별도의 시각적 상태는 제공하지 않아요.
- 입력값 검증이나 자동 상태 변경 로직은 제공하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### 5.1 입력 유형에 따른 컴포넌트 선택

**Do**

- 자기소개, 상세 설명, 의견 등 여러 줄의 텍스트를 입력받을 때 `TextArea`를 사용해요.
- 이름, 제목, 이메일 등 한 줄의 텍스트를 입력받을 때 `TextField`를 사용해요.

**Don't**

- 한 줄 입력만 필요한 항목에 `TextArea`를 사용하지 않아요.
- 여러 줄 입력이 필요한 항목을 `TextField`로 구성하지 않아요.

**Alternative**

한 줄 입력이 필요한 경우 `TextField`를 사용해요.

**Reason**

`TextArea`는 여러 줄의 텍스트 입력을, `TextField`는 한 줄의 텍스트 입력을 담당해요.

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

### 5.3 입력 및 검증 처리

**Do**

- 입력값을 관리해야 하는 경우 `value`와 `onChange`를 활용해요.
- 초기 입력값만 지정하면 되는 경우 `defaultValue`를 활용해요.
- 입력값 검증이 필요한 경우 컴포넌트를 사용하는 측에서 검증 로직을 구현해요.

**Don't**

- `TextArea` 자체에 입력값 검증이나 오류 상태 표시 기능이 있다고 가정하지 않아요.
- 입력할 수 있어야 하는 상황에서 `disabled`를 사용하지 않아요.

**Alternative**

입력값 검증이 필요한 경우 별도의 검증 로직을 구현하고, 필요한 안내를 조합하는 방식으로 구성해요.

**Reason**

TextArea는 여러 줄의 텍스트 입력을 담당하며, 입력값 검증은 컴포넌트 자체에서 수행하지 않아요.

## 06. 추천 조합 (Composition)

### 6.1 TextArea + Button

**조합이 필요한 상황**

사용자가 작성한 여러 줄의 텍스트를 제출하거나 저장하는 폼을 구성할 때 사용해요.

| 컴포넌트 | 역할 |
| --- | --- |
| TextArea | 사용자가 여러 줄의 텍스트를 입력해요. |
| Button | 입력값을 제출하거나 저장하는 동작을 실행해요. |

**조합 시 동작 규칙**

- TextArea는 입력값을 받아요.
- Button은 입력값을 제출하거나 저장하는 동작을 실행해요.
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
- 입력값은 각 컴포넌트에 개별적으로 전달해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 | 설명 |
| --- | --- | --- |
| Component | `packages/ui/src/text/TextArea/TextArea.tsx` | TextArea 컴포넌트의 JSX 구조와 렌더링 로직 |
| Props Type | `packages/ui/src/text/TextArea/TextArea.types.ts` | Props 타입, 기본값 및 HTML Textarea 속성 상속 정의 |
| CSS | `packages/ui/src/text/TextArea/TextArea.css` | 입력 영역의 크기, 간격, 색상, 테두리 및 상태별 스타일 |
| Storybook | `apps/storybook/stories/TextArea.stories.tsx` | 컴포넌트 사용 예시와 Props 및 상태별 표현 |