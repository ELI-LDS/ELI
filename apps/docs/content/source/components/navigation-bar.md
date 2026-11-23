# 내비게이션 바

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

NavigationBar는 사용자가 서비스의 주요 화면 사이를 이동할 수 있도록 제공하는 하단 탐색 컴포넌트예요.

- 홈, 검색, 알림, 저장, 내 정보처럼 서비스의 주요 화면을 이동할 때 사용해요.
- 현재 사용자가 어느 화면에 있는지 활성 상태로 표시해요.
- 탐색 항목의 의미를 텍스트로 전달하는 일반형과 아이콘 중심으로 전달하는 글래스형을 제공해요.

NavigationBar와 NavigationBarGlass는 탐색 기능은 동일하지만, 정보 전달 방식과 배경 표현에 차이가 있어요.

| 구분 | NavigationBar | NavigationBarGlass |
| --- | --- | --- |
| 정보 전달 | 아이콘과 텍스트 라벨 | 아이콘 중심 |
| 라벨 | 화면에 표시 | 화면에 표시하지 않음 |
| 아이콘 크기 | 24px | 28px |
| 배경 | 불투명한 배경 | 배경이 비치는 반투명 배경 |
| 형태 | 화면 하단에 배치하는 탐색 영역 | 둥근 형태의 글래스 탐색 영역 |

## 02. 컴포넌트 구조 (Structure)

NavigationBar는 여러 개의 NavigationBarItem을 포함하는 탐색 영역이에요.

- **NavigationBar**: 탐색 영역을 구성하는 루트 요소예요. HTML `nav` 요소를 사용해요.
- **NavigationBarItem**: 개별 화면으로 이동하기 위한 버튼이에요.
    - **Icon**: 비활성 상태에서는 `outlinedIcon`, 활성 상태에서는 `filledIcon`을 표시해요.
    - **Label**: 아이콘 아래에 항목의 이름을 표시해요.

NavigationBarGlass는 여러 개의 NavigationBarGlassItem을 포함하는 글래스 탐색 영역이에요.

- **NavigationBarGlass**: 글래스 효과가 적용된 탐색 영역이에요. HTML `nav` 요소를 사용해요.
    - **Track**: 개별 항목과 활성 Indicator를 포함하는 영역이에요.
    - **Indicator**: 현재 선택된 항목의 위치를 표시해요.
- **NavigationBarGlassItem**: 개별 화면으로 이동하기 위한 버튼이에요.
    - **Icon**: 비활성 상태에서는 `outlinedIcon`, 활성 상태에서는 `filledIcon`을 표시해요.
    - **Label**: 화면에는 표시하지 않고 화면 낭독기에 항목의 이름을 전달해요.

두 컴포넌트의 공통 구조와 차이는 다음과 같아요.

- 두 컴포넌트 모두 3개부터 5개까지의 항목을 제공해요.
- 각 항목은 아이콘을 통해 현재 선택 상태를 구분해요.
- 일반형은 아이콘과 라벨을 함께 표시해요.
- 글래스형은 라벨을 숨기고 아이콘만 표시하며, 활성 항목은 별도의 Indicator로 구분해요.

## 03. 프로퍼티 (Properties)

### Variant

별도의 Variant Props는 제공하지 않아요. 정보 전달 방식과 배경 표현에 따라 `NavigationBar`와 `NavigationBarGlass` 중 하나를 선택해요.

### Size

별도의 Size Props는 제공하지 않아요.

두 컴포넌트는 아이콘 크기와 항목 구성이 다르게 구현돼 있어요.

| 구분 | NavigationBar | NavigationBarGlass |
| --- | --- | --- |
| 아이콘 크기 | 24px | 28px |
| 라벨 | 표시 | 미표시 |

### State

두 컴포넌트 모두 `value` 또는 `defaultValue`를 기준으로 활성 항목을 결정해요.

| 상태 | NavigationBar | NavigationBarGlass |
| --- | --- | --- |
| Active | `filledIcon`과 활성 색상을 적용해요. | `filledIcon`과 활성 Indicator를 표시해요. |
| Default | `outlinedIcon`을 표시해요. | `outlinedIcon`을 표시해요. |

활성 항목에는 `aria-current="page"`가 적용돼요.

### NavigationBar Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 화면 낭독기에 전달할 탐색 영역의 설명이에요. |
| `items` | `NavigationBarOptions` | 필수 | 탐색 항목 목록이에요. 3~5개의 항목을 전달해야 해요. |
| `value` | `string` | - | 외부에서 제어하는 활성 항목의 값이에요. |
| `defaultValue` | `string` | 첫 번째 항목의 `value` | 비제어 방식에서 처음 활성화할 항목의 값이에요. |
| `onValueChange` | `(value: string) => void` | - | 항목을 선택하면 해당 항목의 `value`를 전달하는 콜백이에요. |
| `className` | `string` | - | 루트 `nav` 요소에 추가할 CSS 클래스예요. |

`NavigationBarOptions`는 3개, 4개 또는 5개의 `NavigationBarOption`으로 구성된 배열 타입이에요.

각 항목은 다음 속성을 포함해야 해요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `value` | `string` | 항목을 구분하는 고유 값이에요. |
| `label` | `string` | 화면에 표시할 한 줄 라벨이에요. |
| `outlinedIcon` | `ReactNode` | 비활성 상태에서 표시할 아이콘이에요. |
| `filledIcon` | `ReactNode` | 활성 상태에서 표시할 아이콘이에요. |

그 외에 HTML `nav` 요소의 속성을 전달할 수 있어요. `children`, `defaultValue`, `onChange`는 상속 대상에서 제외돼요.

### NavigationBarGlass Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 화면 낭독기에 전달할 탐색 영역의 설명이에요. |
| `items` | `NavigationBarGlassOptions` | 필수 | 탐색 항목 목록이에요. 3~5개의 항목을 전달해야 해요. |
| `value` | `string` | - | 외부에서 제어하는 활성 항목의 값이에요. |
| `defaultValue` | `string` | 첫 번째 항목의 `value` | 비제어 방식에서 처음 활성화할 항목의 값이에요. |
| `onValueChange` | `(value: string) => void` | - | 항목을 선택하면 해당 항목의 `value`를 전달하는 콜백이에요. |
| `className` | `string` | - | 루트 `nav` 요소에 추가할 CSS 클래스예요. |

`NavigationBarGlassOptions`는 3개, 4개 또는 5개의 `NavigationBarGlassOption`으로 구성된 배열 타입이에요.

각 항목은 다음 속성을 포함해야 해요.

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `value` | `string` | 항목을 구분하는 고유 값이에요. |
| `label` | `string` | 화면에 표시하지 않고 화면 낭독기에 전달할 항목 설명이에요. |
| `outlinedIcon` | `ReactNode` | 비활성 상태에서 표시할 아이콘이에요. |
| `filledIcon` | `ReactNode` | 활성 상태에서 표시할 아이콘이에요. |

그 외에 HTML `nav` 요소의 속성을 전달할 수 있어요. `children`, `defaultValue`, `onChange`는 상속 대상에서 제외돼요.

### 프로퍼티 조합

- 두 컴포넌트 모두 `items`는 3~5개의 항목으로 구성해야 해요.
- 각 항목의 `value`는 서로 다른 값으로 지정해야 해요.
- 각 항목에는 `value`, `label`, `outlinedIcon`, `filledIcon`을 모두 전달해야 해요.
- 일반형의 `label`은 화면에 표시되고, 글래스형의 `label`은 화면에 표시되지 않아요. 글래스형에서도 접근성을 위해 `label`을 반드시 전달해야 해요.
- `value`를 전달하면 제어 방식으로 동작하고, 전달하지 않으면 비제어 방식으로 동작해요.
- `value`와 `defaultValue`를 함께 전달하면 `value`가 활성 항목을 결정해요.

## 04. 인터랙션 규칙 (Interaction)

### 항목 선택

- 항목을 선택하면 해당 항목의 `value`를 선택 값으로 전달해요.
- 선택된 항목은 `filledIcon`으로 변경되고 활성 상태로 표시돼요.
- 기존 활성 항목은 비활성 상태로 변경되고 `outlinedIcon`을 표시해요.
- 항목을 선택하면 `onValueChange`가 해당 항목의 `value`를 인자로 실행돼요.

### 상태 관리

두 컴포넌트 모두 제어 방식과 비제어 방식을 지원해요.

**제어 방식**

- `value`를 전달하면 외부에서 활성 항목을 관리해요.
- 항목을 선택하면 `onValueChange`가 실행되지만, 실제 활성 상태는 외부에서 전달하는 `value`에 따라 변경돼요.
- 따라서 `onValueChange`에서 상태를 갱신해야 선택 상태가 화면에 반영돼요.

**비제어 방식**

- `value`를 전달하지 않으면 컴포넌트 내부에서 활성 항목을 관리해요.
- `defaultValue`를 전달하면 해당 값의 항목이 처음 활성화돼요.
- `defaultValue`를 생략하면 첫 번째 항목이 활성화돼요.
- 항목을 선택하면 내부 선택 값이 갱신돼요.

### NavigationBar 인터랙션

- 각 항목은 HTML `button` 요소로 구현돼 있어 클릭과 키보드 입력을 지원해요.
- Hover와 Pressed 상태에서 항목의 배경이 변경돼요.
- 활성 항목에는 `aria-current="page"`가 적용돼요.

### NavigationBarGlass 인터랙션

- 항목을 클릭하거나 키보드로 선택할 수 있어요.
- Indicator를 드래그해 다른 항목으로 이동할 수 있어요.
- 항목을 선택하면 Indicator가 해당 항목의 위치로 이동해요.
- 활성 항목에는 `aria-current="page"`가 적용돼요.
- 포인터를 누르거나 드래그하는 동안 탐색 영역과 Indicator에 별도의 시각적 반응이 나타나요.

### 제한 사항

- 두 컴포넌트 모두 3~5개의 항목만 지원해요.
- 컴포넌트 자체에서 화면 이동이나 라우팅을 수행하지 않아요. 실제 화면 이동은 `onValueChange`를 통해 사용하는 쪽에서 처리해야 해요.
- 전달한 `value`가 `items`에 없는 값이면 활성 항목이 표시되지 않을 수 있어요.
- 일반형은 라벨이 한 줄로 표시되며, 영역을 초과하면 말줄임표로 처리돼요.
- 글래스형은 화면에 라벨을 표시하지 않으므로 아이콘만으로 항목의 의미를 구분할 수 있어야 해요.

## 05. 사용 가이드 (Usage Guidelines)

### NavigationBar

메뉴의 의미를 텍스트 라벨로 명확하게 전달해야 할 때 사용해요.

**Do**

- 아이콘만으로 메뉴의 의미를 파악하기 어려운 경우 사용해요.
- 각 메뉴의 이름을 라벨로 명확하게 표시해요.
- 여러 기능을 제공하는 서비스에서 메뉴의 의미를 빠르게 파악할 수 있도록 구성해요.
- 아이콘과 라벨이 동일한 기능을 설명하도록 구성해요.

**Don't**

- 라벨에 메뉴의 의미와 관계없는 설명을 길게 작성하지 않아요.
- 아이콘과 라벨이 서로 다른 의미를 전달하도록 구성하지 않아요.

### NavigationBarGlass

아이콘 중심으로 메뉴를 간결하게 전달하고, 화면 콘텐츠와 탐색 영역이 자연스럽게 어우러져야 할 때 사용해요.

**Do**

- 아이콘만으로 메뉴의 의미를 충분히 이해할 수 있는 경우 사용해요.
- 홈, 검색, 알림 등 사용자가 익숙하게 인식하는 아이콘을 활용해요.
- 각 항목에 화면 낭독기를 위한 `label`을 반드시 전달해요.
- 반투명한 배경과 화면 콘텐츠가 조화를 이루는 레이아웃에 사용해요.
- 배경이 비쳐도 아이콘과 활성 상태를 명확하게 구분할 수 있는 화면에서 사용해요.

**Don't**

- 아이콘만으로 의미를 파악하기 어려운 메뉴를 무리하게 구성하지 않아요.
- 접근성 라벨을 생략하지 않아요.
- 배경 콘텐츠와 겹쳤을 때 아이콘이나 Indicator가 잘 보이지 않는 화면에 사용하지 않아요.

### Alternative

- 메뉴의 의미를 텍스트로 안내해야 한다면 NavigationBar를 사용해요.
- 아이콘만으로 메뉴를 구분할 수 있고 글래스 스타일의 탐색 영역이 화면 구성에 적합하다면 NavigationBarGlass를 사용해요.
- 메뉴가 5개를 초과하거나 계층적인 탐색 구조가 필요하다면 다른 탐색 컴포넌트를 검토해요.

### Reason

두 컴포넌트의 선택 기준은 글래스 스타일의 유행 여부가 아니라 탐색 정보를 전달하는 방식과 화면 구성에 있어요.

NavigationBar는 아이콘과 텍스트를 함께 제공해 메뉴의 의미를 명확하게 전달해요. NavigationBarGlass는 라벨을 화면에서 제거하고 아이콘을 28px로 확대해 아이콘 중심으로 탐색할 수 있도록 구성해요. 또한 반투명한 배경을 통해 화면 콘텐츠와 탐색 영역이 자연스럽게 연결돼요.

따라서 메뉴의 의미를 텍스트로 안내해야 하는지, 아이콘만으로 충분히 전달할 수 있는지를 먼저 판단하고 화면의 배경 및 레이아웃과 어울리는 컴포넌트를 선택해요.

## 06. 추천 조합 (Composition)

### NavigationBar + NavigationBarItem

일반형 탐색 영역을 구성할 때 사용해요.

| 컴포넌트 | 역할 |
| --- | --- |
| NavigationBar | 주요 탐색 영역을 구성해요. |
| NavigationBarItem | 개별 화면의 아이콘과 텍스트 라벨을 표시해요. |

**조합 규칙**

- NavigationBar의 `items`에 각 항목의 정보를 전달해요.
- 각 항목은 `value`, `label`, `outlinedIcon`, `filledIcon`으로 구성해요.
- 선택 상태는 항목의 `value`를 기준으로 관리해요.

### NavigationBarGlass + NavigationBarGlassItem

글래스형 탐색 영역을 구성할 때 사용해요.

| 컴포넌트 | 역할 |
| --- | --- |
| NavigationBarGlass | 글래스 효과와 활성 Indicator를 포함한 탐색 영역을 구성해요. |
| NavigationBarGlassItem | 개별 화면의 아이콘을 표시하고 접근성 라벨을 제공해요. |

**조합 규칙**

- NavigationBarGlass의 `items`에 각 항목의 정보를 전달해요.
- 각 항목은 `value`, `label`, `outlinedIcon`, `filledIcon`으로 구성해요.
- `label`은 화면에 표시되지 않지만 접근성을 위해 반드시 전달해요.
- 선택 상태는 항목의 `value`를 기준으로 관리해요.

### NavigationBar + 화면 상태 관리

NavigationBar에서 선택한 항목에 따라 실제 화면을 변경할 때 함께 사용해요.

| 구성 요소 | 역할 |
| --- | --- |
| NavigationBar | 사용자가 선택한 항목의 `value`를 전달해요. |
| 상태 관리 로직 | 선택한 `value`를 저장하고 화면에 반영해요. |
| 화면 콘텐츠 | 현재 선택된 항목에 해당하는 화면을 표시해요. |

**조합 규칙**

- `value`와 `onValueChange`를 사용해 선택 상태를 외부에서 관리해요.
- `onValueChange`에서 선택 값을 갱신하거나 라우팅 로직을 실행해요.
- NavigationBar의 선택 상태와 실제 표시되는 화면이 일치하도록 구성해요.

NavigationBarGlass도 동일한 방식으로 화면 상태 관리 로직과 조합할 수 있어요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| NavigationBar Component | `packages/ui/src/navigation/NavigationBar/NavigationBar.tsx` |
| NavigationBar Props Type | `packages/ui/src/navigation/NavigationBar/NavigationBar.types.ts` |
| NavigationBar State Hook | `packages/ui/src/navigation/NavigationBar/useNavigationBar.ts` |
| NavigationBar CSS | `packages/ui/src/navigation/NavigationBar/NavigationBar.css` |
| NavigationBarItem Component | `packages/ui/src/navigation/NavigationBarItem/NavigationBarItem.tsx` |
| NavigationBarItem Props Type | `packages/ui/src/navigation/NavigationBarItem/NavigationBarItem.types.ts` |
| NavigationBarItem CSS | `packages/ui/src/navigation/NavigationBarItem/NavigationBarItem.css` |
| NavigationBar Storybook | `apps/storybook/stories/NavigationBar.stories.tsx` |
| NavigationBarItem Storybook | `apps/storybook/stories/NavigationBarItem.stories.tsx` |
| NavigationBarGlass Component | `packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.tsx` |
| NavigationBarGlass Props Type | `packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.types.ts` |
| NavigationBarGlass State Hook | `packages/ui/src/navigation/NavigationBarGlass/useNavigationBarGlass.ts` |
| NavigationBarGlass CSS | `packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.css` |
| NavigationBarGlassItem Component | `packages/ui/src/navigation/NavigationBarGlassItem/NavigationBarGlassItem.tsx` |
| NavigationBarGlassItem Props Type | `packages/ui/src/navigation/NavigationBarGlassItem/NavigationBarGlassItem.types.ts` |
| NavigationBarGlassItem CSS | `packages/ui/src/navigation/NavigationBarGlassItem/NavigationBarGlassItem.css` |
| NavigationBarGlass Storybook | `apps/storybook/stories/NavigationBarGlass.stories.tsx` |
| NavigationBarGlassItem Storybook | `apps/storybook/stories/NavigationBarGlassItem.stories.tsx` |