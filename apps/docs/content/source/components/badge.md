# 뱃지

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Badge는 짧은 상태나 분류 정보를 작은 라벨로 표시하는 컴포넌트예요.

- 콘텐츠의 상태, 유형, 분류처럼 핵심 정보를 간결하게 전달할 때 사용해요.
- 제목이나 본문과 구분되는 보조 정보를 표시할 때 적합해요.
- 상태나 분류를 색상으로 구분하되, 텍스트를 통해 의미도 함께 전달해요.

## 02. 컴포넌트 구조 (Structure)

Badge는 하나의 루트 `span`으로 구성돼요.

- **Badge (`span`)**: `children`으로 전달된 텍스트나 콘텐츠를 표시해요.
- 별도의 아이콘이나 내부 요소는 포함하지 않아요.
- `children`은 필수이며, 표시할 내용이 없는 Badge는 사용할 수 없어요.

## 03. 프로퍼티 (Properties)

### Size

| 값 | 설명 |
| --- | --- |
| `medium` | 기본 크기예요. |
| `large` | Medium보다 큰 텍스트 크기를 사용해요. |

기본값은 `medium`이에요.

### Type

| 값 | 의미 | 사용 예시 |
| --- | --- | --- |
| `neutral` | 일반적인 상태나 분류 | 기본 정보, 일반 카테고리 |
| `error` | 오류 또는 실패 | 오류, 실패, 거절 |
| `success` | 성공 또는 완료 | 완료, 승인, 성공 |
| `caution` | 주의가 필요한 상태 | 대기, 확인 필요, 주의 |

기본값은 `neutral`이에요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | 필수 | Badge에 표시할 내용이에요. |
| `size` | `BadgeSize` | `medium` | Badge의 크기를 지정해요. |
| `type` | `BadgeType` | `neutral` | 의미에 따른 색상 유형을 지정해요. |
| `className` | `string` | - | 루트 `span`에 추가할 클래스 이름이에요. |
| `style` | `CSSProperties` | - | 루트 `span`에 인라인 스타일을 전달해요. |

그 외에도 `HTMLAttributes<HTMLSpanElement>`를 상속하므로 `id`, `title`, `aria-*` 등 일반적인 HTML 속성을 전달할 수 있어요. 단, `children`은 별도로 정의해요.

## 04. 인터랙션 규칙 (Interaction)

Badge는 정보를 표시하는 용도이며, 자체적인 인터랙션이나 상태 변경 기능은 제공하지 않아요.

- 클릭이나 선택에 따른 동작을 처리하지 않아요.
- Hover, Pressed, Disabled 등의 별도 상태를 제공하지 않아요.
- `type`과 `size`는 전달된 Props에 따라 표시 형태를 결정해요.
- 클릭 가능한 요소로 사용해야 한다면 Badge 대신 Button이나 적절한 인터랙티브 컴포넌트를 사용해요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 상태나 분류를 짧은 텍스트로 표현해요.
- `type`은 텍스트가 전달하는 의미에 맞춰 선택해요.
- 동일한 맥락에서 사용하는 Badge는 의미에 따른 `type`을 일관되게 적용해요.
- 색상만으로 상태를 구분하지 않고 텍스트도 함께 제공해요.

### Don't

- 긴 설명이나 여러 문장으로 구성된 콘텐츠를 넣지 않아요.
- Badge 자체를 버튼이나 링크처럼 사용하지 않아요.
- 실제 의미와 관계없이 시각적인 강조만을 목적으로 `error`, `success`, `caution`을 사용하지 않아요.
- 상태를 텍스트 없이 색상만으로 전달하지 않아요.

### 대안

- 사용자의 행동을 실행해야 한다면 `Button`을 사용해요.
- 여러 항목 중 하나를 선택하거나 필터링해야 한다면 `Chip` 또는 `FilterChip`을 사용해요.
- 오류나 성공에 대한 설명이 필요하다면 `Alert`를 사용해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| Badge + Text | 목록이나 카드의 상태 표시 | Badge는 상태를, Text는 상세 내용을 전달해요. |
| Badge + 제목 | 콘텐츠의 유형이나 카테고리 표시 | Badge는 분류를, 제목은 콘텐츠의 핵심 정보를 전달해요. |
| Badge + Card | 카드 내부의 상태나 속성 표시 | 카드 콘텐츠와 관련된 보조 정보를 구분해 보여줘요. |

Badge는 주요 콘텐츠를 대체하지 않으며, 제목이나 본문을 보완하는 정보로 배치해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/badge/Badge/Badge.tsx` |
| Props Type | `packages/ui/src/badge/Badge/Badge.types.ts` |
| CSS | `packages/ui/src/badge/Badge/Badge.css` |
| Storybook | `apps/storybook/stories/Badge.stories.tsx` |
| Export | `packages/ui/src/badge/index.ts` |