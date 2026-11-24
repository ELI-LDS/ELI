# 변경 내역

이 문서는 사용자에게 영향을 주는 변경과 릴리스 상태를 기록해요. `Unreleased`와 준비 중인 구역은 게시 완료를 뜻하지 않아요. CLI·UI 소스 콘텐츠·기존 npm UI 패키지의 배포 상태를 구분해요. 버전 결정과 게시 절차는 [버전 규칙](Agent/versioning.md)을 따라요.

## Unreleased

### 원격 MCP — 배포 완료

- 문서 앱의 `/mcp`에 도구 일곱 개를 등록하고 Cloudflare Workers로 `https://eli-design.dev/mcp`에 배포했어요. 레지스트리 JSON에서 컴포넌트 섹션·props·토큰을 만들어 돌려주고, 섹션·prop 이름·필드·토큰 구역으로 응답을 좁혀요. npm 그룹 import 경로 대신 레지스트리 항목 `id`와 `entry`를 알려줘요. 2026-11-24에 공개 주소에서 도구 일곱 개의 응답을 확인했어요. 가이드 원본은 아직 없어요. 서버는 `main`의 소스를 설명하므로 공개된 UI 콘텐츠 0.2.0에 없는 미배포 변경이 응답에 보일 수 있어요.
- 컴포넌트 문서의 섹션을 검토한 컴포넌트 가이드 JSON에서 만들도록 바꿨어요. `do-dont`·`accessibility`·`related` 섹션을 제공하고 `behavior` 섹션 키를 없앴어요. 목록과 상세 응답에 가이드의 검토 상태 `status`를 담고 `list_components`를 `status`로 좁힐 수 있어요. 현재 가이드 31개는 모두 검토 전 `draft`이고 Divider·Modal·Tab은 가이드가 없어요. props·토큰은 이전처럼 레지스트리에서 추출해요.

### 개발 환경

- Storybook·Vite·ESLint·typescript-eslint를 보안 수정 버전으로 갱신했어요. Storybook 문서 추출 도구의 glob은 수정판으로 제한해 교체하고, 소비 검사도 같은 Vite 버전을 사용해요. 알려진 취약점은 전체 의존성 감사에서 0개로 확인했어요. CLI·UI·하네스 버전과 기존 배포 파일은 변경하지 않았어요.

### 문서

- README 상단의 메인 로고와 테두리 표를 빼고, 투명 배경 캐릭터는 왼쪽·제목과 소개는 오른쪽에 배치해요. 캐릭터와 글을 합친 전체 소개 영역을 가운데에 두고 글은 영역 안에서 중앙정렬해요. 제목과 구분선을 테마별 투명 SVG로 분리해 오른쪽 글 영역 안에만 표시하고, 캐릭터 뒤로 겹치지 않게 해요. 다크 모드에서는 몸체만 밝게 바꾸며 눈의 채움색은 유지해요. 동작 줄이기 설정에서는 테마에 맞는 정지 이미지를 보여줘요. AI 에이전트 안에서 일하는 디자이너라는 설정과 최신 설치·기능·릴리스 안내는 유지해요. npm 배포 파일과 버전은 변경하지 않아요.

- 디자이너 Markdown을 코드와 대조해 검토하는 사용 가이드 JSON Schema·공통 템플릿·전달받은 컴포넌트별 JSON 초안을 준비했어요. 사용자 검토와 실제 MCP·하네스 연결은 별도이며 자동 Markdown 변환기는 추가하지 않았어요.
- Notion의 기본 템플릿과 컴포넌트 문서 원문 23개를 가져왔어요. 본문이 있는 21개 컴포넌트 원문을 실제 공개 심벌별 JSON 31개로 정리했어요. Tab은 미작성이라 제외하고 Modal·Divider는 전달받은 원문이 없어 만들지 않았어요. 현재 코드와 원문의 차이를 검토 기록에 남기고 개발자 사용 예시 31개의 타입 검사·Vite 빌드를 확인했어요. 모든 JSON은 사용자 검토 전 draft이며 MCP·하네스 담당자에게 전달할 연결 작업과 검증 기준을 인계 문서에 정리했어요.
- 커스터마이징의 적용 요소·우선순위·상태별 영향과 사용자 수정의 의미를 정리했어요. Button·TextField·TextArea·Select·Modal의 hover 설명, Storybook과 사용자 README를 실제 구현에 맞췄어요. 동작·공개 props는 유지하며 배포에 포함되는 JSDoc·README 변경은 UI 콘텐츠·CLI의 다음 묶음 업데이트에 PATCH로 반영해요. 기존 고정 파일·태그는 변경하지 않아요.

- Storybook의 Modal 직접 바꿔보기에 열기·닫기 흐름을 표시하고, Chip의 클릭 선택 상태와 Controls를 연결했어요. 한눈에 보기의 Chip도 각각 선택·해제할 수 있어요. 공개 UI 소스와 API는 변경하지 않았어요.
- npm 게시 완료 안내와 공식 홍보 전후의 버전 정책, 수동 릴리스 절차를 정리했어요. 패키지 README의 변경은 다음 npm 릴리스에 반영돼요.
- 개별 소스 추가를 기본으로 하는 배포 방향과 진입점 `eli-design`, 하네스 연동·버전·전체 다운로드량의 지침을 정리했어요. 로컬 구현과 공개 배포·하네스 연결을 구분해요.
- 종료 예정인 `@eli-design/ui`를 신규 설치 대안에서 제외하고 컴포넌트 사용 예시를 CLI 소스·로컬 import 기준으로 전환했어요. UI 원본·내부 연결·과거 기록은 유지하며 npm 삭제·게시 작업은 하지 않았어요.
- 하네스 설치 안내의 게시 준비 문구와 기존 패키지 점검의 버전 비교 기준을 바로잡았어요. 하네스 문서 변경은 다음 독립 패치 릴리스 대상으로 기록하며 공개된 0.1.0 JSON은 변경하지 않아요.

### 개발 환경

- 문서 앱과 소비 검증의 Next.js를 `16.4.3`에서 `16.4.6`으로 올렸어요. UI 패키지의 실행 의존성을 추가한 변경은 아니에요. [#73](https://github.com/ELI-team/ELI/pull/73)

## UI 소스 콘텐츠 0.3.0 — 2026-11-24

[GitHub Release v0.3.0](https://github.com/ELI-team/ELI/releases/tag/v0.3.0)에 레지스트리 JSON 53개로 공개했어요. 원본 커밋은 `5428bd00306f2cfa757ac02b9a5db6e718d701ba`, `registry.json`의 SHA-256은 `ede4630ddc7f83e3e31cdd8ec90610f54731594d89d89532dcc06d586f7e0c2e`예요. 공개 주소에서 다시 받은 모든 JSON이 로컬 생성 파일과 같은 것을 확인했어요. 기존 @eli-design/ui를 npm에 다시 게시하는 작업이 아니에요. 새 기능과 허용 타입 축소를 포함해 현재 0.x 정책의 MINOR예요. 이전 v0.2.0 JSON·태그·설치 기록은 변경하지 않아요. 이미 0.2.0을 설치한 프로젝트를 새 버전으로 올리는 명령은 아직 없어요.

### 변경

- SnackBar에 duration·open·defaultOpen·onOpenChange를 추가해 기본 5초 후 닫히도록 해요. 0이면 자동 닫힘을 끄고 마우스·내부 포커스·창 비활성 중에는 남은 시간을 보존해요. 기존 액션 콜백은 유지하며 자동 닫힘을 추가한 동작 변경도 다음 MINOR에 포함해요.
- BREAKING CHANGE: 사용자 합의에 따라 NavigationBar·NavigationBarGlass의 항목별 disabled와 단독 Item의 disabled 타입·처리를 제거해요. 비선택 항목은 모두 이동할 수 있어요. 이동 불가 항목을 전달하던 소비자는 목록 구성을 검토해야 해요. SegmentControl 2~4개·NavigationBar 3~5개는 강제 제한이 아닌 권장 범위로 안내해요.

- Button의 Brand·Neutral Ghost 기본 배경을 디자이너 문서와 사용자 합의에 따라 투명하게 변경해요. Hover·Pressed·Disabled의 기존 배경은 유지해요. 문서로 설명한 기본 외형의 변경이며 기존 공개 JSON·CLI 고정 파일은 바꾸지 않아요.
- Slider의 초기값·제어값·변경값을 같은 min·max·step 기준으로 보정해 실제 input·표시·트랙·콜백의 불일치를 수정해요.
- TextField의 외부 객체·콜백 ref가 내부 입력 지우기 참조에 덮어써지는 문제를 수정하고, TextField·TextArea·Checkbox·Radio에 실제 입력 요소를 가리키는 ref 타입을 명시해요.
- NavigationBar·NavigationBarGlass·SegmentControl에 일반 readonly 배열을 허용해 map 결과를 바로 전달해요. 선택 항목 제거 시 비제어는 첫 사용 가능 항목으로 보정하고, 제어 값이 목록에 없으면 선택 표시를 숨겨요. 목록 변경만으로 콜백을 호출하지 않아요.
- Select·SegmentControl의 전체·옵션별 disabled와 FabMenu의 항목별 disabled를 연결해요. 비활성 항목은 선택하거나 실행할 수 없어요. 새 색상은 추가하지 않아요.
- LoadingIndicator·ProgressIndicator의 progress를 0~100 숫자로 넓히고 실제 중간 진행률을 표시해요. 범위 밖 값은 제한하며 생략·NaN·Infinity는 진행률을 모르는 상태로 처리해요. 기존 디자인·반복 모션을 유지해요.
- BREAKING CHANGE: 렌더링할 수 없는 네이티브 속성을 공개 타입에서 제외해요. Checkbox·Radio·Divider의 children은 주변 label·요소로 옮기고, 직접 HTML 주입 대신 각 컴포넌트의 내용 prop을 사용해요. 새 기능·허용 타입 축소를 포함하므로 현재 0.x 정책의 MINOR에 모아 배포하며 버전·기존 고정 파일은 이번에 변경하지 않아요.

## 하네스 콘텐츠 0.2.1 — 2026-11-24

[GitHub Release harness-v0.2.1](https://github.com/ELI-team/ELI/releases/tag/harness-v0.2.1)에 공개했어요. 원본 커밋은 `5428bd00306f2cfa757ac02b9a5db6e718d701ba`, `harness.json`의 SHA-256은 `501401a9d0d8549bc5dedbfe953f14630c2cbf693c4e1033f60e915e997cf0f0`이에요. 원격 MCP가 컴포넌트 가이드 JSON으로 답하도록 바뀐 데 맞춘 스킬 문구 수정이라 PATCH예요.

### 변경

- `eli` 스킬에 `do-dont`·`accessibility` 섹션을 읽는 방법, 예시 코드의 import를 실제 설치 경로로 바꿔 쓰는 방법, 검토 전(`draft`) 가이드를 다루는 방법을 추가했어요.

## 하네스 콘텐츠 0.2.0 — 2026-11-24

[GitHub Release harness-v0.2.0](https://github.com/ELI-team/ELI/releases/tag/harness-v0.2.0)에 공개했어요. `harness.json`의 SHA-256은 `da85ee04abdc3227ee1dcc94ae9dd9605bb279adde151fe57ba04568c069f572`이고 원본 커밋은 `6e1ce5cc6c87e35964dbd67191359b7cc8ad0941`이에요. 별도 npm 패키지가 아니에요. 설치 도구의 `harness` 명령이 이 Release의 `harness.json`을 받아요. 새 스킬 안내와 설치 단계가 추가되어 현재 0.x 정책의 MINOR예요. 이미 0.1.0을 설치한 프로젝트를 다른 버전으로 덮어쓰는 명령은 아직 없어요.

### 추가

- `eli` 스킬에 원격 MCP 주소 `https://eli-design.dev/mcp`와 Claude Code·Codex 연결 방법을 적었어요.
- 섹션·prop·필드·토큰 구역으로 좁혀 읽는 방법과, 응답의 `id`·`entry`를 설치 기록의 실제 경로와 연결하는 방법을 추가했어요.
- 설치 안내에 MCP 연결 단계를 추가했어요. 사용자 확인을 받고 추가한 뒤 `list_components`로 확인해요.

### 변경

- `get_versions`의 `ui.latest`·`ui.docs`를 UI 콘텐츠 버전으로 안내하고 `eli.json`의 콘텐츠 버전과 비교해요.
- 가이드가 아직 없을 때(`not_found`) 멈추지 않고, 원격 기준 없이 진행했다고 보고해요.

## eli-design 0.3.1 — 2026-11-24

2026-11-24에 npm `next`로 게시한 뒤 `latest`로 전환했어요. `npx eli-design@latest`로 `init`·`add`·`harness`·`status`를 실행해 UI 0.3.0과 하네스 0.2.1을 받는 것을 확인했어요. npm의 tarball은 고정 파일과 SHA-256(`cbd6d816558439550a257cfdc7f8c9cc9488fac5f917ff621e48b7c9398568d3`)이 같고, 공개 명령으로 `init`·`add button`·`status`·`harness`를 확인했어요. 이전 `latest`였던 0.2.0은 저장소 이전 뒤로 콘텐츠를 받지 못해요. 저장소 이전 주소와 status 안내를 수정한 최종 파일을 [cli-v0.3.1](https://github.com/ELI-team/ELI/releases/tag/cli-v0.3.1)에 제공하고 같은 tarball의 설치 행렬·공개 콘텐츠·브라우저 검증을 완료했어요. 기존 0.3.0 고정 파일은 보존해요. [릴리스 기록](handbook/releases/0.3.1.md)에서 파일·해시·수행 범위와 실제 npm 게시 상태를 구분해요.

### 수정

- UI·하네스 콘텐츠 조회를 새 원본 저장소 ELI-team/ELI의 Release API·asset 주소로 연결하고 이전 API 이동 응답으로 최신 조회가 중단되는 문제를 수정해요. 기존 설치 기록의 태그·버전·해시 검증을 유지해요.
- status의 일반 출력을 한글로 정리하고 UI·하네스의 변경·누락 파일과 다음 확인 방법을 표시해요. 조회 결과의 JSON 계약·종료 코드·기존 파일은 유지해요.

### 포함하는 이전 변경

- 0.3.0 후보의 components/ui 기본 설치 위치·짧은 진입 경로·기존 모듈 충돌 보호를 포함해요. UI 콘텐츠 0.2.0과 하네스 0.1.0은 이미 공개된 파일을 재사용해요.
- BREAKING CHANGE: 게시된 0.2.0과 비교하면 새 init의 기본 위치가 components/eli에서 src/components/ui 또는 components/ui로 바뀌어요. 이전 위치는 init --dir로 지정해요. 기존 eli.json·설치 소스·경로 별칭은 자동 변경하지 않아요. 0.3.0 후보 이후의 수정은 PATCH지만 npm 0.2.0 사용자의 이전에는 MINOR 변경을 포함해요.

## eli-design 0.3.0 — 이전 고정 후보 보존

아직 npm에 게시하지 않았어요. CLI의 기본 설치 위치와 충돌 보호를 바꾸는 MINOR 후보예요. 2026-11-23 UI 콘텐츠 0.2.0·공개 하네스 0.1.0의 소비 검증을 완료하고 [cli-v0.3.0](https://github.com/ELI-team/ELI/releases/tag/cli-v0.3.0)에 고정 파일을 제공했어요. 해시·크기·검증 범위와 실제 게시 상태는 [릴리스 기록](handbook/releases/0.3.0.md)에서 구분해요.

### 변경

- 새 초기화의 기본 위치를 src 유무에 따라 `src/components/ui` 또는 `components/ui`로 정하고 초기화 결과에 경로를 표시해요. 기존 eli.json의 설치 위치와 앱의 별칭 설정은 유지해요.
- 같은 모듈명의 기존 파일이나 폴더의 index 구현이 있으면 짧은 import가 다른 구현을 가리지 않도록 중단해요.
- npm README를 사용자 설치·사용법과 새 경로 기준으로 정리했어요.

### 수정

- 미게시 0.2.1 후보에 준비했던 하네스 전용 프로젝트의 일반 status 출력 수정을 포함해요. 하네스 콘텐츠 자체는 공개된 0.1.0을 그대로 사용해요.

### 이전 안내

BREAKING CHANGE: 별도 경로를 지정하지 않은 새 초기화의 기본 위치가 components/eli에서 components/ui로 바뀌어요. 이전 위치가 필요하면 init --dir로 지정해요. 이미 초기화한 프로젝트는 고정된 경로와 콘텐츠를 계속 사용하며 자동 이동·업데이트는 제공하지 않아요.

## UI 소스 콘텐츠 0.2.0 — 2026-11-23

[GitHub Release v0.2.0](https://github.com/ELI-team/ELI/releases/tag/v0.2.0)에 공개했어요. 기존 @eli-design/ui를 npm에 다시 게시하는 작업이 아니에요. 이전 v0.1.0 JSON·태그·설치 기록은 변경하지 않았어요.

### 변경

- 공개 진입 파일을 button/Button/Button.tsx에서 button.tsx처럼 짧게 제공해요. 스타일·타입·Hook은 컴포넌트 보조 폴더로 모으고 TS·CSS·URL 참조와 해시를 새 배치에 맞춰 생성해요. 원본과 컴포넌트 디자인은 유지해요.

### 추가

- Modal에 open·defaultOpen·onOpenChange, Dim·Secondary·Esc 닫기, 포커스 순환·복귀와 배경 잠금·복원을 추가해요. Secondary는 콜백 후 닫고 preventDefault로 취소할 수 있어요. Positive는 자동으로 닫지 않아요.
- TextField의 X를 입력 지우기로 연결해요. onChange에 빈 값을 전달하고 포커스를 복원하며 readonly·disabled에서는 막아요. 바깥 label은 div로 바꾸고 내부 label과 input을 htmlFor/id로 연결해요.

### 이전 안내

BREAKING CHANGE: 새 콘텐츠를 사용할 때 로컬 import를 짧은 진입 파일에 맞춰야 해요. 기존 소스는 자동으로 이동하지 않아요. 사용자 수정 파일을 확인한 뒤 별도로 이전해요. Modal의 기존 Secondary 클릭 뒤에도 열림을 유지하려면 콜백에서 preventDefault를 사용하거나 외부 open 상태를 제어해요. TextField의 바깥 요소를 대상으로 한 CSS 선택자도 확인해요.

## eli-design 0.2.1 — 과거 패치 후보

CLI 실행 오류와 사용자용 README를 수정한 패치 후보예요. npm 게시는 담당자가 진행하며, 이 구역은 게시 완료를 뜻하지 않아요. UI·하네스 콘텐츠는 공개된 0.1.0을 재사용하고 이번 후보에 미배포 하네스 문서 변경을 묶지 않아요.

### 수정

- 하네스만 설치한 프로젝트에서 `eli-design status`의 기본 출력이 파일 오류로 실패하던 문제를 고쳤어요. UI가 없다고 표시하고 하네스 버전과 파일 상태를 함께 보여줘요. 게시된 `eli-design@0.2.0`에는 포함되지 않았고 `--json` 출력은 영향이 없었어요.

- npm README에서 저장소 개발·검증 절차를 제거하고 소스 선택 설치·사용 예시·하네스 선택 설치를 중심으로 안내해요.

## eli-design 0.2.0 — 2026-11-21

[GitHub 전달 파일](https://github.com/ELI-team/ELI/releases/tag/cli-v0.2.0)을 공개하고 익명 다운로드와 원본 바이트 일치를 확인했어요. 2026-11-21에 npm에 게시됐고, 2026-11-22 조회에서 `latest`·`next`와 전달 파일의 integrity 일치를 확인했어요. 기존 UI 0.1.0 콘텐츠와 독립 하네스 0.1.0을 사용해요. [게시·검증 기록](handbook/releases/0.2.0.md)에서 수행한 범위를 구분해요. [#81](https://github.com/ELI-team/ELI/pull/81), [#82](https://github.com/ELI-team/ELI/pull/82)

### 추가

- CLI 0.2.0에 `harness --agent claude|codex|all`을 추가했어요. 하네스를 선택하면 전체 스킬·훅과 설치 기록을 받고 기존 에이전트 설정에 중복 없이 병합해요. UI 추가에는 하네스가 포함되지 않아요.
- 하네스 콘텐츠의 독립 버전·JSON 규격·생성기와 소스 설치 인식을 추가했어요. 설치 도구·UI 콘텐츠·하네스 버전을 따로 확인하고 스킬은 실제 로컬 진입 경로를 사용해요. 원격 MCP 응답 계약과 실제 에이전트의 스킬 수행은 별도예요.

### 수정

- 하네스 설치의 기본 터미널 출력에도 스킬 재로딩·Codex 훅 신뢰·원격 MCP 별도 연결 안내를 표시해요.
- 여러 설정을 병합하다 실패하면 새 파일과 이미 바꾼 설정을 함께 복구하고 기존 파일 권한을 보존해요. 사용자 수정 파일·손상 데이터·심볼릭 링크와 다른 버전의 덮어쓰기는 거부해요.

## 하네스 콘텐츠 0.1.0 — GitHub 공개

[하네스 Release](https://github.com/ELI-team/ELI/releases/tag/harness-v0.1.0)에 스킬·훅 등 원본 22개를 담은 독립 JSON을 제공해요. CLI에서 에이전트를 명시적으로 선택할 때만 설치하며 UI만 요청하면 내려받지 않아요. 설치·설정·소스 UI 인식 검증과 실제 에이전트·원격 MCP 검증은 구분해요.

## eli-design 0.1.0 — 릴리스 준비 중

UI 전용 초기 후보의 과거 기록이에요. 이 후보는 npm에 게시하지 않았고, 이후 하네스 선택 설치를 포함한 CLI 0.2.0을 게시했어요. 기존 0.1.0 전달 파일은 보존해요.

아래는 당시 준비한 내용이에요. 현재 사용법과 게시 상태는 [CLI 안내](packages/cli/README.md)와 [0.2.0 기록](handbook/releases/0.2.0.md)을 따라요.

- 초기 설정·공개 목록·34개 컴포넌트 각각의 선택 설치·다중/전체 추가·설치 상태·미리보기·JSON 결과를 제공해요. [#78](https://github.com/ELI-team/ELI/pull/78)
- 필요한 하위 컴포넌트·공통 토큰·아이콘을 함께 추가하고, 수정 파일을 보존하며 버전·해시·경로를 기록해요.
- 여섯 패키지 매니저 환경의 임시 실행·소스 소비·설정 보존 검사와 콜드/재실행 응답 본문 측정을 제공해요. 공개 CDN의 실측 전송량과는 구분해요.
- npm 담당자가 검증된 tarball의 게시·태그 변경만 맡도록 GitHub 파일 전달과 게시 후 검증 책임을 구분했어요. 패키지 README는 공개 명령과 저장소 실행을 나눠 안내해요.
- React·폰트·하네스 자동 설치, 수정 파일 덮어쓰기와 UI 업데이트는 제공하지 않아요. MCP·하네스 연결은 별도 담당자의 후속 작업이에요.

## UI 소스 콘텐츠 0.1.0 — GitHub 공개

GitHub Release `v0.1.0`에 공개된 첫 선택 설치 콘텐츠예요. **기존 `@eli-design/ui`의 npm 0.1.0 게시를 뜻하지 않아요.**

- 34개 공개 컴포넌트의 소스·CSS·타입·Hook과 필요한 공유 파일을 제공해요. 목록·항목 JSON 규격은 v1이며 SHA-256과 의존 항목을 포함해요. [#74](https://github.com/ELI-team/ELI/pull/74)
- 버튼·입력·선택·탐색 컴포넌트의 상호작용 전환을 Figma 기준으로 갱신했어요. LoadingIndicator의 확정 진행률은 SVG 원형 트랙으로 표현해요. [#72](https://github.com/ELI-team/ELI/pull/72)
- CLI가 선택한 JSON만 받아 로컬 import·CSS 자동 연결을 유지해요. 전체 ELI 패키지나 하네스를 설치 의존성으로 요구하지 않아요.

준비 상태·확인한 게시 이력·검증 후보와 남은 항목은 [릴리스 준비 기록](handbook/releases/0.1.0.md)에서 관리해요. 실제 게시 날짜와 최종 원본 SHA는 게시 단계에서 확정해요.

## 0.0.0 — 2026-11-16

- npm 메타데이터에서 `@eli-design/ui@0.0.0`의 일반 버전 게시를 확인했어요.
- 당시 게시 원본 커밋·Git 태그·검증 기록은 확인되지 않았어요. 현재 `main`을 이 버전의 원본으로 간주하거나 과거 태그를 임의로 만들지 않아요.
- 이 구역은 확인 가능한 최초 일반 게시 사실만 복구한 기록이에요. 당시의 전체 기능 목록이나 시험 배포 이력을 추정해 작성하지 않았어요.

[npm 게시 기록](https://registry.npmjs.org/@eli-design%2fui)
