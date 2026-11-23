# 프로그레스 바 (프로그레스 인디케이터)

상태: 진행 중

## 01. 컴포넌트 용도 (Purpose)

ProgressIndicator는 작업의 진행 상태를 가로 막대로 표시하는 컴포넌트예요.

작업의 완료 비율을 알 수 있는지에 따라 두 가지 방식으로 표시해요.

- **Determinate**: 작업의 진행률을 알고 있을 때 사용해요. 현재 완료 비율을 막대의 길이로 표현해요.
- **Indeterminate**: 작업의 진행률을 알 수 없을 때 사용해요. 반복 애니메이션으로 작업이 진행 중임을 표현해요.

파일 업로드, 데이터 처리, 콘텐츠 로딩처럼 작업이 완료되기까지 시간이 필요한 상황에 사용할 수 있어요.

## 02. 컴포넌트 구조 (Structure)

ProgressIndicator는 전체 진행 범위를 나타내는 Track과 실제 진행 상태를 나타내는 Active Indicator로 구성돼요.

- **Root (`div`)**: 전체 ProgressIndicator를 감싸요. `role="progressbar"`가 적용돼요.
- **Track**: 전체 진행 범위를 나타내는 배경 영역이에요.
- **Active Indicator (`span`)**: 현재 진행 상태를 나타내는 막대예요. `aria-hidden="true"`가 적용돼요.

두 방식은 동일한 구조를 사용하지만 Active Indicator의 표시 방식이 달라요.

### Determinate

- Active Indicator의 너비가 `progress` 값에 따라 달라져요.
- 완료된 비율만큼 막대가 채워져요.
- 진행률이 `0`이면 막대가 채워지지 않고, `100`이면 전체가 채워져요.

### Indeterminate

- Active Indicator의 너비와 위치가 반복적으로 변해요.
- 진행률을 특정 비율로 표현하지 않고 작업이 진행 중이라는 상태를 보여줘요.
- 사용자의 모션 줄이기 설정이 활성화되면 애니메이션이 중단되고 고정된 막대로 표시돼요.

## 03. 프로퍼티 (Properties)

### 표시 방식

별도의 `variant` Props는 없어요. `progress` 전달 여부에 따라 표시 방식이 결정돼요.

| 표시 방식 | 조건 | 설명 |
| --- | --- | --- |
| Determinate | `progress` 전달 | 전달한 진행률에 해당하는 길이로 막대를 표시해요. |
| Indeterminate | `progress` 생략 | 반복 애니메이션으로 작업이 진행 중임을 표시해요. |

### State

| 상태 | 조건 | 표시 및 동작 |
| --- | --- | --- |
| Determinate | `progress`가 전달된 상태 | 진행률에 따라 Active Indicator의 너비가 달라져요. |
| Indeterminate | `progress`가 생략된 상태 | Active Indicator의 너비와 위치가 반복적으로 변해요. |
| Reduced Motion | Indeterminate 상태에서 모션 줄이기 설정이 활성화된 경우 | 애니메이션을 중단하고 고정된 막대로 표시해요. |

### Props

| Prop | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `aria-label` | `string` | 필수 | 진행 중인 작업을 화면 낭독기에 설명해요. |
| `progress` | `IndicatorProgress` | - | 실제 진행률을 지정해요. 생략하면 Indeterminate 방식으로 표시해요. |
| `className` | `string` | - | 루트 `div`에 추가할 클래스 이름이에요. |

`IndicatorProgress`는 다음 값만 사용할 수 있는 타입이에요.

```
type IndicatorProgress = 0 | 10 | 30 | 50 | 80 | 100;
```

그 외에도 `HTMLAttributes<HTMLDivElement>`를 상속하므로 일반적인 HTML 속성을 전달할 수 있어요. `style`도 루트 `div`에 적용돼요. 단, `aria-label`, `children`, `role`은 별도로 제외돼요.

## 04. 인터랙션 규칙 (Interaction)

### Determinate

- `progress`에 전달한 값에 따라 Active Indicator의 너비가 결정돼요.
- 사용할 수 있는 진행률은 `0`, `10`, `30`, `50`, `80`, `100`이에요.
- `0`은 진행 막대가 채워지지 않은 상태이고, `100`은 전체가 채워진 상태예요.
- 진행률을 변경하려면 `progress` 값을 변경해야 해요.
- 진행률에 따라 자동으로 값이 증가하거나 완료되는 동작은 구현되어 있지 않아요.

### Indeterminate

- `progress`를 생략하면 반복 애니메이션이 실행돼요.
- 애니메이션은 Active Indicator의 너비와 위치를 변경하는 방식으로 동작해요.
- 애니메이션은 2초 주기로 반복돼요.
- 사용자의 모션 줄이기 설정이 활성화되면 애니메이션이 중단되고 Active Indicator가 고정된 형태로 표시돼요.

### 접근성

- 루트 요소에 `role="progressbar"`가 적용돼요.
- `aria-label`은 필수 Props로, 진행 중인 작업을 설명해요.
- Determinate에서는 `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`가 적용돼요.
- Indeterminate에서는 `aria-valuenow` 대신 `aria-valuetext="진행 중"`이 적용돼요.

## 05. 사용 가이드 (Usage Guidelines)

### Do

- 실제 진행률을 알 수 있다면 `progress`를 전달해 Determinate 방식으로 표시해요.
- 진행률을 알 수 없거나 계산할 수 없다면 `progress`를 생략해 Indeterminate 방식으로 표시해요.
- `aria-label`에 어떤 작업이 진행 중인지 구체적으로 작성해요.
- 작업이 완료되면 `progress={100}`을 전달해 완료 상태를 표시해요.
- 진행률을 업데이트할 때 사용할 수 있는 값인 `0`, `10`, `30`, `50`, `80`, `100` 중 하나를 사용해요.

### Don't

- 실제 진행률을 알 수 없는데 임의의 수치를 전달하지 않아요.
- `progress`에 `25`, `45`, `75`처럼 지원하지 않는 값을 전달하지 않아요.
- 작업이 진행 중이라는 이유만으로 항상 Indeterminate를 사용하지 않아요. 실제 진행률을 알 수 있다면 Determinate를 사용해요.
- ProgressIndicator가 작업을 직접 실행하거나 진행률을 자동으로 계산한다고 가정하지 않아요.
- ProgressIndicator만으로 작업의 상세 상태나 남은 시간을 전달하려고 하지 않아요.

### 대안

- 작업 진행률이 아니라 단순히 콘텐츠를 불러오는 중임을 표시하려면 `LoadingIndicator`를 사용할 수 있어요.
- 작업 완료 여부를 사용자에게 알리려면 `Alert`나 `SnackBar`를 함께 사용할 수 있어요.

## 06. 추천 조합 (Composition)

| 조합 | 사용 맥락 | 역할 |
| --- | --- | --- |
| ProgressIndicator + 작업 설명 | 파일 업로드, 데이터 처리 | ProgressIndicator는 진행 상태를 표시하고 텍스트는 어떤 작업인지 설명해요. |
| ProgressIndicator + 진행률 텍스트 | 완료 비율을 숫자로도 전달해야 하는 경우 | 막대는 진행 상태를 시각화하고 텍스트는 현재 진행률을 전달해요. |
| ProgressIndicator + Alert | 작업 실패 또는 완료 결과를 안내하는 경우 | ProgressIndicator는 작업 중 상태를 표시하고 Alert는 작업 결과를 안내해요. |
| ProgressIndicator + SnackBar | 작업 완료 후 간단한 피드백이 필요한 경우 | ProgressIndicator로 작업 진행 상태를 보여주고 SnackBar로 완료 결과를 알려요. |

조합할 때는 ProgressIndicator의 표시 방식과 실제 작업 상태가 일치해야 해요.

- **Determinate + 진행률 텍스트**: 실제 진행률을 숫자와 막대로 함께 전달할 때 사용해요.
- **Indeterminate + 작업 설명**: 진행률을 알 수 없지만 어떤 작업이 진행 중인지는 알려줄 수 있을 때 사용해요.
- **ProgressIndicator + 완료 안내**: 작업이 끝나면 진행률을 100%로 표시하고, 필요한 경우 완료 메시지를 제공해요.

## 07. 구현 파일 (Implementation Files)

| 구분 | 파일 경로 |
| --- | --- |
| Component | `packages/ui/src/loading/ProgressIndicator/ProgressIndicator.tsx` |
| Props Type | `packages/ui/src/loading/ProgressIndicator/ProgressIndicator.types.ts` |
| Progress Type | `packages/ui/src/loading/loading.types.ts` |
| CSS | `packages/ui/src/loading/ProgressIndicator/ProgressIndicator.css` |
| Storybook | `apps/storybook/stories/ProgressIndicator.stories.tsx` |
| Export | `packages/ui/src/loading/index.ts` |