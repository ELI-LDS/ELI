# 컴포넌트 JSON 검토 기록

2026-11-24에 디자이너 원문 21개를 기준으로 공개 컴포넌트 31개의 사용 규칙과 개발자 사용 예시를 대조했어요. 원문은 바이트 그대로 보존했고, 보완한 코드 예시는 디자이너가 작성한 내용으로 표시하지 않아요.

이후 Modal·Divider·Tab 원문을 ZIP으로 추가 전달받아 공개 컴포넌트 34개 모두의 가이드 JSON을 준비했어요. 새 3개도 2026-11-24에 사용자의 진행 요청에 따라 승인해 전체 34개가 stable이에요.

## 검토할 자료

| 컴포넌트 JSON | 개발자가 보완한 예시 | 승인 상태 |
| --- | --- | --- |
| [Modal](../apps/docs/content/components/modal.json) | 외부에서 열고 성공한 행동 뒤 닫기 | 2026-11-24 사용자 승인 |
| [Divider](../apps/docs/content/components/divider.json) | 설정 그룹 사이의 의미적 구분 | 2026-11-24 사용자 승인 |
| [Tab](../apps/docs/content/components/tab.json) | 소비 앱에서 단일 선택·패널·그룹 키보드 조작 연결 | 2026-11-24 사용자 승인 |
| [Alert](../apps/docs/content/components/alert.json) | 지속적으로 유지할 상태 안내 | 2026-11-24 사용자 승인 |
| [Badge](../apps/docs/content/components/badge.json) | 짧은 상태 표시 | 2026-11-24 사용자 승인 |
| [Button](../apps/docs/content/components/button.json) | 주요 행동 실행 | 2026-11-24 사용자 승인 |
| [Checkbox](../apps/docs/content/components/checkbox.json) | 라벨과 선택 상태 연결 | 2026-11-24 사용자 승인 |
| [Chip](../apps/docs/content/components/chip.json) | 선택 상태를 부모에서 반영 | 2026-11-24 사용자 승인 |
| [FabMenuSegment](../apps/docs/content/components/fab-menu-segment.json) | 개별 액션의 실행 함수 연결 | 2026-11-24 사용자 승인 |
| [FabMenu](../apps/docs/content/components/fab-menu.json) | 관련 액션 목록과 실행 함수 연결 | 2026-11-24 사용자 승인 |
| [Fab](../apps/docs/content/components/fab.json) | 단일 주요 행동 실행 | 2026-11-24 사용자 승인 |
| [FilterChip](../apps/docs/content/components/chip.json) | 필터 설정과 적용은 소비 앱에서 제공 | 2026-11-24 사용자 승인 |
| [IconButton](../apps/docs/content/components/icon-button.json) | 아이콘으로 항목 추가 | 2026-11-24 사용자 승인 |
| [LoadingIndicator](../apps/docs/content/components/spinner.json) | 진행률을 모르는 작업의 대기 표시 | 2026-11-24 사용자 승인 |
| [MenuItem](../apps/docs/content/components/menu-item.json) | 항목 클릭을 기능에 연결 | 2026-11-24 사용자 승인 |
| [NavigationBarGlassItem](../apps/docs/content/components/navigation-bar-glass-item.json) | 단독 항목의 활성 상태 연결 | 2026-11-24 사용자 승인 |
| [NavigationBarGlass](../apps/docs/content/components/navigation-bar-glass.json) | 현재 목적지를 부모 상태에 연결 | 2026-11-24 사용자 승인 |
| [NavigationBarItem](../apps/docs/content/components/navigation-bar-item.json) | 단독 항목의 활성 상태 연결 | 2026-11-24 사용자 승인 |
| [NavigationBar](../apps/docs/content/components/navigation-bar.json) | 현재 목적지를 부모 상태에 연결 | 2026-11-24 사용자 승인 |
| [NavigationDrawerCategory](../apps/docs/content/components/navigation-drawer-category.json) | 탐색 메뉴 묶음에 이름 제공 | 2026-11-24 사용자 승인 |
| [NavigationDrawerItem](../apps/docs/content/components/navigation-drawer-item.json) | 직접 조립하는 주·하위 메뉴 | 2026-11-24 사용자 승인 |
| [NavigationDrawerMenu](../apps/docs/content/components/navigation-drawer-menu.json) | 하위 목록의 펼침과 선택 연결 | 2026-11-24 사용자 승인 |
| [NavigationDrawer](../apps/docs/content/components/drawer.json) | 카테고리·주 메뉴·하위 메뉴 조립 | 2026-11-24 사용자 승인 |
| [ProgressIndicator](../apps/docs/content/components/indicator.json) | 앱에서 받은 실제 진행률 표시 | 2026-11-24 사용자 승인 |
| [Radio](../apps/docs/content/components/radio.json) | 같은 묶음에서 하나 선택 | 2026-11-24 사용자 승인 |
| [RemovableChip](../apps/docs/content/components/chip.json) | 부모 목록에서 항목 제거 | 2026-11-24 사용자 승인 |
| [SegmentControl](../apps/docs/content/components/segment-control.json) | 보기 방식 선택 | 2026-11-24 사용자 승인 |
| [Select](../apps/docs/content/components/select.json) | 옵션 목록에서 하나 선택 | 2026-11-24 사용자 승인 |
| [Slider](../apps/docs/content/components/slider.json) | 단일 수치 조절 | 2026-11-24 사용자 승인 |
| [SnackBar](../apps/docs/content/components/snackbar.json) | 표시·자동 닫힘·다시 표시하기 | 2026-11-24 사용자 승인 |
| [TextArea](../apps/docs/content/components/textarea.json) | 여러 줄의 내용 입력 | 2026-11-24 사용자 승인 |
| [TextField](../apps/docs/content/components/text-field.json) | 입력과 지우기를 같은 상태에 연결 | 2026-11-24 사용자 승인 |
| [Toggle](../apps/docs/content/components/toggle.json) | 즉시 적용하는 설정 전환 | 2026-11-24 사용자 승인 |
| [Tooltip](../apps/docs/content/components/tooltip.json) | 설명과 대상 연결: 표시 제어는 소비 앱에서 제공 | 2026-11-24 사용자 승인 |

2026-11-24에 사용자가 31개 문서를 모두 승인해 `stable`로 전환했어요. 승인 전에 스키마의 `stable` 조건(요약·권장 상황·출처·예시가 있고 미해결 질문·구현 차이가 없음)을 31개 모두 충족하는 것을 확인했어요. 새로운 명세 차이를 발견하면 해당 문서를 `draft`로 되돌리고 다시 검토해요.

## 처리한 원문과 구현의 차이

원문에 남아 있는 이전 기술 설명은 다음과 같이 처리했어요. 미해결 항목으로 계속 노출하지 않도록 JSON의 review에서 이 기록으로 옮겼어요. 원문 해시는 그대로예요.

- **LoadingIndicator**: 원문은 진행률을 0·10·30·50·80·100으로 제한하지만 최신 구현은 중간값을 포함한 실제 숫자를 지원해요. 이전 제한 설명은 JSON에 적용하지 않았어요.
- **NavigationBarGlass**: 원문은 3~5개를 고정 튜플로 설명해요. 사용자 합의에 따라 강제 제한이 없는 권장 범위로 안내했어요.
- **NavigationBar**: 원문은 3~5개를 고정 튜플로 설명해요. 사용자 합의에 따라 강제 제한이 없는 권장 범위로 안내했어요.
- **ProgressIndicator**: 원문은 진행률을 0·10·30·50·80·100으로 제한하지만 최신 구현은 중간값을 포함한 실제 숫자를 지원해요. 이전 제한 설명은 JSON에 적용하지 않았어요.
- **SegmentControl**: 원문의 2~4개 고정 튜플 설명은 최신 배열 타입과 달라요. 사용자 합의에 따라 권장 범위로 안내했어요.
- **SegmentControl**: 원문은 전체·옵션별 disabled를 미지원으로 설명하지만 최신 코드는 둘 다 지원해요.
- **Select**: 원문의 disabled 미지원 설명과 달리 최신 코드는 전체·옵션별 disabled를 지원해요.
- **SnackBar**: 원문은 타이머와 닫기 이벤트가 없다고 설명해요. 사용자 합의에 따라 duration·open·defaultOpen·onOpenChange와 일시 정지를 구현한 현재 동작을 반영했어요.
- **TextField**: 원문에서 X를 장식 아이콘으로 설명하지만 최신 구현은 실제 입력 지우기예요.
- **TextField**: 원문의 바깥 label 구조 설명은 현재 바깥 div와 연결된 label 구조와 달라요.

Button의 Ghost 기본 배경과 Navigation의 disabled 제거·권장 항목 수·SnackBar 자동 닫힘은 대화에서 사용자가 확정한 변경이에요. 그 외에 입력 지우기·disabled 지원·진행률 범위 등은 현재 구현과 이미 병합된 공개 API를 대조해 기술 설명을 바로잡았어요. API 전체를 JSON에 복제하지 않았어요.

## 예시의 설치 위치와 검증 범위

예시 파일을 components 폴더와 같은 위치에 둔 경우를 보여줘요. 기본 설치가 src/components/ui이면 src/Example.tsx, components/ui이면 프로젝트 루트 Example.tsx에서 ./components/ui/{항목}을 가져와요. 다른 위치의 파일이나 사용자 지정 설치 경로에서는 .eli/config.json과 실제 파일을 확인해 상대 import를 맞춰야 해요. ELI 전용 별칭·전체 UI 패키지 import·별도 CSS import를 요구하지 않아요.

[UI PR #103](https://github.com/ELI-team/ELI/pull/103)의 기준 커밋 1acaffa749c11a2316b28ce44499bf263d70b51c에서 만든 레지스트리 JSON으로 소스를 복원한 소비 폴더에 예시 31개를 저장하고, 저장소의 strict·exactOptionalPropertyTypes 설정으로 타입 검사와 Vite 빌드를 확인했어요. 스키마·출처 해시·공개 심벌·선택 조합도 다시 확인했어요. 예시를 전부 브라우저에서 조작했거나 실제 기기에서 검수했다는 뜻은 아니에요. UI 핵심 동작은 별도의 실제 tarball·선택 소스 소비 검사 기록을 참고해요.

표시용 Tooltip 예시는 트리거 연결 관계만 보여주며 자동 Hover·Focus 열림을 구현했다고 안내하지 않아요. Navigation 예시의 원·채움 원은 소비 앱이 제공하는 outlined·filled 아이콘 자리의 예시예요. 실제 라우팅·저장 요청은 소비 앱에서 연결해요.

## 추가 원문 세 개를 대조했어요

2026-11-24에 modla.zip·divider.zip·tab.zip에서 각각 Markdown 한 개를 가져왔어요. 모달·디바이더 원문을 추가하고 제목·상태만 있던 Tab 원문을 본문이 있는 최신 전달본으로 교체했어요. 이전 Tab 파일은 Git 이력에 남아 있어요. ZIP 안의 Markdown 바이트와 source.sha256을 유지하며 ZIP 자체는 저장소에 넣지 않아요.

| 원문과 차이가 있던 부분 | JSON에서 정리한 내용 |
| --- | --- |
| Modal의 상태·닫힘 미지원 설명 | 기존 사용자 합의로 이미 구현된 open·defaultOpen·onOpenChange, Dim·Secondary·Esc 닫힘을 기준으로 정리했어요. Secondary의 preventDefault와 Positive 완료 후 소비 앱의 닫힘 책임을 구분했어요. |
| Modal의 포커스·dialog 미지원 설명 | 실제 role=dialog·aria-modal·제목/본문 연결·포커스 순환/복귀·배경 잠금을 반영했어요. UI를 이전 동작으로 되돌리지 않았어요. |
| Modal의 HTML 속성 적용 대상 | 일반 속성·className·style은 Root, width·height는 콘텐츠, aria-label·aria-labelledby·aria-describedby는 dialog에 연결된다는 현재 동작을 적었어요. |
| 원문의 네이티브 속성 상속 설명 | 현재 타입에서 children·dangerouslySetInnerHTML 등 렌더링할 수 없는 속성을 제외하는 점을 보완했어요. |
| Divider의 @eli-team/ui 예시 | 기본 소스 설치의 로컬 import로 고쳤어요. 원문 코드는 수정하지 않았어요. |
| Tab의 개별 토글과 그룹 동작 | 개별 탭의 재클릭 해제를 유지해요. 예시의 단일 선택·패널 연결·방향키·Home/End·tabIndex 처리는 소비 앱 코드이며 Tab의 내장 기능이 아니에요. |

위 차이는 코드와 이미 합의한 API·소스 설치 기준에 따라 정리했어요. 새 디자인 값이나 컴포넌트 API는 추가하지 않았어요. 새 문서 3개는 처음에는 draft로 작성했고, 이후 2026-11-24에 사용자가 다음 진행을 요청해 stable 전환을 승인했어요. 기존 문서의 승인을 자동 확장한 것은 아니에요.

새 예시는 UI 콘텐츠 0.3.0의 실제 레지스트리 소스에서 Modal·Button·Divider·Tab을 복원해 타입·Vite 빌드를 통과했어요. Chromium에서 열기·닫기·표시·Tab 그룹 키보드 조작을 확인했어요. 검증 결과와 실행 범위는 [변환 기록](component-guide-json.md#추가-전달-문서-세-개를-정리했어요)에 남겨요.

## Button 원문의 제목 표기를 갱신했어요

2026-11-24에 button.zip으로 다시 전달받은 Markdown을 원문 그대로 교체하고 Button JSON의 source.sha256을 갱신했어요. 제목 추가, 섹션 번호와 한영 제목 표기만 달라졌으며 본문의 사용 기준·Props·상호작용·조합 설명은 기존 원문과 같아요. 실제 Button 코드와 이전에 보완한 기술 설명도 대조했어요.

JSON의 사용 기준·예시·검토 내용은 바꾸지 않았고 기존 사용자 승인 상태인 stable을 유지해요. UI 구현·디자인·공개 API·버전은 변경하지 않았어요. 기존 원문은 Git 이력에 남아 있어요.


2026-11-28 사용자 요청으로 Chip 역할을 variant로 합쳤어요. 위 표의 FilterChip·RemovableChip은 당시 승인 기록이며 현재 Chip 가이드를 가리켜요. 별도 원문은 보존하고 [API 대응표](../apps/docs/content/source/components/chip-variants.md)를 추가했어요. 설치 이름 변경도 현재 JSON 링크에 반영했으며 과거 승인 날짜는 유지해요.

2026-11-28 사용자 요청으로 Modal의 Positive도 콜백 실행 후 기본으로 닫도록 변경했어요. [확정 사항](../apps/docs/content/source/components/modal-positive-close.md)을 별도로 보존하고 JSON의 동작·접근성·예시를 갱신했어요. 두 액션 모두 preventDefault로 닫힘을 취소하며 비동기 성공 후 닫는 시점은 소비 앱이 제어해요. 기존 원문·디자인·최대 너비는 유지해요.

이 변경은 pnpm check(타입·린트·Storybook·실제 tarball 브라우저·Next.js·용량), 선택 설치 레지스트리 8개 검사·34개 공개 소스 타입/Vite·Next.js SSR/hydration, 문서 조회 8개 검사를 통과했어요. Positive 콜백 후 닫기·취소·비제어 닫기·포커스 복귀를 같은 소비 시나리오에서 확인했어요. 내부 UI tarball은 압축 142,873 B·압축 해제 534,277 B·327개 파일이며 전체 소스 설치 다운로드량이 아니에요. 원격 게시·실기기·실제 릴리스 버전 증가는 진행하지 않았어요.
