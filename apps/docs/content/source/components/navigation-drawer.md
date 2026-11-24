# 내비게이션 드로어

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

NavigationDrawer는 화면 한쪽에 주요 메뉴와 하위 메뉴를 세로로 배치해 사용자가 서비스의 여러 영역을 탐색할 수 있도록 돕는 컴포넌트예요.

- 메뉴를 주제별로 구분하고, 관련 하위 메뉴를 계층적으로 구성할 때 사용해요.
- 현재 선택된 메뉴를 시각적으로 표시해 사용자가 현재 위치를 파악할 수 있도록 해요.
- 하위 메뉴가 있는 주 메뉴는 펼치거나 접어 메뉴 구조를 탐색할 수 있어요.

## 02. 컴포넌트 구조 (Structure)

NavigationDrawer는 다음 요소를 조합해 구성해요.

| 구성 요소 | 역할 |
| --- | --- |
| `NavigationDrawer` | 전체 탐색 영역과 메뉴 선택 상태를 관리해요. |
| `NavigationDrawerCategory` | 메뉴를 주제별로 구분하는 제목을 표시해요. |
| `NavigationDrawerMenu` | 주 메뉴와 연결된 하위 메뉴를 구성해요. |
| `NavigationDrawerItem` | 실제 메뉴 한 행을 표시해요. |
| `Divider` | 메뉴 그룹 사이를 시각적으로 구분해요. |

일반적인 구성은 다음 순서로 작성해요.

1. `NavigationDrawer`로 탐색 영역을 만들어요.
2. `NavigationDrawerCategory`로 메뉴 그룹의 제목을 표시해요.
3. `NavigationDrawerMenu`로 주 메뉴와 하위 메뉴를 구성해요.
4. 필요한 경우 `Divider`를 배치해 메뉴 그룹을 구분해요.

`NavigationDrawerMenu`는 내부에서 `NavigationDrawerItem`을 사용하므로 일반적인 메뉴 구성에서는 `NavigationDrawerItem`을 직접 조합하지 않아도 돼요.

## 03. 프로퍼티 (Properties)

### NavigationDrawer

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 화면 낭독기에 전달할 탐색 영역 설명이에요. |
| `children` | `ReactNode` | 필수 | Category, Menu, Divider 등을 배치해요. |
| `value` | `string` | `undefined` | 외부에서 제어하는 현재 선택 메뉴의 고유 값이에요. |
| `defaultValue` | `string` | `undefined` | 비제어 방식에서 처음 선택할 메뉴의 고유 값이에요. 생략하면 선택 없이 시작해요. |
| `onValueChange` | `(value: string) => void` | `undefined` | 하위 메뉴가 없는 주 메뉴 또는 하위 메뉴가 선택될 때 해당 값을 전달해요. |
| `className` | `string` | `undefined` | 루트 `nav`에 적용할 클래스 이름이에요. |

`NavigationDrawer`는 `value`가 전달되면 제어 방식으로 동작하고, 전달되지 않으면 `defaultValue`를 기준으로 내부에서 선택 상태를 관리해요.

### NavigationDrawerCategory

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `카테고리` | 카테고리 행에 표시할 제목이에요. |
| `className` | `string` | `undefined` | 루트 `div`에 적용할 클래스 이름이에요. |

### NavigationDrawerMenu

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `value` | `string` | 필수 | 주 메뉴를 구분하는 고유 값이에요. |
| `label` | `string` | 필수 | 주 메뉴에 표시할 이름이에요. |
| `outlinedIcon` | `ReactNode` | `undefined` | 비활성 상태의 주 메뉴에 표시할 아이콘이에요. |
| `filledIcon` | `ReactNode` | `undefined` | 활성 상태의 주 메뉴에 표시할 아이콘이에요. |
| `subItems` | `readonly NavigationDrawerSubItem[]` | `[]` | 주 메뉴 아래에 표시할 하위 메뉴 목록이에요. |
| `expanded` | `boolean` | `undefined` | 주 메뉴의 펼침 상태를 외부에서 제어해요. |
| `defaultExpanded` | `boolean` | `false` | 비제어 방식에서 처음 펼쳐질지 정해요. |
| `onExpandedChange` | `(expanded: boolean) => void` | `undefined` | 주 메뉴의 펼침 상태가 바뀔 때 다음 값을 전달해요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | `undefined` | 하위 메뉴가 없는 주 메뉴를 클릭했을 때 실행해요. |
| `onSubItemClick` | `(value: string, event: MouseEvent<HTMLButtonElement>) => void` | `undefined` | 하위 메뉴가 선택될 때 해당 값과 클릭 이벤트를 전달해요. |
| `className` | `string` | `undefined` | 주 메뉴의 루트 `button`에 적용할 클래스 이름이에요. |

각 `subItems` 항목은 다음 속성을 사용해요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `value` | `string` | 하위 메뉴를 구분하는 고유 값이에요. |
| `label` | `string` | 하위 메뉴에 표시할 이름이에요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | 해당 하위 메뉴를 클릭했을 때 실행해요. |
| `className` | `string` | 하위 메뉴 버튼에 적용할 클래스 이름이에요. |

하위 메뉴 항목에는 `ButtonHTMLAttributes`도 전달할 수 있어요.

`NavigationDrawerMenu`는 `NavigationDrawerItem`의 버튼 속성도 전달받아요.

- `type`: 버튼 타입이에요. 기본값은 `button`이에요.
- `expandable`: 주 메뉴의 펼침 아이콘 표시 여부를 정해요.
- `style`: 주 메뉴 버튼에 인라인 스타일을 적용해요.
- 그 외 버튼의 HTML 속성을 전달할 수 있어요.

### NavigationDrawerItem

직접 메뉴 행을 구성해야 할 때 사용하는 하위 컴포넌트예요.

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `label` | `string` | `라벨` | 메뉴에 표시할 이름이에요. |
| `variant` | `'main-menu' | 'sub-menu'` | `main-menu` | 주 메뉴 또는 하위 메뉴 형태를 정해요. |
| `active` | `boolean` | `false` | 현재 메뉴의 선택 상태를 표시해요. |
| `outlinedIcon` | `ReactNode` | `undefined` | 비활성 주 메뉴에 표시할 아이콘이에요. |
| `filledIcon` | `ReactNode` | `undefined` | 활성 주 메뉴에 표시할 아이콘이에요. |
| `expandable` | `boolean` | `false` | 주 메뉴 오른쪽에 펼침 아이콘을 표시하고 펼침 동작을 활성화해요. |
| `expanded` | `boolean` | `undefined` | 펼침 상태를 외부에서 제어해요. |
| `defaultExpanded` | `boolean` | `false` | 비제어 방식에서 처음 펼쳐질지 정해요. |
| `onExpandedChange` | `(expanded: boolean) => void` | `undefined` | 펼침 상태가 바뀔 때 다음 값을 전달해요. |
| `subItems` | `ReactNode` | `undefined` | 펼쳤을 때 표시할 하위 메뉴 콘텐츠예요. |
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | `undefined` | 메뉴를 클릭했을 때 실행해요. |
| `type` | `ButtonHTMLAttributes`의 `type` | `button` | 버튼 타입을 지정해요. |
| `className` | `string` | `undefined` | 루트 `button`에 적용할 클래스 이름이에요. |

## 04. 인터랙션 규칙 (Interaction)

### 메뉴 선택

- `NavigationDrawer` 전체에서 하나의 메뉴만 선택할 수 있어요.
- 하위 메뉴가 없는 주 메뉴를 선택하면 해당 메뉴의 `value`가 선택 상태가 돼요.
- 하위 메뉴를 선택하면 주 메뉴가 아닌 선택한 하위 메뉴의 `value`가 선택 상태가 돼요.
- 선택된 메뉴는 활성 스타일로 표시돼요.
- 활성 주 메뉴는 `filledIcon`을 표시하고, 비활성 주 메뉴는 `outlinedIcon`을 표시해요.
- 하위 메뉴는 아이콘 없이 표시돼요.

### 주 메뉴 펼침 및 접힘

- 하위 메뉴가 있는 주 메뉴를 클릭하면 하위 메뉴 영역이 열리거나 닫혀요.
- 펼침 상태는 `expanded` 또는 `defaultExpanded`로 설정할 수 있어요.
- `expanded`를 전달하면 외부에서 펼침 상태를 제어해요.
- `onExpandedChange`는 상태가 변경될 때 다음 펼침 값을 전달해요.
- 펼쳐진 상태에서는 위쪽 방향 아이콘, 접힌 상태에서는 아래쪽 방향 아이콘을 표시해요.

### 이벤트 실행 규칙

| 사용자 동작 | 실행되는 동작 |
| --- | --- |
| 하위 메뉴가 없는 주 메뉴 클릭 | `onClick` 실행 후 선택값 변경 및 `onValueChange` 실행 |
| 하위 메뉴가 있는 주 메뉴 클릭 | 하위 메뉴 영역 열기 또는 닫기 |
| 하위 메뉴 클릭 | 해당 항목의 `onClick` 실행 후 선택값 변경, `onValueChange`, `onSubItemClick` 실행 |

각 메뉴의 `onClick` 이벤트에서 `event.preventDefault()`를 호출하면 기본 선택 동작을 중단할 수 있어요. 이 경우 선택값 변경과 이후 콜백은 실행되지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 메뉴의 목적과 정보 구조에 따라 `NavigationDrawerCategory`로 항목을 구분해요.
- 각 주 메뉴와 하위 메뉴에 서로 다른 고유 `value`를 지정해요.
- 하위 메뉴가 있는 주 메뉴는 `subItems`로 구성해요.
- 현재 화면에 해당하는 메뉴의 선택 상태가 유지되도록 `value`를 관리해요.
- 아이콘을 사용하는 주 메뉴에는 `outlinedIcon`과 `filledIcon`을 함께 전달해요.
- `aria-label`에 탐색 영역의 목적을 설명하는 문구를 작성해요.

### Don't

- 서로 다른 메뉴에 동일한 `value`를 사용하지 않아요. 선택 상태가 구분되지 않을 수 있어요.
- 하위 메뉴가 있는데 주 메뉴를 페이지 이동 용도로 사용하지 않아요. 하위 메뉴가 있는 주 메뉴는 펼침과 접힘을 담당해요.
- 단순한 메뉴 그룹 제목을 클릭 가능한 메뉴로 만들지 않아요. 이 경우 `NavigationDrawerCategory`를 사용해요.
- 일반적인 메뉴 구성을 위해 `NavigationDrawerItem`을 직접 반복 조합하지 않아요. 주 메뉴와 하위 메뉴를 함께 관리하는 `NavigationDrawerMenu`를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 역할 및 사용 상황 |
| --- | --- |
| `NavigationDrawer` + `NavigationDrawerCategory` + `NavigationDrawerMenu` | 카테고리별로 주 메뉴와 하위 메뉴를 구성하는 기본 조합이에요. |
| `NavigationDrawer` + `NavigationDrawerMenu` + `Divider` | 카테고리 제목 없이 메뉴 그룹 사이를 구분할 때 사용해요. |
| `NavigationDrawerMenu` + `subItems` | 하나의 주 메뉴 아래 관련 하위 메뉴를 계층적으로 배치할 때 사용해요. |
| `NavigationDrawer` + `value` + `onValueChange` | 현재 페이지에 맞춰 선택 상태를 외부에서 관리할 때 사용해요. |

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| NavigationDrawer | `packages/ui/src/navigation/NavigationDrawer/NavigationDrawer.tsx` |
| NavigationDrawer Props | `packages/ui/src/navigation/NavigationDrawer/NavigationDrawer.types.ts` |
| NavigationDrawer 상태 관리 | `packages/ui/src/navigation/NavigationDrawer/useNavigationDrawer.ts` |
| NavigationDrawer Context | `packages/ui/src/navigation/NavigationDrawer/NavigationDrawerContext.ts` |
| NavigationDrawer CSS | `packages/ui/src/navigation/NavigationDrawer/NavigationDrawer.css` |
| NavigationDrawerCategory | `packages/ui/src/navigation/NavigationDrawerCategory/NavigationDrawerCategory.tsx` |
| NavigationDrawerCategory Props | `packages/ui/src/navigation/NavigationDrawerCategory/NavigationDrawerCategory.types.ts` |
| NavigationDrawerCategory CSS | `packages/ui/src/navigation/NavigationDrawerCategory/NavigationDrawerCategory.css` |
| NavigationDrawerMenu | `packages/ui/src/navigation/NavigationDrawerMenu/NavigationDrawerMenu.tsx` |
| NavigationDrawerMenu Props | `packages/ui/src/navigation/NavigationDrawerMenu/NavigationDrawerMenu.types.ts` |
| NavigationDrawerItem | `packages/ui/src/navigation/NavigationDrawerItem/NavigationDrawerItem.tsx` |
| NavigationDrawerItem Props | `packages/ui/src/navigation/NavigationDrawerItem/NavigationDrawerItem.types.ts` |
| NavigationDrawerItem 상태 관리 | `packages/ui/src/navigation/NavigationDrawerItem/useNavigationDrawerItem.ts` |
| NavigationDrawerItem CSS | `packages/ui/src/navigation/NavigationDrawerItem/NavigationDrawerItem.css` |
| Storybook | `apps/storybook/stories/NavigationDrawer.stories.tsx` |