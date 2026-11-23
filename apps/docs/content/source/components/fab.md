# FAB

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

FAB(Floating Action Button)는 화면에서 주요 액션을 눈에 띄게 제공하는 버튼이에요.

- 화면에서 자주 사용하는 핵심 액션을 빠르게 실행할 때 사용해요.
- 하나의 액션을 실행할 때는 `Fab`을 단독으로 사용해요.
- 관련된 여러 액션을 한곳에 모아 제공할 때는 `FabMenu`를 사용해요.

`Fab`은 하나의 액션을 실행하거나 메뉴를 여는 버튼이고, `FabMenu`는 메인 FAB를 눌러 여러 액션을 펼치고 선택할 수 있도록 구성한 컴포넌트예요.

## 02. 컴포넌트 구조 (Structure)

FAB는 다음 세 가지 컴포넌트로 구성돼요.

| 구성 요소 | 역할 |
| --- | --- |
| `Fab` | 단독 액션을 실행하거나 FAB Menu를 열고 닫는 메인 버튼이에요. |
| `FabMenu` | 메인 FAB와 여러 개의 액션 버튼을 관리해요. |
| `FabMenuSegment` | 펼쳐진 메뉴에서 개별 액션을 실행하는 버튼이에요. |

### Fab

- 아이콘을 표시해요.
- `showLabel`이 `true`이고 메뉴가 닫혀 있으면 아이콘 옆에 라벨을 표시해요.
- `expanded`가 `true`이면 열린 상태의 아이콘을 표시하고 라벨은 숨겨요.

### FabMenu

- 메인 FAB와 액션 목록으로 구성돼요.
- 메인 FAB 위쪽에 액션 버튼을 세로로 배치해요.
- 액션 목록은 메뉴가 닫혀 있어도 DOM에 유지되며, 닫힌 상태에서는 화면에 표시되지 않고 상호작용할 수 없어요.
- 각 액션은 `FabMenuSegment`로 렌더링돼요.

### FabMenuSegment

- 아이콘과 라벨을 표시하는 개별 액션 버튼이에요.
- 아이콘을 생략하면 기본 Add 아이콘을 표시해요.
- 아이콘을 `null`로 전달하면 아이콘 없이 라벨만 표시해요.

## 03. 프로퍼티 (Properties)

### Fab

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `버튼` | FAB의 이름이에요. 화면에 표시하거나 화면 낭독기에 전달해요. |
| `icon` | `ReactNode | null` | Add 아이콘 | 닫힌 상태에서 표시할 아이콘이에요. |
| `expandedIcon` | `ReactNode | null` | Close 아이콘 | 열린 상태에서 표시할 아이콘이에요. |
| `expanded` | `boolean` | `false` | FAB의 열린 상태를 지정해요. |
| `showLabel` | `boolean` | `true` | 닫힌 상태에서 라벨을 화면에 표시할지 정해요. |
| `className` | `string` | `undefined` | 루트 `button`에 적용할 클래스 이름이에요. |
| `type` | `ButtonHTMLAttributes`의 `type` | `button` | 버튼 타입을 지정해요. |

`Fab`은 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `disabled`, `aria-label`, `style` 등 일반 버튼 속성도 전달할 수 있어요. 단, `children`은 제외돼요.

### FabMenu

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `items` | `readonly FabMenuItem[]` | 필수 | 메뉴에 표시할 액션 목록이에요. |
| `label` | `string` | `버튼` | 메인 FAB의 이름이에요. 화면에 표시하거나 화면 낭독기에 전달해요. |
| `icon` | `ReactNode | null` | Add 아이콘 | 닫힌 상태의 메인 FAB에 표시할 아이콘이에요. |
| `expandedIcon` | `ReactNode | null` | Close 아이콘 | 열린 상태의 메인 FAB에 표시할 아이콘이에요. |
| `showLabel` | `boolean` | `true` | 닫힌 상태의 메인 FAB에서 라벨을 표시할지 정해요. |
| `expanded` | `boolean` | `undefined` | 외부에서 제어하는 메뉴 열림 상태예요. |
| `defaultExpanded` | `boolean` | `false` | 비제어 방식에서 처음 메뉴를 열어둘지 정해요. |
| `onExpandedChange` | `(expanded: boolean) => void` | `undefined` | 메뉴의 열림 상태가 바뀔 때 다음 상태를 전달해요. |
| `className` | `string` | `undefined` | 루트 `div`에 적용할 클래스 이름이에요. |

`FabMenu`는 `HTMLAttributes<HTMLDivElement>`를 상속하므로 `style` 등 일반 `div` 속성도 전달할 수 있어요. 단, `children`은 제외돼요.

각 `items` 항목은 다음 속성으로 구성해요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `id` | `string` | 항목을 구분하고 React key로 사용하는 고유 값이에요. |
| `label` | `string` | 액션 버튼에 표시할 이름이에요. |
| `icon` | `ReactNode | null` | 액션 버튼에 표시할 아이콘이에요. 생략하면 Add 아이콘을 사용하고, `null`이면 숨겨요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | 액션 버튼을 클릭했을 때 실행할 함수예요. |

### FabMenuSegment

`FabMenuSegment`는 `FabMenu` 내부에서 개별 액션을 표시하는 버튼이에요. 직접 사용할 수도 있어요.

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | 필수 | 액션 버튼에 표시할 이름이에요. |
| `icon` | `ReactNode | null` | Add 아이콘 | 라벨 앞에 표시할 아이콘이에요. |
| `className` | `string` | `undefined` | 루트 `button`에 적용할 클래스 이름이에요. |
| `type` | `ButtonHTMLAttributes`의 `type` | `button` | 버튼 타입을 지정해요. |

`FabMenuSegment`는 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `disabled`, `style` 등 일반 버튼 속성도 전달할 수 있어요. 단, `children`은 제외돼요.

## 04. 인터랙션 규칙 (Interaction)

### Fab

- 클릭하면 전달된 `onClick`을 실행해요.
- `expanded`가 `true`이면 열린 상태, `false`이면 닫힌 상태를 표시해요.
- `expanded` 값이 바뀌면 기본 Add 아이콘과 Close 아이콘이 회전하며 교차 전환돼요.
- `icon` 또는 `expandedIcon` 중 하나가 `null`이면 두 아이콘을 겹쳐 전환하지 않고 해당 상태의 아이콘을 바로 표시해요.
- `expanded`가 `true`이면 `showLabel` 값과 관계없이 라벨을 숨겨요.
- `expanded`를 전달하지 않으면 `aria-expanded` 속성을 설정하지 않아요. 단독으로 사용할 때는 열린 상태를 직접 관리해야 해요.

### FabMenu

- 메인 FAB를 클릭하면 메뉴가 열리거나 닫혀요.
- 메뉴가 열리면 액션 목록이 아래에서 위로 나타나요.
- 메뉴가 닫히면 액션 목록이 아래 방향으로 이동하며 사라져요.
- 메뉴가 닫힌 상태에서는 액션 목록이 화면에 표시되지 않고 포인터 및 키보드 상호작용이 차단돼요.
- 액션 항목을 클릭하면 해당 항목의 `onClick`을 실행한 뒤 메뉴를 닫아요.
- `onClick`을 전달하지 않은 항목도 클릭하면 메뉴가 닫혀요.
- `onExpandedChange`는 메뉴가 열리거나 닫힐 때 변경될 상태값을 전달해요.

### 열림 상태 관리

| 방식 | 설정 | 동작 |
| --- | --- | --- |
| 비제어 방식 | `defaultExpanded` | 컴포넌트 내부에서 열림 상태를 관리해요. |
| 제어 방식 | `expanded` + `onExpandedChange` | 외부에서 전달한 `expanded` 값으로 열림 상태를 관리해요. |

`expanded`를 전달하면 `defaultExpanded`보다 우선해요. 제어 방식에서는 `onExpandedChange`가 전달하는 값을 외부 상태에 반영해야 실제 화면 상태가 변경돼요.

### FabMenuSegment

- 버튼을 클릭하면 전달된 `onClick`을 실행해요.
- `disabled`가 전달되면 버튼을 비활성화해요.
- 기본 Add 아이콘 대신 다른 아이콘을 전달할 수 있어요.

### 모션 및 상태

- 메인 FAB는 닫힌 상태와 열린 상태에 따라 배경과 아이콘이 달라져요.
- FAB와 메뉴 항목은 클릭 중 Pressed 상태를 표시해요.
- `disabled` 상태에서는 버튼의 클릭 커서가 비활성 상태로 바뀌어요.
- `prefers-reduced-motion`이 활성화된 환경에서는 열기·닫기 및 아이콘 전환 모션을 최소화해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 실행할 액션이 하나라면 `Fab`을 단독으로 사용해요.
- 관련된 여러 액션을 제공해야 한다면 `FabMenu`를 사용해요.
- 각 메뉴 항목의 `id`는 서로 다른 고유 값으로 지정해요.
- `label`에는 버튼이 실행하는 동작을 구체적으로 작성해요.
- 아이콘만으로 의미를 전달하기 어렵다면 `showLabel`을 유지해요.
- 메뉴를 열고 닫는 상태를 다른 화면 요소와 함께 관리해야 한다면 제어 방식을 사용해요.

### Don't

- 서로 관련 없는 액션을 하나의 FAB Menu에 무분별하게 모으지 않아요.
- 메뉴 항목의 `id`를 중복해서 지정하지 않아요.
- FAB Menu의 액션 버튼에 별도의 닫기 동작을 중복 구현하지 않아요. 항목을 클릭하면 메뉴가 자동으로 닫혀요.
- FAB를 일반적인 화면 이동 메뉴나 여러 항목을 탐색하는 내비게이션 용도로 사용하지 않아요. 이 경우 NavigationDrawer 또는 NavigationBar를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 역할 및 사용 상황 |
| --- | --- |
| `Fab` + `onClick` | 화면에서 하나의 주요 액션을 바로 실행할 때 사용해요. |
| `FabMenu` + `items` | 관련된 여러 액션을 한곳에 모아 제공할 때 사용해요. |
| `FabMenu` + `expanded` + `onExpandedChange` | 메뉴 열림 상태를 외부 화면 상태와 함께 관리할 때 사용해요. |
| `FabMenu` + `FabMenuSegment` | 메인 FAB를 기준으로 개별 액션 버튼을 구성해요. `FabMenu`가 내부에서 자동으로 생성하므로 직접 조합할 필요는 없어요. |

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Fab | `packages/ui/src/fab/Fab/Fab.tsx` |
| Fab Props | `packages/ui/src/fab/Fab/Fab.types.ts` |
| Fab CSS | `packages/ui/src/fab/Fab/Fab.css` |
| Fab 인터랙션 CSS | `packages/ui/src/fab/Fab/Fab.interaction.css` |
| FabMenu | `packages/ui/src/fab/FabMenu/FabMenu.tsx` |
| FabMenu Props | `packages/ui/src/fab/FabMenu/FabMenu.types.ts` |
| FabMenu 상태 관리 | `packages/ui/src/fab/FabMenu/useFabMenu.ts` |
| FabMenu CSS | `packages/ui/src/fab/FabMenu/FabMenu.css` |
| FabMenu 인터랙션 CSS | `packages/ui/src/fab/FabMenu/FabMenu.interaction.css` |
| FabMenuSegment | `packages/ui/src/fab/FabMenuSegment/FabMenuSegment.tsx` |
| FabMenuSegment Props | `packages/ui/src/fab/FabMenuSegment/FabMenuSegment.types.ts` |
| FabMenuSegment CSS | `packages/ui/src/fab/FabMenuSegment/FabMenuSegment.css` |
| Storybook | `apps/storybook/stories/FabMenu.stories.tsx` |
| Storybook CSS | `apps/storybook/stories/FabMenu.stories.css` |