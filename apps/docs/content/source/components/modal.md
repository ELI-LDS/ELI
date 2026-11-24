# 모달

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Modal은 현재 화면 위에 별도의 콘텐츠 영역을 표시하고, 제목과 안내 문장 및 두 가지 액션을 제공하는 컴포넌트예요.

- 사용자의 확인이나 선택이 필요한 상황에서 사용해요.
- 삭제, 변경, 제출 등 작업에 대한 안내와 후속 액션을 함께 제공할 때 사용할 수 있어요.
- 화면의 기존 콘텐츠 위에 별도의 안내와 선택 영역을 표시할 때 사용해요.

Modal은 화면 전체를 덮는 루트, Dim, 콘텐츠 영역, 두 개의 버튼을 렌더링해요. 표시 여부와 닫기 동작을 자체적으로 관리하지 않으므로 사용하는 화면에서 처리해야 해요.

## 02. 컴포넌트 구조 (Structure)

Modal은 화면 전체를 덮는 Root 안에 Dim과 콘텐츠 영역을 배치해요.

- **Root (`div`)**
    - 화면 전체를 덮는 고정 위치 컨테이너예요.
    - `className`과 상속된 HTML 속성이 적용돼요.
- **Dim (`Dim`)**
    - 화면 전체에 반투명 배경을 표시해요.
    - 내부 구현에서 `aria-hidden="true"`가 적용돼요.
    - 클릭 시 Modal을 닫는 이벤트는 연결되어 있지 않아요.
- **Content (`div`)**
    - 제목, 안내 문장, 액션 버튼을 포함해요.
    - `width`와 `height` Props가 이 영역에 적용돼요.
    - **Text (`div`)**
        - **Title (`div`)**: `title`을 표시해요.
        - **Descriptions (`div`)**: 안내 문장을 묶어요.
            - **Message (`div`)**: `message`를 표시해요. 값이 `null`이면 렌더링하지 않아요.
            - **SubMessage (`div`)**: `subMessage`를 표시해요. 값이 `null`이면 렌더링하지 않아요.
    - **Actions (`div`)**
        - **Secondary Button**: 왼쪽에 배치되는 보조 액션 버튼이에요.
        - **Positive Button**: 오른쪽에 배치되는 주요 액션 버튼이에요.

Title과 두 버튼은 조건부 렌더링 없이 항상 해당 요소가 생성돼요. `message`와 `subMessage`는 각각 `null`일 때만 해당 문장 요소를 렌더링하지 않아요. 빈 문자열은 `null`이 아니므로 요소가 렌더링돼요.

## 03. 프로퍼티 (Properties)

### Variant / Size / State

별도의 Variant나 State Props는 제공하지 않아요.

콘텐츠 영역의 크기는 `width`, `height`로 지정할 수 있어요. Modal 전체 화면 루트의 크기를 지정하는 Props는 아니에요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `'제목'` | 콘텐츠 영역 상단에 표시할 제목이에요. |
| `message` | `ReactNode` | `'내용을 작성합니다'` | 첫 번째 안내 문장이에요. `null`이면 렌더링하지 않아요. |
| `subMessage` | `ReactNode` | `'내용을 작성합니다'` | 두 번째 안내 문장이에요. `null`이면 렌더링하지 않아요. |
| `width` | `CSSProperties['width']` | - | 콘텐츠 영역의 너비예요. 숫자는 px로 처리하며 CSS 크기 문자열도 사용할 수 있어요. |
| `height` | `CSSProperties['height']` | - | 콘텐츠 영역의 높이예요. 숫자는 px로 처리해요. |
| `positiveAction` | `ReactNode` | `'버튼'` | 오른쪽 Positive 버튼에 표시할 내용이에요. |
| `secondaryAction` | `ReactNode` | `'버튼'` | 왼쪽 Secondary 버튼에 표시할 내용이에요. |
| `onPositiveAction` | `MouseEventHandler<HTMLButtonElement>` | - | Positive 버튼 클릭 시 실행할 함수예요. |
| `onSecondaryAction` | `MouseEventHandler<HTMLButtonElement>` | - | Secondary 버튼 클릭 시 실행할 함수예요. |
| `className` | `string` | - | 화면 전체를 덮는 Root에 추가할 클래스 이름이에요. 콘텐츠 영역에는 적용되지 않아요. |

`ModalProps`는 `HTMLAttributes<HTMLDivElement>`를 상속하며, `children`과 HTML `title` 속성은 제외돼요. 따라서 `id`, `style`, `aria-*`, `onKeyDown` 등 일반적인 `div` 속성을 전달할 수 있고 Root에 적용돼요. 콘텐츠 내용을 임의의 `children`으로 전달하는 API는 제공하지 않아요.

### 내부 Button 구성

Modal은 ELI `Button`을 두 개 렌더링해요.

| 항목 | Secondary Button | Positive Button |
| --- | --- | --- |
| 위치 | 왼쪽 | 오른쪽 |
| `color` | `neutral` | `brand` |
| `variant` | `solid` | `solid` |
| `icon` | `null` | `null` |
| `width` | `100%` | `100%` |
| 표시 내용 | `secondaryAction` | `positiveAction` |
| 클릭 핸들러 | `onSecondaryAction` | `onPositiveAction` |

내부 Button의 `size`와 `type`은 Modal에서 별도로 전달하지 않으므로 Button 컴포넌트의 기본값이 적용돼요. 현재 Button 구현 기준으로 `size`는 `large`, `type`은 `button`이에요.

### 크기 적용 규칙

- `width`를 전달하면 콘텐츠 영역에 `width`와 `max-width: 100%`가 인라인 스타일로 적용돼요.
- `width`를 생략하면 CSS에 정의된 콘텐츠 영역의 기본 너비 규칙이 적용돼요. 현재 CSS에는 `width: 100%`, `max-width: 343px`가 정의되어 있어요.
- `height`를 전달하면 콘텐츠 영역에 인라인 `height`가 적용돼요.
- `height`를 생략하면 콘텐츠 영역의 높이를 별도로 지정하지 않아요.
- `className`과 `style`은 Root에 적용돼요. `width`와 `height`는 별도로 추출되어 Content에 적용돼요.

## 04. 인터랙션 규칙 (Interaction)

### Action 버튼

- 왼쪽 Secondary 버튼을 클릭하면 `onSecondaryAction`이 전달된 경우 해당 함수가 실행돼요.
- 오른쪽 Positive 버튼을 클릭하면 `onPositiveAction`이 전달된 경우 해당 함수가 실행돼요.
- 두 콜백은 버튼의 MouseEvent를 전달받아요.
- 콜백을 전달하지 않아도 버튼은 렌더링돼요. 이 경우 Modal에서 별도의 클릭 동작을 정의하지 않아요.
- 버튼 클릭만으로 Modal이 자동으로 닫히지는 않아요.

### 안내 문장 렌더링

- `message`를 생략하면 기본 문장 `'내용을 작성합니다'`가 표시돼요.
- `subMessage`를 생략하면 기본 문장 `'내용을 작성합니다'`가 표시돼요.
- 각 Props에 `null`을 전달하면 해당 문장 요소를 렌더링하지 않아요.
- `title`은 기본값이 있고 조건부 렌더링되지 않아요. `null`을 전달하면 제목 요소는 유지되지만 내용은 표시되지 않아요.

### 표시 및 닫기

Modal은 렌더링되는 동안 Root, Dim, Content를 함께 렌더링해요.

다음 기능은 Modal 구현에 포함되어 있지 않아요.

- 열기·닫기 상태 관리
- Action 버튼 클릭 후 자동 닫기
- Dim 클릭 후 닫기
- ESC 키 입력 후 닫기
- 별도의 닫기 버튼
- 포커스 이동 및 포커스 트랩
- `role="dialog"` 및 `aria-modal`의 기본 적용

Modal을 표시할지 여부와 닫기 동작은 사용하는 화면에서 구현해야 해요. `ModalProps`가 일반 `div` 속성을 상속하므로 `role`, `aria-*`, 키보드 이벤트 등을 Root에 전달할 수는 있지만, 속성을 전달하는 것만으로 포커스 관리나 닫기 동작이 자동 구현되지는 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 사용자의 확인이나 선택이 필요한 상황에서 사용해요.
- `title`에 사용자가 결정해야 하는 핵심 내용을 작성해요.
- 안내 문장이 하나만 필요하다면 사용하지 않는 문장 Props에 `null`을 전달해요.
- 주요 액션은 `positiveAction`과 `onPositiveAction`에, 보조 액션은 `secondaryAction`과 `onSecondaryAction`에 연결해요.
- 버튼 클릭 후 Modal을 닫아야 한다면 각 콜백에서 외부 표시 상태를 변경해요.
- 표시 여부와 닫기 조건은 사용하는 화면에서 관리해요.
- 접근성 의미와 키보드·포커스 동작이 필요한 화면에서는 Root에 필요한 속성을 전달하고, 구현되지 않은 동작은 사용하는 화면에서 별도로 처리해요.

### Don’t

- 버튼 클릭 후 Modal이 자동으로 닫힌다고 가정하지 않아요.
- Dim 클릭이나 ESC 입력으로 Modal이 자동으로 닫힌다고 가정하지 않아요.
- Modal이 기본적으로 `role="dialog"`, `aria-modal` 또는 포커스 트랩을 제공한다고 가정하지 않아요.
- `positiveAction`과 `secondaryAction`에 전달한 문구만으로 실제 동작이 정의된다고 가정하지 않아요.
- 임의의 본문을 `children`으로 전달할 수 있다고 가정하지 않아요. 현재 Props에서 `children`은 지원하지 않아요.
- 단순한 상태 메시지나 일시적인 피드백을 표시하기 위해 Modal을 사용하지 않아요.

### Alternative

- 화면 안에서 상태나 오류를 지속적으로 안내하려면 `Alert`를 사용해요.
- 일시적인 작업 결과를 간단히 전달하려면 `SnackBar`를 사용해요.
- 사용자 선택 없이 진행 상태만 표시하려면 `LoadingIndicator` 또는 `ProgressIndicator`를 사용해요.

### Reason

Modal은 현재 화면 위에 별도의 안내와 선택 영역을 표시하는 컴포넌트예요. 사용자의 작업 흐름을 중단시키는 UI이므로 확인이나 선택이 필요한 상황에 사용하고, 단순한 상태 안내에는 더 적합한 컴포넌트를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 및 규칙 |
| --- | --- | --- |
| Modal + Button | Modal 외부에서 열기 동작을 제공할 때 | 외부 Button은 Modal 표시 상태를 변경하고, Modal 내부 Button은 Secondary·Positive 액션을 실행해요. |
| Modal + Alert | Modal 안에서 추가 상태나 오류를 안내해야 할 때 | Modal은 선택 흐름을 제공하고 Alert는 별도의 상태 메시지를 표시해요. |

Modal에는 Secondary와 Positive Button이 이미 포함되어 있어요. 동일한 목적의 버튼을 콘텐츠에 중복해서 추가하기보다 기본 액션 영역을 활용해요.

Modal을 사용하는 화면에서는 다음 책임을 가져요.

- Modal을 표시할 조건과 상태를 관리해요.
- 각 Action 콜백에서 실제 작업을 실행해요.
- 작업 취소·완료 후 Modal을 닫아야 한다면 외부 상태를 변경해요.
- ESC, Dim 클릭, 포커스 관리 등 필요한 동작이 있다면 사용하는 화면에서 별도로 구현해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/modal/Modal/Modal.tsx` |
| Props Type | `packages/ui/src/modal/Modal/Modal.types.ts` |
| CSS | `packages/ui/src/modal/Modal/Modal.css` |
| Storybook | `apps/storybook/stories/Modal.stories.tsx` |
| Export | `packages/ui/src/modal/index.ts` |
| Dependent Component — Dim | `packages/ui/src/dim/Dim/Dim.tsx` |
| Dependent Component — Button | `packages/ui/src/button/Button/Button.tsx` |