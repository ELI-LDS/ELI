# 툴팁

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Tooltip은 화면 요소에 대한 짧은 보충 설명을 표시하는 컴포넌트예요.

- 버튼이나 아이콘의 기능처럼 화면만으로 의미를 파악하기 어려운 내용을 설명할 때 사용해요.
- 사용자가 특정 요소의 의미나 동작을 추가로 이해할 수 있도록 보조 정보를 제공해요.
- 화면에 항상 노출할 필요는 없지만, 필요할 때 확인할 수 있는 짧은 설명에 적합해요.

Tooltip은 설명을 표시하는 UI만 제공해요. 어떤 요소를 기준으로 표시할지, 언제 나타나고 사라질지, 화면 어디에 배치할지는 사용하는 화면에서 구현해야 해요.

## 02. 컴포넌트 구조 (Structure)

Tooltip은 설명을 감싸는 루트 `div`와 내용 영역인 `span`으로 구성돼요.

- **Root (`div`)**: Tooltip 전체 영역이에요. `role="tooltip"`이 적용돼요.
- **Content (`span`)**: 실제 설명 내용을 표시해요. `children`으로 전달한 내용을 렌더링해요.

별도의 아이콘이나 닫기 버튼은 포함하지 않아요.

## 03. 프로퍼티 (Properties)

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | Tooltip에 표시할 설명이에요. |
| `className` | `string` | - | 루트 `div`에 추가할 클래스 이름이에요. |

그 외에도 `HTMLAttributes<HTMLDivElement>`를 상속하므로 일반적인 HTML 속성을 전달할 수 있어요. `style`도 루트 `div`에 적용돼요. 단, `children`과 `role`은 별도로 제외돼요.

`role`은 컴포넌트에서 `tooltip`으로 고정해 적용해요.

## 04. 인터랙션 규칙 (Interaction)

Tooltip 자체에는 열기·닫기 상태나 이벤트 처리가 구현되어 있지 않아요.

- `children`으로 전달한 내용을 표시해요.
- 줄바꿈 문자가 포함된 내용은 줄바꿈을 유지해 표시해요.
- 내용이 길면 여러 줄로 표시해요.
- 내용의 최대 너비는 200px이에요.
- 표시 위치, 노출 조건, 표시 시간은 사용하는 화면에서 제어해야 해요.

Tooltip은 트리거 요소와 자동으로 연결되지 않아요. Hover, Focus, Click 등의 이벤트도 자체적으로 처리하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 아이콘이나 버튼의 기능을 보충 설명할 때 사용해요.
- 설명은 사용자가 해당 요소를 이해하는 데 필요한 내용으로 작성해요.
- 트리거 요소와 Tooltip의 표시 조건 및 위치를 사용하는 화면에서 연결해요.
- Tooltip을 표시하는 트리거 요소와 설명의 의미가 일치하도록 구성해요.

### Don't

- 긴 안내문이나 여러 단계의 사용 방법을 전달하는 용도로 사용하지 않아요.
- Tooltip에 주요 정보나 필수 안내를 넣지 않아요.
- Tooltip이 자체적으로 Hover나 Focus에 반응한다고 가정하지 않아요.
- Tooltip만으로 트리거 요소의 접근성 이름을 대체하지 않아요.

### 대안

- 항상 노출되어야 하는 안내는 `Text`나 `Alert`를 사용해요.
- 사용자가 내용을 입력하는 과정에서 발생한 오류는 `TextField` 등 해당 입력 컴포넌트의 상태와 안내를 사용해요.
- 사용자의 행동에 대한 일시적인 피드백은 `SnackBar`를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| IconButton + Tooltip | 아이콘만으로 기능을 이해하기 어려운 경우 | IconButton은 행동을 제공하고 Tooltip은 기능을 설명해요. |
| Button + Tooltip | 버튼의 동작에 추가 설명이 필요한 경우 | Button은 행동을 제공하고 Tooltip은 보충 정보를 전달해요. |
| 입력 컴포넌트 + Tooltip | 입력 항목에 대한 짧은 설명이 필요한 경우 | 입력 컴포넌트는 값을 받고 Tooltip은 입력 기준을 설명해요. |

Tooltip을 다른 컴포넌트와 조합할 때는 트리거 요소의 이벤트와 Tooltip의 표시 상태를 사용하는 화면에서 연결해야 해요. Tooltip 컴포넌트가 이 동작을 자동으로 처리하지는 않아요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/tooltip/Tooltip/Tooltip.tsx` |
| Props Type | `packages/ui/src/tooltip/Tooltip/Tooltip.types.ts` |
| CSS | `packages/ui/src/tooltip/Tooltip/Tooltip.css` |
| Storybook | `apps/storybook/stories/Tooltip.stories.tsx` |
| Export | `packages/ui/src/tooltip/index.ts` |