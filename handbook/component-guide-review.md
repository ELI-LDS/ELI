# 컴포넌트 JSON 검토 기록

2026-11-24에 디자이너 원문 21개를 기준으로 공개 컴포넌트 31개의 사용 규칙과 개발자 사용 예시를 대조했어요. 원문은 바이트 그대로 보존했고, 보완한 코드 예시는 디자이너가 작성한 내용으로 표시하지 않아요.

## 검토할 자료

| 컴포넌트 JSON | 개발자가 보완한 예시 | 승인 상태 |
| --- | --- | --- |
| [Alert](../apps/docs/content/components/alert.json) | 지속적으로 유지할 상태 안내 | 사용자 검토 대기 |
| [Badge](../apps/docs/content/components/badge.json) | 짧은 상태 표시 | 사용자 검토 대기 |
| [Button](../apps/docs/content/components/button.json) | 주요 행동 실행 | 사용자 검토 대기 |
| [Checkbox](../apps/docs/content/components/checkbox.json) | 라벨과 선택 상태 연결 | 사용자 검토 대기 |
| [Chip](../apps/docs/content/components/chip.json) | 선택 상태를 부모에서 반영 | 사용자 검토 대기 |
| [FabMenuSegment](../apps/docs/content/components/fab-menu-segment.json) | 개별 액션의 실행 함수 연결 | 사용자 검토 대기 |
| [FabMenu](../apps/docs/content/components/fab-menu.json) | 관련 액션 목록과 실행 함수 연결 | 사용자 검토 대기 |
| [Fab](../apps/docs/content/components/fab.json) | 단일 주요 행동 실행 | 사용자 검토 대기 |
| [FilterChip](../apps/docs/content/components/filter-chip.json) | 필터 설정과 적용은 소비 앱에서 제공 | 사용자 검토 대기 |
| [IconButton](../apps/docs/content/components/icon-button.json) | 아이콘으로 항목 추가 | 사용자 검토 대기 |
| [LoadingIndicator](../apps/docs/content/components/loading-indicator.json) | 진행률을 모르는 작업의 대기 표시 | 사용자 검토 대기 |
| [MenuItem](../apps/docs/content/components/menu-item.json) | 항목 클릭을 기능에 연결 | 사용자 검토 대기 |
| [NavigationBarGlassItem](../apps/docs/content/components/navigation-bar-glass-item.json) | 단독 항목의 활성 상태 연결 | 사용자 검토 대기 |
| [NavigationBarGlass](../apps/docs/content/components/navigation-bar-glass.json) | 현재 목적지를 부모 상태에 연결 | 사용자 검토 대기 |
| [NavigationBarItem](../apps/docs/content/components/navigation-bar-item.json) | 단독 항목의 활성 상태 연결 | 사용자 검토 대기 |
| [NavigationBar](../apps/docs/content/components/navigation-bar.json) | 현재 목적지를 부모 상태에 연결 | 사용자 검토 대기 |
| [NavigationDrawerCategory](../apps/docs/content/components/navigation-drawer-category.json) | 탐색 메뉴 묶음에 이름 제공 | 사용자 검토 대기 |
| [NavigationDrawerItem](../apps/docs/content/components/navigation-drawer-item.json) | 직접 조립하는 주·하위 메뉴 | 사용자 검토 대기 |
| [NavigationDrawerMenu](../apps/docs/content/components/navigation-drawer-menu.json) | 하위 목록의 펼침과 선택 연결 | 사용자 검토 대기 |
| [NavigationDrawer](../apps/docs/content/components/navigation-drawer.json) | 카테고리·주 메뉴·하위 메뉴 조립 | 사용자 검토 대기 |
| [ProgressIndicator](../apps/docs/content/components/progress-indicator.json) | 앱에서 받은 실제 진행률 표시 | 사용자 검토 대기 |
| [Radio](../apps/docs/content/components/radio.json) | 같은 묶음에서 하나 선택 | 사용자 검토 대기 |
| [RemovableChip](../apps/docs/content/components/removable-chip.json) | 부모 목록에서 항목 제거 | 사용자 검토 대기 |
| [SegmentControl](../apps/docs/content/components/segment-control.json) | 보기 방식 선택 | 사용자 검토 대기 |
| [Select](../apps/docs/content/components/select.json) | 옵션 목록에서 하나 선택 | 사용자 검토 대기 |
| [Slider](../apps/docs/content/components/slider.json) | 단일 수치 조절 | 사용자 검토 대기 |
| [SnackBar](../apps/docs/content/components/snack-bar.json) | 표시·자동 닫힘·다시 표시하기 | 사용자 검토 대기 |
| [TextArea](../apps/docs/content/components/text-area.json) | 여러 줄의 내용 입력 | 사용자 검토 대기 |
| [TextField](../apps/docs/content/components/text-field.json) | 입력과 지우기를 같은 상태에 연결 | 사용자 검토 대기 |
| [Toggle](../apps/docs/content/components/toggle.json) | 즉시 적용하는 설정 전환 | 사용자 검토 대기 |
| [Tooltip](../apps/docs/content/components/tooltip.json) | 설명과 대상 연결: 표시 제어는 소비 앱에서 제공 | 사용자 검토 대기 |

모든 JSON은 draft예요. 기술 검증이 끝났다는 이유로 사용자 승인을 대신하지 않았어요. 아래 처리 기록을 다시 검토한 뒤 승인한 문서만 stable로 바꿔요. 새로운 명세 차이를 발견하면 review.questions 또는 review.implementationGaps에 다시 기록해요. 승인 기준은 [변환 안내](component-guide-json.md#검토와-공개를-구분해요)에서 관리해요.

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

예시 파일을 components 폴더와 같은 위치에 둔 경우를 보여줘요. 기본 설치가 src/components/ui이면 src/Example.tsx, components/ui이면 프로젝트 루트 Example.tsx에서 ./components/ui/{항목}을 가져와요. 다른 위치의 파일이나 사용자 지정 설치 경로에서는 eli.json과 실제 파일을 확인해 상대 import를 맞춰야 해요. ELI 전용 별칭·전체 UI 패키지 import·별도 CSS import를 요구하지 않아요.

[UI PR #103](https://github.com/ELI-team/ELI/pull/103)의 기준 커밋 1acaffa749c11a2316b28ce44499bf263d70b51c에서 만든 레지스트리 JSON으로 소스를 복원한 소비 폴더에 예시 31개를 저장하고, 저장소의 strict·exactOptionalPropertyTypes 설정으로 타입 검사와 Vite 빌드를 확인했어요. 스키마·출처 해시·공개 심벌·선택 조합도 다시 확인했어요. 예시를 전부 브라우저에서 조작했거나 실제 기기에서 검수했다는 뜻은 아니에요. UI 핵심 동작은 별도의 실제 tarball·선택 소스 소비 검사 기록을 참고해요.

표시용 Tooltip 예시는 트리거 연결 관계만 보여주며 자동 Hover·Focus 열림을 구현했다고 안내하지 않아요. Navigation 예시의 원·채움 원은 소비 앱이 제공하는 outlined·filled 아이콘 자리의 예시예요. 실제 라우팅·저장 요청은 소비 앱에서 연결해요.

Tab은 미작성, Modal·Divider는 원문 미전달 상태라 JSON을 만들지 않았어요. 미제공 문서 때문에 다른 문서의 검토를 막지 않아요.
