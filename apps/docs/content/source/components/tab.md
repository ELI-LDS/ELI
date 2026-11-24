# 탭

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Tab은 같은 화면 안에서 서로 다른 콘텐츠를 전환할 때 사용하는 개별 탭 컴포넌트예요.

- 하나의 화면에서 콘텐츠 영역을 구분하고, 사용자가 선택한 탭에 맞는 내용을 보여줄 때 사용해요.
- 현재 선택된 탭을 시각적으로 표시해요.
- 다른 페이지로 이동하는 내비게이션이 아니라, 같은 화면 안의 콘텐츠를 전환하는 용도예요.

Tab 자체는 **개별 탭의 선택 상태와 클릭 동작**을 제공해요. 여러 Tab을 하나의 그룹으로 묶어 단일 선택을 보장하거나, 연결된 콘텐츠 패널을 자동으로 전환하지는 않아요. 이 동작은 사용하는 화면에서 구현해야 해요.

## 02. 컴포넌트 구조 (Structure)

Tab은 네이티브 `button` 하나와 탭 이름을 표시하는 `span`으로 구성돼요.

- **Root (`button`)**
    - `role="tab"`이 적용돼요.
    - 현재 선택 상태를 `aria-selected`와 `data-active`로 전달해요.
    - 일반 버튼 속성도 전달할 수 있어요.
- **Label (`span`)**
    - `label`에 전달한 문자열을 표시해요.
    - 한 줄로 표시하며, 영역을 초과하면 말줄임표로 처리해요.

여러 Tab을 그룹으로 사용할 때는 상위 요소에 `role="tablist"`와 적절한 접근성 이름을 지정해요. 각 Tab의 `aria-controls`에는 연결할 콘텐츠 패널의 ID를 전달할 수 있어요. Tab 내부에는 콘텐츠 패널이 포함되지 않아요.

## 03. 프로퍼티 (Properties)

### Variant / Size

별도의 Variant 및 Size Props는 제공하지 않아요.

### State

| 상태 | 조건 | 구현 |
| --- | --- | --- |
| Default | `active`가 `false`인 상태 | 비활성 텍스트 색상과 하단 구분선을 표시해요. |
| Active | `active`가 `true`인 상태 | 강조된 텍스트 색상과 선택 표시용 하단 선을 표시해요. |
| Hover | 비활성화되지 않은 Tab에 포인터가 올라간 상태 | 배경색이 변경돼요. |
| Pressed | 비활성화되지 않은 Tab을 누르는 상태 | 배경색이 변경돼요. |
| Disabled | 네이티브 `disabled` 속성이 `true`인 상태 | 버튼이 비활성화되고 Hover·Pressed 스타일이 적용되지 않아요. |

Hover와 Pressed는 별도의 Props가 아니라 CSS의 포인터 상태로 표현돼요. 별도의 Focus 스타일은 Tab CSS에 정의되어 있지 않아요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `'탭 이름'` | 탭에 표시할 이름이에요. |
| `active` | `boolean` | `undefined` | 외부에서 제어하는 선택 상태예요. 전달하면 Controlled 방식으로 동작해요. |
| `defaultActive` | `boolean` | `true` | Uncontrolled 방식에서 최초 선택 상태를 지정해요. |
| `onActiveChange` | `(active: boolean) => void` | - | 클릭으로 계산된 다음 선택 상태를 전달해요. |
| `className` | `string` | - | 루트 `button`에 추가할 클래스 이름이에요. |

`TabProps`는 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속해요. 따라서 `onClick`, `disabled`, `style`, `aria-controls`, `id` 등 일반적인 버튼 속성을 전달할 수 있어요. 단, `children`과 `aria-selected`는 상속 대상에서 제외돼요. `aria-selected`는 컴포넌트가 현재 선택 상태에 따라 직접 설정해요.

### Props 조합 및 상태 제어

`active`가 전달되는지에 따라 상태 관리 방식이 달라져요.

| 방식 | 사용 Props | 상태 관리 |
| --- | --- | --- |
| Controlled | `active`, 필요에 따라 `onActiveChange` | 외부에서 `active` 값을 관리해요. |
| Uncontrolled | `defaultActive`, 필요에 따라 `onActiveChange` | Tab 내부 상태를 사용해요. |
- `active`가 `undefined`가 아니면 `active`가 `defaultActive`보다 우선해요.
- `active`를 전달하지 않으면 내부 상태를 사용하고, 최초 값은 `defaultActive`예요.
- Controlled 방식에서는 `onActiveChange`가 호출되어도 내부 상태가 바뀌지 않아요. 외부에서 `active`를 갱신해야 화면의 선택 표시가 바뀌어요.
- `defaultActive`의 기본값은 `true`이므로, 여러 Tab을 사용할 때 각 Tab에 기본값을 그대로 두면 모두 선택된 상태로 시작할 수 있어요. 그룹에서 하나만 선택되게 하려면 외부에서 각 Tab의 `active`를 제어하는 방식이 적합해요.

## 04. 인터랙션 규칙 (Interaction)

### 클릭 및 상태 변경 순서

Tab을 클릭하면 다음 순서로 처리해요.

1. 전달된 `onClick`을 먼저 실행해요.
2. `onClick`에서 `event.preventDefault()`를 호출했다면 이후 선택 상태 변경을 중단해요.
3. 클릭이 취소되지 않았다면 현재 선택 상태의 반대 값(`!isActive`)을 계산해요.
4. `active`가 전달되지 않은 Uncontrolled 방식이면 내부 상태를 갱신해요.
5. `onActiveChange`가 전달되어 있다면 계산된 다음 상태를 인자로 호출해요.

### 다시 클릭하는 경우

선택된 Tab을 다시 클릭해도 현재 상태의 반대 값인 `false`를 계산해요. 따라서 개별 Tab은 선택 해제될 수 있어요. 여러 Tab 중 항상 하나가 선택되어야 하는 화면이라면 상위 컴포넌트에서 `false` 상태를 반영하지 않거나, 선택된 탭을 유지하도록 그룹 상태를 관리해야 해요.

### 여러 Tab과 콘텐츠 패널

- Tab은 다른 Tab의 상태를 알지 못해요.
- Tab 그룹의 단일 선택 규칙을 내부에서 처리하지 않아요.
- 콘텐츠 패널을 표시하거나 숨기는 기능을 제공하지 않아요.
- `aria-controls`는 전달할 수 있지만, 해당 ID의 패널을 생성하거나 연결 상태를 검증하지 않아요.
- 구현 코드에는 Tab 그룹의 방향키 이동이나 Home/End 키 이동 로직이 없어요. 네이티브 버튼의 기본 키보드 동작과 Tab 그룹의 키보드 탐색은 구분해야 해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 같은 화면 안에서 콘텐츠 영역을 전환할 때 사용해요.
- 여러 Tab을 그룹으로 사용할 때는 상위 요소에서 선택 상태를 관리해요.
- `label`은 탭이 표시하는 콘텐츠를 구분할 수 있는 짧고 명확한 이름으로 작성해요.
- 콘텐츠 패널과 연결할 때는 각 Tab의 `aria-controls`에 해당 패널의 ID를 전달해요.
- 그룹에서 단일 선택을 유지해야 한다면 `active`를 Controlled 방식으로 사용해요.
- 비활성 탭의 초기 상태가 필요하면 `defaultActive={false}`를 명시해요.

### Don’t

- 다른 페이지로 이동하는 내비게이션 용도로 사용하지 않아요.
- 여러 Tab을 각각 독립적인 Uncontrolled 상태로 두고 하나만 선택될 것이라고 가정하지 않아요.
- Tab 클릭만으로 콘텐츠 패널이 자동 전환된다고 가정하지 않아요.
- Controlled 방식에서 `onActiveChange`만 연결하고 `active` 값을 갱신하지 않아요.
- 방향키 탐색이나 탭 패널의 접근성 연결이 자동으로 구현되어 있다고 가정하지 않아요.

### Alternative

- 다른 페이지나 주요 화면으로 이동하는 메뉴에는 `NavigationBar` 또는 `NavigationDrawer`를 사용해요.
- 하나의 값을 입력·선택하는 폼에는 `Radio`나 `Select`를 사용해요.

### Reason

Tab은 같은 화면 안에서 콘텐츠 영역을 전환하는 컴포넌트예요. 페이지 이동, 폼 값 선택, 콘텐츠 전환은 목적과 동작이 다르므로 용도에 맞는 컴포넌트를 사용해야 해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 및 규칙 |
| --- | --- | --- |
| Tab + `role="tablist"` 컨테이너 | 여러 탭을 하나의 그룹으로 구성할 때 | 상위 요소가 탭 그룹을 나타내고, 각 Tab이 개별 선택 항목을 나타내요. 그룹의 선택 상태는 상위 컴포넌트가 관리해요. |
| Tab + 콘텐츠 패널 (`role="tabpanel"`) | 선택된 탭에 해당하는 내용을 표시할 때 | Tab의 `aria-controls`와 패널의 `id`를 연결해요. 선택된 탭에 맞춰 패널의 표시 여부도 외부에서 관리해요. |

여러 Tab을 사용할 때는 다음 규칙을 화면에서 구현해요.

- 현재 선택된 탭을 나타내는 상태를 하나 관리해요.
- 각 Tab의 `active`는 해당 탭이 선택된 상태인지 비교한 Boolean 값으로 전달해요.
- `onActiveChange`에서 `nextActive`가 `true`일 때 선택 탭을 갱신하면, 선택된 Tab을 다시 클릭해도 그룹에서 선택이 해제되지 않도록 만들 수 있어요.
- 각 Tab의 `aria-controls` 값과 대응하는 패널의 `id`를 일치시켜요.
- 선택된 패널 외의 패널은 화면 정책에 맞게 숨기거나 표시해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/tab/Tab/Tab.tsx` |
| Props Type | `packages/ui/src/tab/Tab/Tab.types.ts` |
| State & Interaction | `packages/ui/src/tab/Tab/useTab.ts` |
| CSS | `packages/ui/src/tab/Tab/Tab.css` |
| Storybook | `apps/storybook/stories/Tab.stories.tsx` |
| Export | `packages/ui/src/tab/index.ts` |