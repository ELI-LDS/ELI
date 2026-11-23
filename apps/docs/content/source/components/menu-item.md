# 메뉴 아이템

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

MenuItem은 메뉴나 선택 목록에서 하나의 항목을 표시하고 사용자가 해당 항목을 선택할 수 있도록 하는 컴포넌트예요.

- 설정 메뉴, 작업 메뉴, 페이지 이동 목록처럼 여러 행동을 나열할 때 사용해요.
- 항목의 이름과 함께 아이콘이나 키보드 단축키 안내를 표시할 수 있어요.
- 항목을 선택했을 때 실행할 동작은 `onClick`으로 연결해요.

MenuItem은 개별 항목의 UI와 클릭 동작을 제공해요. 여러 항목을 묶는 메뉴 구조나 열고 닫는 동작, 선택 상태는 별도로 구현해야 해요.

## 02. 컴포넌트 구조 (Structure)

MenuItem은 네이티브 `button`을 루트로 사용하며, 내부 요소는 다음 순서로 구성돼요.

1. **Left Icon**: 텍스트 왼쪽에 표시하는 아이콘이에요. 선택 사항이에요.
2. **Text**: `children`으로 전달한 항목 이름을 표시해요.
3. **Shortcut**: 키보드 단축키 안내를 표시해요. 선택 사항이에요.
4. **Right Icon**: 텍스트 오른쪽 끝에 표시하는 아이콘이에요. 선택 사항이에요.

텍스트가 표시 영역보다 길면 한 줄로 유지하고 말줄임표로 표시해요.

## 03. 프로퍼티 (Properties)

### 구성 요소

| 요소 | Prop | 설명 |
| --- | --- | --- |
| 항목 이름 | `children` | 메뉴 항목에 표시할 텍스트나 콘텐츠예요. |
| 왼쪽 아이콘 | `leftIcon` | 텍스트 왼쪽에 표시할 아이콘이에요. |
| 단축키 안내 | `shortcut` | 오른쪽에 표시할 단축키 안내예요. |
| 오른쪽 아이콘 | `rightIcon` | 단축키 다음에 표시할 아이콘이에요. |

### State

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Default | 기본 상태 | 기본 배경과 텍스트 색상을 표시해요. |
| Hover | 비활성화되지 않은 항목에 포인터가 올라간 상태 | 배경색이 변경돼요. |
| Pressed | 비활성화되지 않은 항목을 누르는 상태 | 배경색이 변경되고 누름 인터랙션이 적용돼요. |
| Disabled | `disabled`가 `true`인 상태 | 항목을 선택할 수 없어요. |

별도의 선택 완료 상태나 로딩 상태는 구현되어 있지 않아요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `'선택'` | 메뉴 항목에 표시할 내용이에요. |
| `leftIcon` | `ReactNode` | - | 텍스트 왼쪽에 표시할 아이콘이에요. |
| `shortcut` | `ReactNode` | - | 오른쪽에 표시할 단축키 안내예요. |
| `rightIcon` | `ReactNode` | - | 단축키 다음에 표시할 오른쪽 아이콘이에요. |
| `disabled` | `boolean` | `false` | 항목을 비활성화할지 정해요. |
| `className` | `string` | - | 루트 `button`에 추가할 클래스 이름이에요. |
| `type` | `button` | `submit` | `reset` | `button` | 버튼의 동작 유형을 지정해요. |

그 외에도 `ButtonHTMLAttributes<HTMLButtonElement>`를 상속하므로 `onClick`, `aria-label`, `style` 등 일반적인 버튼 속성을 전달할 수 있어요. `children`은 별도로 정의하며, 나머지 네이티브 버튼 속성은 상속해요.

## 04. 인터랙션 규칙 (Interaction)

### 항목 선택

- 항목을 클릭하면 전달한 `onClick`이 실행돼요.
- `disabled`가 `true`이면 네이티브 버튼이 비활성화되어 선택할 수 없어요.
- 클릭 후 메뉴를 닫거나 선택 상태를 변경하는 동작은 MenuItem에서 관리하지 않아요.

### 아이콘 및 단축키

- `leftIcon`을 전달하면 텍스트 왼쪽에 표시해요.
- `shortcut`을 전달하면 오른쪽에 단축키 안내를 표시해요.
- `rightIcon`을 전달하면 단축키 다음 위치에 표시해요.
- `shortcut`은 안내 텍스트만 표시해요. 해당 키를 눌렀을 때 실행되는 동작은 별도로 연결해야 해요.

### Pointer 인터랙션

- 마우스, 터치, 펜으로 누르기 시작하면 텍스트와 아이콘에 축소 애니메이션이 적용돼요.
- 누르기를 마치면 원래 크기로 돌아오는 애니메이션이 적용돼요.
- 누르기가 취소되거나 누른 상태에서 항목 바깥으로 이동해도 축소 상태에서 복원돼요.
- 외부에서 `onPointerDown`, `onPointerUp`, `onPointerCancel`, `onPointerLeave`를 전달할 수 있어요.
- 전달한 Pointer 이벤트에서 `preventDefault()`를 호출하면 해당 이벤트에 연결된 내부 인터랙션 상태 변경은 실행되지 않아요.

### 접근성 및 키보드

- 네이티브 `button`을 사용하므로 기본 버튼 키보드 동작을 제공해요.
- `disabled`도 네이티브 버튼 속성으로 적용돼요.
- 메뉴 항목의 의미를 명확하게 전달해야 한다면 `aria-label` 등 적절한 접근성 속성을 전달해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 메뉴 항목의 이름은 `children`에 명확하게 작성해요.
- 항목의 기능을 보조 설명해야 할 때 `leftIcon`이나 `rightIcon`을 사용해요.
- 키보드 단축키를 안내할 때는 `shortcut`을 사용해요.
- 항목을 선택했을 때 실행할 동작은 `onClick`에 연결해요.
- 선택할 수 없는 항목은 `disabled`를 `true`로 설정해요.
- 여러 MenuItem을 사용할 때 항목 이름과 아이콘의 의미를 일관되게 구성해요.

### Don't

- `shortcut`에 단축키를 표시했다는 이유만으로 실제 키보드 동작이 연결되었다고 가정하지 않아요.
- MenuItem 자체가 메뉴의 열기·닫기나 항목 간 이동을 관리한다고 가정하지 않아요.
- 선택 상태를 MenuItem이 자동으로 저장한다고 가정하지 않아요.
- 항목 이름 대신 아이콘만 전달해 기능을 표현하지 않아요. 아이콘만으로 의미를 전달해야 한다면 접근성 이름도 별도로 제공해요.
- 하나의 항목에 의미가 중복되거나 불필요한 아이콘을 여러 개 배치하지 않아요.

### 대안

- 여러 항목 중 하나를 선택하는 입력 UI가 필요하다면 `Radio`나 `Select`를 사용해요.
- 여러 항목을 동시에 선택하거나 해제해야 한다면 `Checkbox`를 사용해요.
- 화면 내 주요 영역을 이동하는 내비게이션이 필요하다면 `NavigationDrawer` 등을 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| MenuItem + Left Icon | 항목의 기능을 아이콘으로 보조 설명하는 메뉴 | 아이콘은 항목의 의미를 보조하고 텍스트는 기능을 명확하게 전달해요. |
| MenuItem + Shortcut | 키보드 단축키를 제공하는 작업 메뉴 | 항목은 실행할 작업을 표시하고 Shortcut은 관련 키 조합을 안내해요. |
| MenuItem + Right Icon | 하위 메뉴나 추가 화면으로 이동하는 항목 | 오른쪽 아이콘으로 추가 이동이나 다음 단계가 있음을 시각적으로 표현할 수 있어요. |
| MenuItem + NavigationDrawer | 여러 화면이나 메뉴 항목을 나열하는 내비게이션 | NavigationDrawer는 메뉴 영역을 구성하고 MenuItem은 개별 항목을 표시해요. |

MenuItem은 개별 항목이므로 여러 항목을 함께 사용할 때는 상위 메뉴에서 항목의 배치, 선택 처리, 메뉴 열기·닫기 동작을 관리해야 해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/menu/MenuItem/MenuItem.tsx` |
| Props Type | `packages/ui/src/menu/MenuItem/MenuItem.types.ts` |
| State & Interaction | `packages/ui/src/menu/MenuItem/useMenuItem.ts` |
| CSS | `packages/ui/src/menu/MenuItem/MenuItem.css` |
| Interaction CSS | `packages/ui/src/menu/MenuItem/MenuItem.interaction.css` |
| Storybook | `apps/storybook/stories/MenuItem.stories.tsx` |
| Export | `packages/ui/src/menu/index.ts` |