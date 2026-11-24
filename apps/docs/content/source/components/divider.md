# 디바이더

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

Divider는 콘텐츠 사이를 가로선으로 구분하는 컴포넌트예요.

- 서로 다른 콘텐츠나 항목 사이에 시각적 경계를 표시할 때 사용해요.
- 목록, 설정 화면, 콘텐츠 섹션처럼 정보가 이어지는 영역을 구분할 때 사용할 수 있어요.
- 구현상 네이티브 `hr` 요소를 사용하므로, 단순 장식선이 아니라 주제나 맥락의 구분을 나타내는 위치에 사용하는 것이 적합해요.

Divider는 구분선만 렌더링해요. 콘텐츠 간 여백이나 그룹 레이아웃을 별도로 관리하지 않아요.

## 02. 컴포넌트 구조 (Structure)

Divider는 네이티브 `hr` 요소 하나로 구성돼요.

- **Root (`hr`)**: 가로 구분선을 표시해요.
- 별도의 내부 자식 요소는 없어요.
- 컴포넌트에 전달한 HTML 속성은 루트 `hr`에 전달돼요.

## 03. 프로퍼티 (Properties)

### Variant / Size / State

별도의 Variant, Size, State Props는 제공하지 않아요.

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `className` | `string` | - | 루트 `hr`에 추가할 클래스 이름이에요. |

`DividerProps`는 `HTMLAttributes<HTMLHRElement>`를 상속해요. 따라서 `id`, `style`, `aria-*` 등 일반적인 HTML 속성을 전달할 수 있어요.

### 기본 스타일

| 항목 | 구현 |
| --- | --- |
| 요소 | 네이티브 `hr` |
| 너비 | 부모 영역 기준 `100%` |
| 높이 | `1px` |
| 바깥 여백 | `0` |
| 테두리 | 없음 |
| 배경색 | `--eli-border-divider`, 토큰이 없으면 `#eaf0f9` |

방향, 두께, 색상을 지정하는 전용 Props는 제공하지 않아요. 스타일을 변경하려면 `className` 또는 `style`을 사용해요.

## 04. 인터랙션 규칙 (Interaction)

Divider 자체에는 선택 상태나 사용자 인터랙션을 구현하지 않아요.

- 내부 상태를 관리하지 않아요.
- 클릭, Hover, Pressed에 따른 별도 동작이나 스타일을 구현하지 않아요.
- 전달된 HTML 속성은 루트 `hr`에 적용돼요. 따라서 필요하다면 표준 HTML 속성을 전달할 수 있지만, Divider 자체가 인터랙션 동작을 제공하는 것은 아니에요.
- 기본 CSS의 위아래 여백은 `0`이에요. Divider가 콘텐츠 사이 간격을 자동으로 추가하지 않아요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 콘텐츠의 주제나 맥락이 바뀌는 지점을 구분할 때 사용해요.
- 부모 컨테이너의 너비를 기준으로 구분선이 표시된다는 점을 고려해 배치해요.
- 구분선 위아래 간격이 필요하면 부모 레이아웃의 `gap`이나 별도 여백으로 관리해요.
- Divider가 차지하는 영역을 제한하려면 원하는 너비의 컨테이너 안에 배치해요.

### Don’t

- Divider가 위아래 여백까지 자동으로 제공한다고 가정하지 않아요.
- 버튼, 선택 항목처럼 사용자 조작이 필요한 요소를 대신하는 용도로 사용하지 않아요.
- 단순히 장식적인 선만 필요한 모든 위치에 의미적 구분 요소인 `hr`을 무조건 사용하지 않아요.
- Divider에 방향이나 두께를 지정하는 전용 Props가 있다고 가정하지 않아요.

### Alternative

- 콘텐츠 사이에 선 없이 간격만 필요하다면 부모 레이아웃의 `gap`이나 요소의 여백을 사용해요.
- 단순 장식선이 필요하다면 의미적 구분을 나타내는 `hr` 대신 일반 요소와 CSS border 등 장식 목적의 스타일을 사용해요.
- 영역 자체를 구분해야 한다면 컨테이너의 배경이나 테두리 스타일을 사용해요.

### Reason

Divider는 네이티브 `hr`을 기반으로 하는 가로 구분 요소예요. 콘텐츠의 의미적 구분, 단순 간격, 장식선은 서로 다른 목적이므로 화면에서 필요한 역할에 맞춰 선택해야 해요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 및 규칙 |
| --- | --- | --- |
| 목록 항목 + Divider | 연속된 목록 항목을 구분할 때 | 각 항목은 정보를 표시하고 Divider는 항목 사이의 구분을 나타내요. |
| 콘텐츠 섹션 + Divider | 한 화면 안에서 서로 다른 콘텐츠 주제를 나눌 때 | 각 섹션은 관련 콘텐츠를 묶고 Divider는 섹션 사이의 주제 전환을 나타내요. |
| 설정 그룹 + Divider | 설정 화면에서 서로 다른 설정 묶음을 구분할 때 | 설정 그룹은 관련 옵션을 포함하고 Divider는 그룹 사이의 경계를 표시해요. |

Divider는 부모 너비를 기준으로 표시되므로, 특정 목록이나 콘텐츠 그룹에만 적용하려면 해당 영역 안에 배치해요. 위아래 간격은 Divider가 아니라 부모 레이아웃에서 관리해요.

```tsx
import { Divider } from '@eli-team/ui';

<div className="settings-list">
  <section>
    {/* 첫 번째 설정 그룹 */}
  </section>

  <Divider />

  <section>
    {/* 두 번째 설정 그룹 */}
  </section>
</div>
```

위 예시의 `section`과 레이아웃 간격은 사용하는 화면에서 구성해요. Divider가 그룹 구조나 여백을 생성하지는 않아요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/divider/Divider/Divider.tsx` |
| Props Type | `packages/ui/src/divider/Divider/Divider.types.ts` |
| CSS | `packages/ui/src/divider/Divider/Divider.css` |
| Storybook | `apps/storybook/stories/Divider.stories.tsx` |
| Export | `packages/ui/src/divider/index.ts` |