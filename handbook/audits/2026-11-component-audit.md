# 2026년 11월 공개 컴포넌트 감사

2026년 11월 1일 기준 `@eli/ui`의 공개 그룹 19개와 공개 컴포넌트 31개를 점검한 일회성 보고서예요. 반복 적용할 구현 규칙은 이 문서가 아니라 `Agent/`에서 관리해요.

## 감사 범위와 판정 기준

- 공개 경로: `packages/ui/package.json`의 `exports` 19개
- 공개 컴포넌트: 각 그룹 `index.ts`에서 내보내는 React 컴포넌트 31개
- 디자인 기준: Figma `ELI--LDS-` 파일의 Foundation 페이지를 2026년 11월 1일에 확인했어요.
- 구현 기준: 컴포넌트·타입·CSS·Storybook·README·패키징 검사를 함께 확인했어요.
- 자동 검증 기준: PR #49에서 `pnpm check`와 `git diff --check`가 통과했고, 압축 59,247 B, 압축 해제 249,544 B, 267개 파일을 확인했어요.

판정은 다음 의미로 사용해요.

- `구조 일치`: Figma의 형태·variant·상태가 코드와 Storybook에 대응해요. 실제 브라우저 화면 비교는 후속 기준선 확인이 필요해요.
- `수정 필요`: 코드나 공개 설명에서 바로 확인되는 차이가 있어요.
- `확인 필요`: 디자인·제품·접근성 명세를 임의로 정하면 안 되는 항목이에요.

이번 감사는 Figma variant와 코드의 정적 비교예요. 실제 Hover·Pressed 계산 스타일, 키보드·포커스, hydration, VoiceOver와 모바일·데스크탑 스크린샷은 후속 브라우저 검사에서 확인해요. 실행하지 않은 검사를 통과했다고 보지 않아요.

## 공개 컴포넌트 31개

| 그룹 | 공개 컴포넌트 | Figma 기준 | 확인한 상태·형태 | 판정 | 후속 확인 |
| --- | --- | --- | --- | --- | --- |
| `alert` | `Alert` | [`317:209`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=317-209&m=dev) | Error·Success·Caution·Info | 확인 필요 | 상태 안내가 즉시 발생하는지에 따라 `role`·live region 정책을 합의해요. |
| `badge` | `Badge` | [`565:541`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=565-541&m=dev) | Medium·Large, Neutral·Error·Success·Caution | 구조 일치 | 긴 문구와 축소 폭을 브라우저에서 확인해요. |
| `button` | `Button` | [`16:13426`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=16-13426&m=dev) | 2 colors × 2 sizes × 3 types × 4 states | 구조 일치 | 외부 클래스의 상태별 계산 스타일을 자동 검사해요. |
| `button` | `IconButton` | [`317:818`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=317-818&m=dev) | 2 colors × 2 sizes × 2 types × 4 states | 구조 일치 | 필수 동작 설명과 focus-visible을 브라우저에서 확인해요. |
| `checkbox` | `Checkbox` | [`315:125`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=315-125&m=dev) | Off·On | 구조 일치 | Space·disabled·focus-visible과 100개 일괄 변경 기준선을 확인해요. |
| `chip` | `Chip` | [`444:309`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=444-309&m=dev) | Default·Selected, 최대 너비 160px | 구조 일치 | 긴 라벨 말줄임과 `aria-pressed`를 확인해요. |
| `chip` | `FilterChip` | [`444:300`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=444-300&m=dev) | Default·Selected, 최대 너비 180px | 구조 일치 | 다중 선택 라벨·개수 표기의 오버플로를 확인해요. |
| `chip` | `RemovableChip` | [`306:129`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=306-129&m=dev) | 삭제형, 최대 너비 180px | 구조 일치 | 본문과 삭제 버튼의 포커스 순서·설명을 확인해요. |
| `divider` | `Divider` | [`317:493`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=317-493&m=dev) | 반응형 가로 구분선 | 구조 일치 | 별도 공개 변경값이 없어 `한눈에 보기`만 유지해요. |
| `fab` | `Fab` | [`541:1153`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=541-1153&m=dev) | Default·Pressed, 접힘·펼침 | 구조 일치 | 확장 상태 설명과 focus-visible을 확인해요. |
| `fab` | `FabMenu` | [`536:456`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=536-456&m=dev) | 1~4개 Segment 조합 | 확인 필요 | Escape 닫기, 열릴 때 포커스, 닫힌 뒤 포커스 복귀 정책을 합의해요. |
| `fab` | `FabMenuSegment` | [`541:1164`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=541-1164&m=dev) | Default·Pressed | 구조 일치 | 긴 라벨과 아이콘 유무를 브라우저에서 확인해요. |
| `loading` | `LoadingIndicator` | [`568:1167`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=568-1167&m=dev), [`568:1272`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=568-1272&m=dev) | Indeterminate, 0·10·30·50·80·100 | 구조 일치 | 반복 모션과 reduced motion, 진행률 접근성 값을 확인해요. |
| `loading` | `ProgressIndicator` | [`568:1165`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=568-1165&m=dev), [`568:1076`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=568-1076&m=dev) | Indeterminate, 0·10·30·50·80·100 | 구조 일치 | 30% 디자인과 반복 모션을 승인 화면으로 다시 확인해요. |
| `menu` | `MenuItem` | [`134:775`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=134-775&m=dev) | Default·Hover·Pressed, 양쪽 아이콘·단축키 | 구조 일치 | Select의 option 역할로 조합할 때 키보드·포커스를 확인해요. |
| `modal` | `Modal` | [`21:270`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=21-270&m=dev) | 제목·최대 두 문장·두 버튼 | 수정 필요 | 최대 너비가 임시 343px이에요. dialog 역할, 제목·설명 연결, Escape, 포커스 고정·복귀, 열림 API를 확정해야 해요. |
| `navigation` | `NavigationBar` | [`409:261`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=409-261&m=dev) | 3·4·5개 항목 | 구조 일치 | 긴 라벨과 320px 폭을 확인해요. |
| `navigation` | `NavigationBarItem` | [`409:221`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=409-221&m=dev) | Active·Inactive의 Default·Hover·Pressed | 구조 일치 | Active에서 filled 아이콘과 `aria-current`를 확인해요. |
| `navigation` | `NavigationDrawer` | [`521:592`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=521-592&m=dev) | 카테고리·주 메뉴·하위 메뉴 조합 | 구조 일치 | 작은 화면의 오버플로와 Drawer를 여닫는 상위 화면 책임을 확인해요. |
| `navigation` | `NavigationDrawerCategory` | [`521:592`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=521-592&m=dev) | 클릭 없는 Group Header | 구조 일치 | 카테고리와 메뉴의 의미 연결 필요 여부를 접근성 검사에서 확인해요. |
| `navigation` | `NavigationDrawerMenu` | [`521:479`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=521-479&m=dev) | 하위 메뉴 유무에 따른 이동·펼침 | 구조 일치 | Enter·Space, expanded·controls와 포커스 순서를 확인해요. |
| `navigation` | `NavigationDrawerItem` | [`521:479`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=521-479&m=dev) | Main·Sub, Active·Inactive, Default·Hover·Pressed | 구조 일치 | Active 아이콘과 하위 영역의 숨김 동작을 확인해요. |
| `select` | `Select` | [`129:751`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=129-751&m=dev) | 값 유무별 Default·Hover·Focused | 확인 필요 | listbox 안의 button option 구조, Enter·Space·방향키·Home·End·Escape, 포커스 복귀를 브라우저와 VoiceOver로 확인해요. |
| `segment-control` | `SegmentControl` | [`441:1058`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=441-1058&m=dev) | 2~4개 Segment와 모든 선택 위치 | 수정 필요 | 빈 `options`에서 초기 렌더가 실패할 수 있어 2~4개 계약을 타입·런타임·문서 중 어디서 보장할지 정해요. |
| `snackbar` | `SnackBar` | [`98:53`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=98-53&m=dev) | 최대 두 줄 메시지·선택 액션 | 확인 필요 | 자동 노출·사라짐 여부에 따라 `status`·live region·포커스 정책을 합의해요. 기본 문구의 `메세지` 오타를 수정해요. |
| `slider` | `Slider` | [`518:368`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=518-368&m=dev), [`518:399`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=518-399&m=dev) | Standard·Range | 구조 일치 | 키보드 증감, 두 Range handle의 설명·제약, min·max·step 조합을 확인해요. |
| `tab` | `Tab` | [`461:1081`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=461-1081&m=dev) | Active·Inactive의 Default·Hover·Pressed | 확인 필요 | 현재 단독 Tab이 클릭할 때 true·false를 전환해요. tablist에서 하나만 선택하는 패턴과 방향키·패널 연결 책임을 확정해요. |
| `text` | `TextArea` | [`86:623`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=86-623&m=dev) | Default·Hover·Focused·Filled·Disabled | 구조 일치 | 긴 입력, 모바일 폭, disabled와 focus-visible을 확인해요. |
| `text` | `TextField` | [`86:521`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=86-521&m=dev) | Default·Hover·Focused·Filled·Disabled·Error·Success | 확인 필요 | 오른쪽 X 아이콘이 항상 표시되지만 현재 버튼 동작은 없어요. 표시 조건과 지우기 동작 여부를 합의해요. |
| `toggle` | `Toggle` | [`101:360`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=101-360&m=dev) | Off·On과 확정 easing | 구조 일치 | Space·Enter, disabled, accessible description을 확인해요. |
| `tooltip` | `Tooltip` | [`568:1550`](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=568-1550&m=dev) | 최대 200px·여러 줄 | 확인 필요 | 트리거, 위치, Hover·Focus·Escape, `aria-describedby` 연결 책임을 확정해요. |

## Storybook과 공개 설명

- 모든 시각 컴포넌트에는 `한눈에 보기`가 있어요. 공개 변경값이 없는 Divider는 이 화면만 제공해요.
- 나머지 대표 컴포넌트에는 `직접 바꿔보기`와 한글 Controls가 있어요.
- `Fab`, `FabMenuSegment`, `NavigationDrawerCategory`, `NavigationDrawerMenu`, `NavigationDrawerItem`은 조합 컴포넌트이므로 각각 독립 Story가 아니라 `FabMenu`와 `NavigationDrawer` Story에서 사용해요. 공개 API를 직접 검증하기에는 범위가 부족하므로 Storybook·JSDoc 정리 PR에서 보완 여부를 결정해요.
- 모든 공개 컴포넌트 함수와 props 타입에 JSDoc이 있지만, 일부 파일의 `Root`, `Class Name`, `Content` 같은 구조 반복 주석은 한국어 구현 이유를 설명하지 않아요. 기능 영역별 수정 PR에서 관련 코드를 만질 때 정리해요.
- `Modal`, `TextField`, `TextArea`, `Alert`, `SnackBar`의 구조 분해 닫힘 들여쓰기가 일관되지 않아요. 동작 변경과 섞지 않는 기계적 정리 대상으로 분류해요.

## 반응형과 긴 문구

Alert·NavigationBar·NavigationDrawer·SegmentControl·Select·SnackBar·TextField·TextArea는 디자인 기준 너비와 함께 `max-width: 100%`를 사용해 좁은 부모에서 넘치지 않게 구성돼 있어요. Divider와 Slider는 부모 너비를 사용해요.

Chip·FilterChip·RemovableChip·FabMenuSegment·Tooltip은 디자인에서 정한 최대 너비와 말줄임 또는 줄바꿈 규칙을 사용해요. 이 정적 확인만으로 실제 한글 긴 문구, 320px 화면, 브라우저 확대에서 잘리지 않는다고 확정하지 않아요. 승인할 Story의 모바일·데스크탑·긴 문구 화면을 브라우저 기준선으로 기록해요.

## 공개 API와 SSR

- 공개 그룹 19개와 컴포넌트 31개는 실제 tarball의 타입·Vite·일반 SSR·Next.js App Router 소비 검사 대상이에요.
- `Dim`과 내부 아이콘은 `package.json`의 공개 경로에 포함되지 않아요.
- Hook·이벤트·브라우저 API를 사용하는 파일에는 `'use client'` 경계가 있고, `requestAnimationFrame`과 `document` 접근은 이벤트 안에서만 실행돼요.
- `className`, `style`, 표준 이벤트 전달 대상은 JSDoc에 적혀 있지만, 브라우저 계산 스타일과 이벤트 취소 순서는 후속 자동 검사로 확인해요.

## 우선 수정 순서

1. Modal의 접근성 계약과 최대 너비를 디자이너·제품 담당자와 확정해요.
2. Select·Tab·FAB Menu의 키보드·포커스 계약을 브라우저 검사로 확인하고 필요한 API를 정리해요.
3. SegmentControl의 옵션 개수 계약과 SnackBar 기본 문구 오타를 수정해요.
4. Alert·SnackBar·Tooltip·TextField의 미확정 접근성·동작 책임을 합의해요.
5. 기능 영역별 수정이 끝나면 Storybook·JSDoc·한국어 주석을 실제 공개 API와 다시 맞춰요.
6. Playwright·axe 검사, VoiceOver 수동 검사, 성능 기준선과 패키지 매니저 설치 행렬을 순서대로 추가해요.

## 자동 접근성 기준선

2026년 11월 2일에 Playwright 1.64.1의 Chromium과 axe-core 4.14.0으로 실제 tarball 소비 화면을 검사했어요. 색상 대비를 제외한 자동 검사 규칙은 모두 통과해야 해요.

색상 대비는 현재 디자인 토큰을 사용하는 14개 요소에서 개선이 필요해요. Button 1개, Chip 계열 3개, FAB 1개, MenuItem 단축키 1개, NavigationBar 2개, NavigationDrawer 2개, SegmentControl 1개, Slider 3개예요. 디자인 값을 임의로 바꾸지 않고 디자이너와 토큰·상태별 대비를 합의할 때까지 이 수를 임시 기준선으로 고정해요.

자동 검사는 색상 대비 위반이 14개보다 늘거나 줄어도 실패해요. 변경이 의도된 경우 대상과 이유를 확인한 뒤 이 보고서와 검증 코드를 함께 갱신해요. 이 기준선은 접근성 검사를 통과했다는 뜻이 아니며, 배포 전 해결하거나 지원 범위와 남은 위험을 명확히 합의해야 해요.

## 배포 전 확인 항목

- Modal 최대 너비와 dialog 포커스 동작
- Tooltip 트리거·배치·표시 조건
- Alert·SnackBar의 live region 사용 조건
- TextField X 아이콘의 역할과 표시 조건
- Tab의 단독 토글 API와 tablist 조합 규칙
- 디자이너가 승인한 Storybook 기준 화면과 확인 날짜
- 브라우저·접근성 검사, VoiceOver 수동 결과, 성능 기준선
- npm·pnpm·Yarn Classic·Yarn Modern node-modules·Yarn PnP·Bun 설치 행렬의 최신 자동 검사 결과

이 항목이 남아 있는 동안에는 중간 감사가 끝났다는 의미로만 사용하고, npm 공개 배포 준비가 완료됐다고 표현하지 않아요.
