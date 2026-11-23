# 로딩 스피너 (로딩 인디케이터)

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

LoadingIndicator는 화면이나 특정 영역에서 작업이 진행 중임을 원형으로 표시하는 컴포넌트예요.

작업의 완료 비율을 알 수 있는지에 따라 두 가지 방식으로 표시해요.

- **Determinate**: 작업의 진행률을 알고 있을 때 사용해요. 현재 진행률을 원형 그래픽으로 표현해요.
- **Indeterminate**: 작업의 진행률을 알 수 없을 때 사용해요. 반복 애니메이션으로 작업이 진행 중임을 표현해요.

콘텐츠 로딩, 파일 처리, 데이터 요청처럼 작업이 완료되기까지 기다려야 하는 상황에 사용할 수 있어요.

## 02. 컴포넌트 구조 (Structure)

LoadingIndicator는 루트 `div`와 진행 상태를 표시하는 내부 `span`으로 구성돼요.

### Determinate

- **Root (`div`)**: 전체 LoadingIndicator를 감싸요.
- **Determinate Indicator (`span`)**: 전달받은 진행률에 해당하는 원형 그래픽을 표시해요.

진행률에 따라 서로 다른 SVG 이미지를 사용해요.

### Indeterminate

- **Root (`div`)**: 전체 LoadingIndicator를 감싸요.
- **Track (`span`)**: 원형 진행 표시의 기본 트랙을 나타내요.
- **Active Indicator (`span`)**: 트랙 위에서 회전하며 작업이 진행 중임을 나타내요.

Active Indicator는 내부 `::before` 요소에 그래픽을 표시하고, 회전 애니메이션을 적용해요.

## 03. 프로퍼티 (Properties)

### 표시 방식

별도의 `state`나 `variant`로 Determinate와 Indeterminate를 선택하지 않아요. `progress` 전달 여부에 따라 표시 방식이 결정돼요.

| 표시 방식 | 조건 | 설명 |
| --- | --- | --- |
| Determinate | `progress` 전달 | 진행률에 해당하는 원형 그래픽을 표시해요. |
| Indeterminate | `progress` 생략 | 반복 애니메이션으로 작업 중임을 표시해요. |

### Indeterminate Variant

`variant`는 Indeterminate 상태에서 사용할 회전 방식을 지정해요.

| 값 | 설명 |
| --- | --- |
| `continuous` | 일정한 속도로 끊김 없이 회전해요. 기본값이에요. |
| `cycle` | 2초 주기로 회전 속도가 가감속하는 애니메이션을 반복해요. |

`variant`는 Determinate 상태의 그래픽에는 영향을 주지 않아요.

### State

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Determinate | `progress`가 전달된 상태 | 전달된 진행률에 해당하는 원형 그래픽을 표시해요. |
| Indeterminate | `progress`가 생략된 상태 | `variant`에 지정된 방식으로 회전 애니메이션을 실행해요. |
| Reduced Motion | 모션 줄이기 설정이 활성화된 상태 | 회전 애니메이션을 중단하고 정적인 형태로 표시해요. |

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 진행 중인 작업을 화면 낭독기에 설명해요. |
| `progress` | `IndicatorProgress` | - | 실제 진행률을 지정해요. 생략하면 Indeterminate 방식으로 표시해요. |
| `variant` | `LoadingIndicatorVariant` | `continuous` | Indeterminate 상태에서 사용할 회전 방식을 지정해요. |
| `className` | `string` | - | 루트 `div`에 추가할 클래스 이름이에요. |

`IndicatorProgress`는 다음 값만 사용할 수 있는 타입이에요.

```
type IndicatorProgress = 0 | 10 | 30 | 50 | 80 | 100;
```

`LoadingIndicatorVariant`는 다음과 같이 정의돼요.

```
type LoadingIndicatorVariant = 'continuous' | 'cycle';
```

그 외에도 `HTMLAttributes<HTMLDivElement>`를 상속하므로 일반적인 HTML 속성을 전달할 수 있어요. `style`도 루트 `div`에 적용돼요. 단, `aria-label`, `children`, `role`은 별도로 제외돼요.

## 04. 인터랙션 규칙 (Interaction)

### Determinate

- `progress`에 전달한 값에 따라 원형 그래픽이 변경돼요.
- 사용할 수 있는 진행률은 `0`, `10`, `30`, `50`, `80`, `100`이에요.
- `0`은 진행률이 없는 상태이고, `100`은 작업이 완료된 상태를 나타내요.
- 진행률을 변경하려면 `progress` 값을 변경해야 해요.
- 진행률을 자동으로 계산하거나 증가시키는 동작은 구현되어 있지 않아요.
- `variant`를 변경해도 Determinate 그래픽은 달라지지 않아요.

### Indeterminate

- `progress`를 생략하면 반복 애니메이션이 실행돼요.
- `continuous`는 1초 동안 일정한 속도로 한 바퀴 회전해요.
- `cycle`은 2초 동안 회전 속도가 가감속하는 모션을 반복해요.
- `variant`를 변경하면 회전 방식이 달라져요.
- 사용자의 모션 줄이기 설정이 활성화되면 애니메이션이 중단돼요.

### 접근성

- 루트 요소에 `role="progressbar"`가 적용돼요.
- `aria-label`은 필수 Props로, 어떤 작업이 진행 중인지 설명해요.
- Determinate에서는 `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`가 적용돼요.
- Indeterminate에서는 `aria-valuenow` 대신 `aria-valuetext="진행 중"`이 적용돼요.
- 내부 그래픽 요소는 `aria-hidden="true"`로 처리돼요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 실제 진행률을 알 수 있다면 `progress`를 전달해 Determinate 방식으로 표시해요.
- 진행률을 알 수 없다면 `progress`를 생략해 Indeterminate 방식으로 표시해요.
- `aria-label`에 어떤 작업이 진행 중인지 구체적으로 작성해요.
- 일정한 속도의 회전이 필요하면 `continuous`를 사용해요.
- 회전 속도가 가감속하는 모션이 필요하면 `cycle`을 사용해요.
- 작업이 완료되면 `progress={100}`으로 표시해요.

### Don't

- 실제 진행률을 알 수 없는데 임의의 수치를 전달하지 않아요.
- `progress`에 `25`, `40`, `75`처럼 지원하지 않는 값을 전달하지 않아요.
- Determinate 상태에서 `variant`를 변경해 진행 그래픽이 달라질 것으로 기대하지 않아요.
- LoadingIndicator가 작업을 직접 실행하거나 진행률을 자동으로 계산한다고 가정하지 않아요.
- LoadingIndicator만으로 작업의 상세 상태나 남은 시간을 전달하려고 하지 않아요.

### 대안

- 작업의 진행 상태를 가로 막대로 표시해야 한다면 `ProgressIndicator`를 사용해요.
- 작업 진행률이 아니라 단순히 콘텐츠를 불러오는 중임을 표시하려면 LoadingIndicator를 사용할 수 있어요.
- 작업이 완료되거나 실패한 결과를 안내하려면 `Alert`나 `SnackBar`를 함께 사용할 수 있어요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| LoadingIndicator + 작업 설명 | 데이터 요청, 콘텐츠 로딩 | LoadingIndicator는 대기 상태를 표시하고 텍스트는 어떤 작업인지 설명해요. |
| LoadingIndicator + 버튼 | 제출, 저장 등 사용자의 행동 이후 처리 | 버튼은 작업을 실행하고 LoadingIndicator는 처리 중임을 표시해요. |
| LoadingIndicator + Alert | 작업 실패 또는 완료 결과 안내 | LoadingIndicator는 처리 중 상태를 표시하고 Alert는 작업 결과를 안내해요. |
| LoadingIndicator + SnackBar | 작업 완료 후 간단한 피드백 | LoadingIndicator로 처리 중임을 보여주고 SnackBar로 완료 결과를 알려요. |

조합할 때는 실제 작업 상태와 표시 방식이 일치해야 해요.

- **Determinate**: 실제 진행률을 알 수 있을 때 사용해요.
- **Indeterminate**: 진행률은 알 수 없지만 작업이 진행 중임을 알려야 할 때 사용해요.
- **작업 완료**: 로딩 표시를 종료하고 완료 결과를 별도로 전달해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/loading/LoadingIndicator/LoadingIndicator.tsx` |
| Props Type | `packages/ui/src/loading/LoadingIndicator/LoadingIndicator.types.ts` |
| Progress Type | `packages/ui/src/loading/loading.types.ts` |
| CSS | `packages/ui/src/loading/LoadingIndicator/LoadingIndicator.css` |
| Determinate Assets | `packages/ui/src/loading/LoadingIndicator/progress-*.svg` |
| Indeterminate Assets | `packages/ui/src/loading/LoadingIndicator/indeterminate-active.svg`, `indeterminate-track.svg` |
| Storybook | `apps/storybook/stories/LoadingIndicator.stories.tsx` |
| Export | `packages/ui/src/loading/index.ts` |