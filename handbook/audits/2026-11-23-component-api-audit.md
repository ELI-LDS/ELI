# 2026-11-23 공개 컴포넌트 API 점검

현재 공개 컴포넌트 34개의 속성명·타입·기본값·이벤트·제어 방식을 확인한 일회성 보고서예요. 앞부분은 수정 전 재현 결과이며, 후속 구현 상태는 문서 끝의 결과에서 구분해요.

## 확인 범위

- 기준 커밋: `03973ada1948fcd00b92019ebe69bac96b4dbf11`
- 공개 범위: `packages/ui/package.json`의 exports 20개와 그룹별 named export 34개
- 확인 대상: 공개 타입, 컴포넌트 구현, 상태 Hook, 관련 CSS·JSDoc·기존 사용 예시
- [PR #98](https://github.com/ELI-team/ELI/pull/98)의 스타일 설명 변경은 별도 작업이에요. 해당 PR은 구현과 타입의 의미를 바꾸지 않아요.
- TypeScript checker로 실제 상속 속성까지 확인했어요. 직접 선언한 props만 검색한 결과가 아니에요.
- 의심 사례는 임시 타입 소비 파일과 프로덕션 Vite 소비 화면의 Chromium·SSR에서 재현했어요. 전체 컴포넌트의 모든 이벤트·브라우저·스크린 리더를 다시 검사한 것은 아니에요.
- 실제 서비스 화면 예시는 만들지 않았어요. 재현용 파일은 Git에 포함하지 않는 `.artifacts/api-audit/`에만 있어요.

이번에는 코드에서 확인한 오류, 사용성 제약과 합의가 필요한 제안을 구분해요. 디자인 값·자동 닫기 정책·탭 선택 방식을 임의로 추가하지 않아요.

## 먼저 고칠 동작과 타입

### A1. Slider의 step과 표시 값이 달라져요

재현: `min={0}`, `max={10}`, `step={3}`, `defaultValue={5}`를 전달하면 브라우저의 range input 값은 `6`, 표시 숫자는 `5`, 트랙은 `50%`예요. Range 형태에서 같은 구간에 기본 step을 쓰면 시작 input 값은 `3`인데 표시 숫자는 `2.7`이에요.

[useSlider.ts](../../packages/ui/src/slider/Slider/useSlider.ts)는 최솟값·최댓값만 보정하고 step을 받지 않아요. [Slider.tsx](../../packages/ui/src/slider/Slider/Slider.tsx)는 step을 실제 input에만 전달해 브라우저가 따로 값을 보정해요.

권장: 초기값·제어값·변경값을 같은 step 기준으로 정규화해 Handle·숫자·트랙·콜백 값을 맞춰요. 숫자 간격·소수 정밀도·구간 끝값 처리와 Range 교차 방지까지 같은 기준으로 확인해요. 현재 제공하는 step의 동작 수정이 우선이며 새 디자인은 필요하지 않아요.

### A2. TextField의 외부 ref가 입력창에 연결되지 않아요

재현: `{ name: 'email', ref }` 형태의 폼 등록용 객체를 spread하면 타입 오류는 없지만 ref는 `null`이에요. 같은 방식의 Checkbox·Radio는 실제 input을 가리켜요. 특정 폼 라이브러리를 설치한 검사는 아니며, 라이브러리가 전달하는 것과 같은 속성 전달 형태를 확인했어요.

[TextField.tsx](../../packages/ui/src/text/TextField/TextField.tsx)는 `...inputProps` 뒤에 내부 지우기용 `ref={inputRef}`를 지정해 외부 ref를 덮어써요. `<TextField ref={...} />`처럼 직접 지정하는 방식은 공개 타입 자체가 거부해요.

공개 컴포넌트 34개 모두 현재 props에 ref를 명시하지 않아요. 일부는 런타임 spread로 우연히 전달되지만 이를 공통 지원 계약으로 보기는 어려워요.

권장: 입력 컴포넌트부터 실제 입력 요소를 가리키는 ref 계약을 명시해요. TextField는 내부 ref와 외부 객체·콜백 ref를 함께 연결하고, 입력 지우기와 포커스 복원도 유지해요. 모든 복합 컴포넌트에 같은 ref 대상을 가정하지 않아요.

### A3. 허용하는 HTML 속성 중 렌더링할 수 없는 값이 있어요

- Checkbox·Radio·Divider는 `children`을 타입에서 허용해요. 실제 자식을 전달하면 input·hr이 자식을 가질 수 없다는 SSR 오류가 나요.
- `dangerouslySetInnerHTML`은 공개 props 34개 모두에 상속돼요. 대표적으로 Button에 전달하면 내부 자식과 동시에 지정할 수 없다는 SSR 오류가 나요. 34개 전부의 HTML 주입을 실행한 결과는 아니에요.

권장: 네이티브 속성을 상속할 때 실제로 지원하지 않는 속성은 제외해요. 자식을 받지 않는 입력·구분선과 내부 슬롯을 렌더링하는 컴포넌트의 직접 HTML 주입을 구분해서 정리해요. 타입을 좁히는 변경도 호환성 변경으로 기록해요.

근거: [Checkbox.types.ts](../../packages/ui/src/checkbox/Checkbox/Checkbox.types.ts), [Radio.types.ts](../../packages/ui/src/radio/Radio/Radio.types.ts), [Divider.types.ts](../../packages/ui/src/divider/Divider/Divider.types.ts), [Button.tsx](../../packages/ui/src/button/Button/Button.tsx)

### A4. 선택한 옵션을 제거하면 선택 표시와 상태가 어긋나요

재현: SegmentControl의 첫 옵션 A가 선택된 상태에서 목록을 B·C로 바꾸면 선택된 radio는 0개인데 첫 위치에 선택 배경이 남아요. NavigationBarGlass도 기존 선택값을 목록에서 제거하면 `aria-current` 항목은 0개인데 indicator는 남아요.

두 구현 모두 선택 인덱스를 찾지 못하면 `0`으로 보정하지만 실제 선택값은 이전 값을 유지해요.

권장: 없는 선택값을 유지하며 선택 표시를 숨길지, 비제어일 때 첫 항목으로 보정할지 정책을 정해요. 어느 방식을 고르든 시각 표시와 실제 선택 상태는 일치해야 해요. 제어 모드에서는 부모의 값을 임의로 바꾸거나 사용자 선택 없이 콜백을 호출하지 않도록 구분해요.

근거: [SegmentControl.tsx](../../packages/ui/src/segment-control/SegmentControl/SegmentControl.tsx), [useSegmentControl.ts](../../packages/ui/src/segment-control/SegmentControl/useSegmentControl.ts), [useNavigationBarGlass.ts](../../packages/ui/src/navigation/NavigationBarGlass/useNavigationBarGlass.ts)

## 추가를 검토할 기능과 사용성 제약

### B1. 실제 진행률을 그대로 전달할 수 없어요

[IndicatorProgress](../../packages/ui/src/loading/loading.types.ts)는 `0 | 10 | 30 | 50 | 80 | 100`만 허용해요. LoadingIndicator·ProgressIndicator 모두 `progress={37}`이나 일반적인 API 응답의 number 값을 타입에서 거부해요.

ProgressIndicator를 JavaScript에서 `37`로 렌더링하면 접근성 값은 37인데 막대 너비는 0이에요. 이는 현재 타입 계약 밖의 입력에 대한 재현이며, 기존 여섯 단계가 잘못 렌더링된다는 뜻은 아니에요. [CSS](../../packages/ui/src/loading/ProgressIndicator/ProgressIndicator.css)에 단계별 너비만 있기 때문이에요.

제안: 공개 progress를 일반 number로 받고 `0~100` 범위·잘못된 숫자 처리를 정해요. 기존 여섯 값의 디자인과 모션은 유지하면서 중간값도 실제로 표현하도록 연결해요. Figma의 예시 단계와 공개 API가 허용할 값의 범위를 구분해 합의해요.

### B2. map으로 만든 정상 목록이 타입에서 거부돼요

NavigationBar·NavigationBarGlass는 3~5개, SegmentControl은 2~4개의 튜플만 받아요. 개수를 맞춰도 일반적인 `.map()` 결과는 배열 타입이어서 그대로 전달할 수 없어요. Select·FabMenu·Drawer의 하위 목록은 일반 readonly 배열을 받아 이런 문제가 없어요.

제안: 일반 배열도 받아 서버 응답·권한 필터·map 결과를 사용할 수 있게 하고, 개수 제약은 런타임 검증과 설명으로 관리할지 결정해요. 검증을 한다면 빈 목록·로딩 중·개수 초과의 처리도 정하고, 소비자가 강제로 타입을 단언하도록 안내하지 않아요.

근거: [NavigationBar.types.ts](../../packages/ui/src/navigation/NavigationBar/NavigationBar.types.ts), [NavigationBarGlass.types.ts](../../packages/ui/src/navigation/NavigationBarGlass/NavigationBarGlass.types.ts), [SegmentControl.types.ts](../../packages/ui/src/segment-control/SegmentControl/SegmentControl.types.ts)

### B3. 조합 컴포넌트에서 하위 버튼을 비활성화할 수 없는 경우가 있어요

- Select에는 전체 disabled나 옵션별 disabled가 없어요.
- SegmentControl에는 전체 disabled나 옵션별 disabled가 없어요.
- NavigationBar·NavigationBarGlass의 항목 데이터와 FabMenuItem에는 disabled가 없어요. 하위 버튼 컴포넌트가 disabled를 지원해도 조합 API에서 전달할 수 없어요.

제안: 필요한 범위부터 disabled 전달 경로를 추가해요. 타입에 필드만 늘리지 않고 클릭·키보드·드래그·포커스 이동에서도 비활성 항목을 처리해야 해요. 새 상태의 색상·디자인이 필요하면 디자이너에게 확인해요.

### B4. 폼·선택 API의 추가 범위를 정해야 해요

- Chip은 `selected`·`onSelectedChange`로 부모가 상태를 갱신하는 방식이에요. 단독 클릭만으로 상태를 저장하지 않는 것은 현재 문서와 일치해요. 간단한 비제어 사용이 필요하다면 `defaultSelected`를 검토해요.
- Toggle의 name은 button에 전달되며 체크값이 FormData에 자동으로 들어가는 계약은 없어요. Select·SegmentControl·Slider도 현재 폼 값 자동 전송 API를 제공하지 않아요. 필요하다면 name·form과 실제 전송 값을 함께 설계해요.
- Slider의 `onValueChange` 외에 드래그·키보드 조절 완료 시 실행하는 `onValueCommit`이 필요한지 검토해요. 단순 이름 추가가 아니라 언제 완료로 판단할지도 정의해야 해요.
- NavigationBar·NavigationBarGlass는 선택 결과를 전달하는 버튼 기반 UI예요. URL 이동은 소비 앱이 연결해요. 새 탭 열기 등 링크 동작까지 제공하려면 항목의 href 지원 범위를 별도로 정해요.

이 항목들은 현재 약속한 기능의 오류가 아니라 소비자 사용성을 위한 추가 후보예요. 실제 요구 없이 모두 한 번에 넣지 않아요.

## 이름과 설명을 정리할 후보

| 현재 이름 | 판단과 제안 |
| --- | --- |
| Badge의 `type` | 피드백 의미를 고르는 속성이어서 `status`를 우선 검토해요. Alert의 status와 역할이 비슷하고, Button의 HTML type과 구분돼요. |
| Modal의 `positiveAction`·`secondaryAction`, SnackBar의 `action` | 현재는 실행 함수가 아니라 버튼 내용이에요. `positiveLabel`·`secondaryLabel`·`actionLabel`로 바꾸면 역할이 더 명확해질 수 있어요. 기존 on... 콜백과 함께 검토하되 필수 변경으로 단정하지 않아요. |
| Slider의 `showMarker`·`showLeftValueIndicator`·`showRightValueIndicator` | 복수 표시는 `showMarkers`, 범위 값은 `showStartValue`·`showEndValue`처럼 의미와 길이를 정리할 수 있어요. 이름만 바꾸기 위한 대규모 변경은 우선하지 않아요. |
| 네이티브 `onChange`와 사용자 정의 `onValueChange` | 역할이 달라 유지하는 편이 좋아요. 네이티브 입력은 React 이벤트, 복합 선택은 선택값을 전달해요. 같은 이름으로 강제 통일하면 이벤트·값 구분이 더 어려워질 수 있어요. |
| `checked`·`selected`·`active` | 체크 입력·선택 칩·현재 탐색 항목이라는 역할 차이가 있어요. 일괄 value 또는 selected로 바꾸지 않아요. |
| Button의 `onClick`, Checkbox·Radio·TextArea의 `onChange` 설명 | 실제 연결은 있지만 타입에서는 네이티브 속성을 상속해 prop hover의 한글 설명이 부족해요. 자주 쓰는 이벤트의 적용 대상과 값 읽는 방법을 설명하는 보완을 검토해요. |

## 전체 34개 확인 결과

`기본 연결`은 타입·구현·Hook에서 주요 값과 이벤트의 경로가 대응한다는 뜻이에요. 모든 동작을 브라우저에서 다시 통과했다는 뜻은 아니에요. `dangerouslySetInnerHTML`·ref의 공통 문제는 A2·A3을 함께 적용해 검토해요.

| 컴포넌트 | 주요 속성·전달 대상 | 확인 결과 |
| --- | --- | --- |
| Alert | title·message·status, 나머지는 바깥 div | 기본 연결. 정적 안내와 즉시 알림의 역할은 사용 상황에 따라 정해야 해요. |
| Badge | children·size·type, 나머지는 span | 기본 연결. type 이름은 검토 후보예요. |
| Button | children·icon·color·variant·size·onClick, 버튼 | 기본 연결. 전용 색상·크기의 인라인 우선순위는 #98에서 설명해요. |
| IconButton | 필수 aria-label·icon·color·variant·size, 버튼 | 기본 연결. 지원 형태가 Button보다 적은 것은 확정 디자인의 차이예요. |
| Checkbox | checked·defaultChecked·onChange·disabled·name·form, input | 기본 연결. children 허용은 실행 오류예요. A3 |
| Radio | value·name·checked·defaultChecked·onChange·disabled, input | 기본 연결. children 허용은 실행 오류예요. A3 |
| Chip | children·selected·onSelectedChange·onClick·disabled, 버튼 | 부모 제어가 현재 계약이에요. preventDefault로 선택 콜백을 취소해요. B4 |
| FilterChip | label·options·selectedValues·onClick, 버튼 | 기본 연결. 필터 목록을 직접 열거나 선택값을 저장하는 컴포넌트는 아니에요. |
| RemovableChip | children·onClick·onRemove·removeLabel·disabled | 본문 클릭과 삭제 버튼이 분리돼요. 삭제가 본문 클릭으로 전파되지 않아요. |
| Divider | className·style 등 hr 속성 | 기본 연결. children 허용은 실행 오류예요. A3 |
| Fab | label·icon·expandedIcon·expanded·showLabel·onClick | 현재는 표현용 버튼이에요. expanded는 제어값이고 내부 상태를 저장하지 않아요. |
| FabMenu | items·expanded·defaultExpanded·onExpandedChange | 제어·비제어 연결. 항목 실행 후 닫기가 현재 계약이고 항목 disabled는 없어요. B3 |
| FabMenuSegment | label·icon·onClick·disabled | 네이티브 버튼 연결. 조합의 items에 disabled 전달 경로는 없어요. B3 |
| LoadingIndicator | progress·variant·필수 aria-label | 여섯 단계만 허용하는 진행률 타입 제약이 있어요. B1 |
| ProgressIndicator | progress·필수 aria-label | 단계별 CSS 너비에 묶여 있어 중간 진행률을 제공하지 못해요. B1 |
| MenuItem | children·leftIcon·rightIcon·shortcut·onClick·disabled | 기본 연결. shortcut은 표시만 하고 실제 단축키를 등록하지 않는 계약이에요. |
| Modal | open·defaultOpen·onOpenChange·title·message·subMessage·액션 | 닫기·콜백 연결. Secondary 취소와 Positive의 소비 앱 책임은 현재 계약대로 유지해요. |
| NavigationBar | items·value·defaultValue·onValueChange | 기본 연결. map 배열 제약과 항목 disabled·링크 지원은 추가 후보예요. B2~B4 |
| NavigationBarItem | label·outlinedIcon·filledIcon·active·onClick·disabled | 네이티브 버튼 연결. 활성 항목에만 filled 아이콘을 사용해요. |
| NavigationBarGlass | items·value·defaultValue·onValueChange | 기본 연결. 선택값 제거 시 indicator가 어긋나고 배열 타입 제약도 있어요. A4, B2 |
| NavigationBarGlassItem | label·outlinedIcon·filledIcon·active·onClick·disabled | 기본 연결. label은 화면에 숨기고 접근성 이름으로 사용해요. |
| NavigationDrawer | children·value·defaultValue·onValueChange | Context를 통한 제어·비제어 선택 연결. |
| NavigationDrawerCategory | label, 나머지는 div | 기본 연결. 클릭 없는 그룹 제목이에요. |
| NavigationDrawerMenu | value·label·subItems·onClick·onSubItemClick | 기본 연결. onClick은 하위가 없는 주 메뉴에서만 실행하는 계약이고, 하위가 있으면 펼침 콜백을 사용해요. |
| NavigationDrawerItem | label·variant·active·expanded·defaultExpanded·onExpandedChange | 기본 연결. onClick의 preventDefault로 펼침을 취소할 수 있어요. |
| SegmentControl | options·value·defaultValue·onValueChange | 값 제거 시 표시가 어긋나요. map 배열·disabled도 추가 검토 대상이에요. A4, B2~B3 |
| Select | label·placeholder·options·value·defaultValue·onValueChange | 기본 연결. options는 일반 배열을 받아요. 전체·옵션별 disabled는 없어요. B3 |
| Slider | variant·value·defaultValue·min·max·step·onValueChange·표시 옵션 | Standard·Range 타입과 콜백을 구분해요. step 불일치가 재현됐어요. A1 |
| SnackBar | children·action·actionColor·onAction | 기본 연결. action=null 숨김 지원. 자동 닫기·노출 상태는 소비 앱 책임이며 액션 이름은 검토 후보예요. |
| Tab | label·active·defaultActive·onActiveChange·onClick | true/false 전환은 이전 요청대로 구현돼 있어요. 그룹·패널·방향키 정책은 기존 합의대로 보류해요. |
| TextField | label·placeholder·state·value·defaultValue·onChange·readOnly | 입력 지우기는 연결돼요. 외부 ref가 끊기는 문제는 A2예요. disabled는 state로만 지정하는 기존 계약을 유지해요. |
| TextArea | label·placeholder·disabled·value·defaultValue·onChange | 네이티브 입력 전달은 연결돼요. 공개 ref 타입 보완은 A2 범위에서 검토해요. |
| Toggle | checked·defaultChecked·onCheckedChange·onClick·disabled | 제어·비제어와 이벤트 취소 연결. FormData 자동 전송은 없어요. B4 |
| Tooltip | children·id·표준 div 속성 | 표현부만 제공해요. 트리거·배치·열림·Escape 정책은 추가 논의 전까지 보류해요. |

## 권장 수정 순서

1. Slider의 step과 표시·실제 입력값을 맞춰요.
2. TextField의 외부 ref 연결을 고치고 입력 요소의 ref 계약을 정해요.
3. 렌더링할 수 없는 children·직접 HTML 주입을 타입에서 정리해요.
4. 옵션 제거 후 선택값·indicator 정책을 합의하고 일치시켜요.
5. 진행률 number, 일반 배열 입력과 disabled 전달을 필요한 범위부터 추가해요.
6. Badge 등 이름 변경은 이전·이후 사용 예시를 검토한 뒤 별도 변경으로 진행해요.

현재 동작 오류 수정만 따로 배포한다면 PATCH를 검토해요. 새 공개 기능·이름 변경·허용 타입 축소가 포함되면 현재 0.x 정책의 MINOR 대상이에요. 실제 버전은 다음 묶음 업데이트의 전체 변경으로 결정하고, 기존 고정 파일·태그를 덮어쓰지 않아요.

## 이번에 실행한 확인

- 공개 export와 실제 상속 타입·컴포넌트·Hook의 정적 대조: 34개
- 임시 TypeScript 소비 사례: 입력·구분선 children은 오류 없이 통과하고, 직접 ref·37 진행률·map 배열·Select disabled는 의도적으로 진단을 수집했어요. 위에서 기술한 타입 오류는 7개예요.
- 대표 SSR 재현: Checkbox·Radio·Divider의 잘못 허용된 children, Button의 직접 HTML 주입
- Chromium 프로덕션 소비 재현: Slider step, TextField 등록 형태의 ref, 옵션 제거 후 SegmentControl·NavigationBarGlass 상태, JavaScript의 임의 ProgressIndicator 진행률
- 실행 도구: Node.js 24.21.0, 저장소의 TypeScript 5.9.3·React 19.3.0·Vite 8.3.3·Playwright 1.64.1

재현 결과는 로컬 `/tmp/eli-api-type-results.json`, `/tmp/eli-api-runtime-results.json`, `/tmp/eli-api-innerhtml-result.json`에 있어요. 이 임시 파일은 다른 개발자에게 제공되는 배포 데이터가 아니므로 핵심 결과와 입력값은 이 보고서에도 남겼어요.

초기 감사 단계에서는 실제 컴포넌트의 props·이름·동작·디자인을 수정하지 않았어요. 아래는 감사 후 사용자 요청으로 진행한 구현 결과예요.

## 후속 구현 결과

- A1: 초기값·제어값·변경값에 같은 min·max·step 정규화를 적용했어요. 소수 간격·유효한 마지막 눈금·같은 경계·범위 교차를 검사해요.
- A2: 네 입력 컴포넌트에 실제 input·textarea를 가리키는 ref를 공개했어요. TextField는 내부 참조와 외부 객체·콜백 참조를 함께 연결하며 React 19의 정리 함수를 보존해요.
- A3: 공개 컴포넌트 전체의 직접 HTML 주입과 input·hr의 자식 허용을 타입에서 제외했어요. 생성한 실제 소비 타입 검사에 허용·거부 사례를 포함해요. 허용 타입 축소는 호환성 변경으로 기록했어요.
- A4: 세 선택형 컴포넌트의 상태를 공통 내부 Hook으로 맞췄어요. 비제어에서 항목이 사라지면 첫 사용 가능 항목을 선택하고, 제어 값이 목록에 없으면 indicator·선택 표시를 숨겨요. 목록 변경만으로 사용자 콜백을 실행하지 않아요.
- B1: 원형·막대 진행률에 일반 number를 받아 0~100으로 제한해요. NaN·Infinity·생략은 진행률을 모르는 상태예요. 기존 모션과 디자인은 유지해요.
- B2: 일반 readonly 배열을 받아 map·필터 결과를 사용할 수 있어요. 권장 개수는 기존 디자인 범위로 설명하며 배열을 임의로 자르지 않아요. 빈 배열은 선택 없이 표시해요.
- B3: Select·SegmentControl 전체 및 옵션별 disabled와 두 하단 탐색·FabMenu 항목별 disabled를 실제 버튼까지 연결했어요. 키보드 이동은 비활성 항목을 건너뛰고 Glass의 드래그 종료도 비활성 항목을 선택하지 않아요. 새 비활성 색상은 만들지 않았어요.
- Button의 onClick과 입력 컴포넌트의 onChange·ref에 한국어 prop 설명을 보완했어요. README·Storybook·지침·Unreleased를 함께 갱신해요.

Badge·액션 라벨·Slider 표시 옵션의 이름 변경, B4의 폼 전송·비제어 Chip·onValueCommit·링크 탐색은 이번에 넣지 않았어요. Tooltip·Tab은 기존 합의대로 추가 논의까지 유지해요. 컴포넌트 API 보완 범위에서는 하네스·CLI 런타임·실제 버전·고정 배포 파일을 변경하지 않았어요. 이후 저장소 이전에 따른 CLI 주소 변경은 별도 작업 범위예요. 이 변경은 다음 UI 콘텐츠 MINOR 대상으로 모아요.

### 구현 검증

- `pnpm check` 통과: 타입·린트·Storybook 빌드·실제 tarball 타입/SSR/브라우저/axe·Next.js·용량 측정. 이후 소수 중간값 보정과 타입 단언 정리는 타입·린트·tarball 소비·브라우저·소스 소비 검사를 다시 통과했어요.
- `pnpm test:registry` 통과: 공개 컴포넌트 34개의 생성 파일·의존성·해시·타입·Vite·CSS와 선택 설치 소스의 Next.js SSR·hydration·회귀 동작을 확인했어요. 공유 항목은 18개이며 기존 공개 릴리스 JSON을 덮어쓰지 않았어요.
- 공개 props 34개 전체의 직접 HTML 주입 거부, 입력·구분선의 children 거부, 네 입력 요소의 ref와 일반 배열·숫자 진행률 허용을 실제 소비 TypeScript에서 확인했어요.
- Chromium·WebKit·Android Chromium 에뮬레이션·iOS WebKit 에뮬레이션 통과: Slider 간격·소수 중간값·Range 교차, 참조 교체/정리, 동적 목록, 키보드·포인터·드래그의 비활성 항목 처리, 임의 진행률의 실제 너비·ARIA를 확인했어요. 실제 Android·iOS·macOS Safari·VoiceOver 확인은 이번에 수행하지 않았어요.
- Firefox는 테스트 시작 전 브라우저의 `Could not find profile folder` 오류로 실행되지 않았어요. 실행 한 번의 임시 경로를 별도로 지정해도 같은 오류가 재현됐으며, 이 개인 환경 문제를 위한 코드는 저장소에 추가하지 않았어요. Firefox 통과로 기록하지 않아요.
- 빌드된 Storybook에서 LoadingIndicator·ProgressIndicator 숫자 Controls, Select 옵션 편집, SegmentControl 전체 비활성화, 두 하단 탐색의 메뉴 선택 비활성화, FabMenu 항목 비활성화가 실제 UI에 반영되는지 확인했어요.
- `git diff --check`와 변경 문서의 로컬 링크 검사 통과. 실제 서비스 예시 화면·추가 실행 의존성·새 색상은 추가하지 않았어요.
- 최종 UI tarball 자체: 압축 123,928 B, 압축 해제 473,743 B, 321개 파일. 설치 도구·선택 JSON·React를 합친 전체 다운로드량이 아니에요. 기존 종료 예정 패키지 이름은 내부 빌드 검사에만 사용했어요.

Firefox와 실제 기기·화면 낭독기·소비자 패키지 매니저 전체 행렬은 이번에 완료했다고 표시하지 않아요. 핵심 변경은 다음 UI 소스 콘텐츠 MINOR 릴리스에서 묶고 실제 버전 증가는 별도로 진행해요.
