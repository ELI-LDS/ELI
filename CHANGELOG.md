# 변경 내역

이 문서는 사용자에게 영향을 주는 변경과 릴리스 상태를 기록해요. `Unreleased`와 준비 중인 구역은 게시 완료를 뜻하지 않아요. CLI·UI 소스 콘텐츠·기존 npm UI 패키지의 배포 상태를 구분해요. 버전 결정과 게시 절차는 [버전 규칙](Agent/versioning.md)을 따라요.

## Unreleased

### UI 콘텐츠 · 설치 이름과 Chip API 정리

- `Chip` 하나에서 `variant="selectable" | "filter" | "removable"`로 역할을 선택해요. 기본은 selectable이며 기존 스타일·동작을 유지해요. 별도 FilterChip·RemovableChip export와 설치 항목을 제거하고 옵션 타입은 ChipOption으로 제공해요.
- 설치 ID를 `text-area` → `textarea`, `snack-bar` → `snackbar`, `progress-indicator` → `indicator`, `loading-indicator` → `spinner`, `navigation-drawer` → `drawer`로 줄여요. 이 다섯 컴포넌트의 React 심벌과 내부 CSS 이름은 유지해요.
- 기존 설치 경로·공개 Chip API가 바뀌는 다음 UI 콘텐츠 MINOR 대상이에요. npm CLI·콘텐츠 버전은 이번에 올리거나 게시하지 않아요. 이미 설치한 파일·기록을 자동으로 이동하지 않아요. 이전 방법은 packages/ui/README.md를 참고해요.


### 컴포넌트 사용 가이드

- 전달받은 Modal·Divider·Tab Markdown을 보존하고 공개 컴포넌트별 JSON·소스 설치 예시를 추가해요. Tab의 빈 원문은 최신 전달본으로 교체해요. 기존 stable 31개는 유지하고 새 3개는 draft로 검증한 뒤 사용자 승인에 따라 stable로 전환해요. 전체 34개 가이드의 내용과 예시를 조회할 수 있는 데이터로 준비하며, 공개 MCP 반영은 배포 후 확인해요.
- Modal 문서의 이전 닫힘·포커스 설명을 현재 구현과 대조해 보완하고, Divider 예시의 로컬 import와 Tab의 개별 토글·소비 앱의 그룹 동작을 구분해요. UI 구현·공개 API·패키지 버전·배포 파일은 변경하지 않아요.

### 원격 MCP — 배포 완료

- 문서 앱의 `/mcp`에 도구 일곱 개를 등록하고 Cloudflare Workers로 `https://eli-design.dev/mcp`에 배포했어요. 레지스트리 JSON에서 컴포넌트 섹션·props·토큰을 만들어 돌려주고, 섹션·prop 이름·필드·토큰 구역으로 응답을 좁혀요. npm 그룹 import 경로 대신 레지스트리 항목 `id`와 `entry`를 알려줘요. 2026-11-24에 공개 주소에서 도구 일곱 개의 응답을 확인했어요. 가이드 원본은 아직 없어요. 서버는 `main`의 소스를 설명하므로 공개된 UI 콘텐츠 0.2.0에 없는 미배포 변경이 응답에 보일 수 있어요.
- 컴포넌트 문서의 섹션을 검토한 컴포넌트 가이드 JSON에서 만들도록 바꿨어요. `do-dont`·`accessibility`·`related` 섹션을 제공하고 `behavior` 섹션 키를 없앴어요. 목록과 상세 응답에 가이드의 검토 상태 `status`를 담고 `list_components`를 `status`로 좁힐 수 있어요. 현재 가이드 31개는 모두 검토 전 `draft`이고 Divider·Modal·Tab은 가이드가 없어요. props·토큰은 이전처럼 레지스트리에서 추출해요.
- 사용자 승인에 따라 컴포넌트 가이드 31개를 `stable`로 전환했어요. 일반 응답에는 `stable` 가이드의 내용만 담고, 검토 전(`draft`)인 컴포넌트는 상태만 알려요. Divider·Modal·Tab의 가이드는 나중에 추가돼요.

### 개발 환경

- Storybook·Vite·ESLint·typescript-eslint를 보안 수정 버전으로 갱신했어요. Storybook 문서 추출 도구의 glob은 수정판으로 제한해 교체하고, 소비 검사도 같은 Vite 버전을 사용해요. 알려진 취약점은 전체 의존성 감사에서 0개로 확인했어요. CLI·UI·하네스 버전과 기존 배포 파일은 변경하지 않았어요.

### 문서

- 저장소 홈과 README 파일 보기의 폭 차이로 소개가 깨지는 문제를 고쳤어요. 캐릭터·제목·문구를 하나의 투명 배경 애니메이션 배너로 묶고 좁은 화면에는 세로 배너를 사용해요. 라이트·다크 모드와 동작 줄이기 설정에 맞는 GIF·정지 이미지를 제공하며 눈 색은 유지해요. 링크는 실제 HTML 링크로 남기고 설치·MCP·릴리스 안내와 npm 배포 파일·버전은 변경하지 않아요.

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

## eli-design 0.6.0 — 2026-11-25

2026-11-25에 npm `next`로 게시한 뒤 `latest`로 전환했어요. 원본 커밋은 `30b0635547d1e8ce40e09f9bdf67802cd987b266`([#124](https://github.com/ELI-team/ELI/pull/124))이에요. 고정 파일의 SHA-256은 `ff39a80858b5e5c70dbcd5731ddd47551613ab93b875e13dc798b299ce199906`, integrity는 `sha512-au9uE+hEaJLjx7lLehoxTqnw3bZt6Tg0wnvWz4b8ZhWmWP6pD5K1vFAmGwzYTrFt2wvSxvnTe0c1IARBwFsApQ==`예요(20,726 B / 압축 해제 68,544 B / 11개 파일). 공개 명령으로 하네스 0.5.0을 설치한 새 프로젝트에서 `harness --update`로 0.6.0까지 올리고 `status`를 확인했어요. `pnpm check`와 고정 tarball의 설치 행렬 재실행, `cli-v0.6.0` Release 전달 단계는 생략했어요.

### 변경

- CLI에 `harness --update`를 추가했어요. 설치한 하네스를 최신 버전(또는 `--harness-version`으로 지정한 버전)으로 옮겨요. 설치 당시와 같은 파일만 새 내용으로 바꾸고 이미 설치한 에이전트를 모두 함께 옮겨요. 직접 수정한 스킬·훅이 하나라도 있으면 아무것도 바꾸지 않고 그 목록을 알려줘요. `--dry-run`으로 지금 버전과 최신 버전, 바뀔 파일을 미리 볼 수 있어요. 새 버전에서 빠진 파일은 지우지 않고 알려줘요. CLI의 MINOR 변경이에요.

## 하네스 콘텐츠 0.6.0 — 2026-11-25

[GitHub Release harness-v0.6.0](https://github.com/ELI-team/ELI/releases/tag/harness-v0.6.0)에 공개했어요. 원본 커밋은 `30b0635547d1e8ce40e09f9bdf67802cd987b266`, `harness.json`의 SHA-256은 `c7c9ee0a4ded391e5926649d3508ee0b5f141cd309a684a9fd789e3850831f09`예요. 설치 도구 0.6.0 이상과 함께 써요.

### 변경

- `/eli-update`를 이 명령으로 동작하게 다시 썼어요. 하네스·UI 콘텐츠·설치 도구의 버전을 각각 확인하고 하네스를 실제로 올려요. 이전에는 원격 MCP의 `get_versions`만 보고 판단했는데, 이 응답은 UI 콘텐츠의 최신 버전만 알려줘서 하네스가 뒤처져 있어도 최신이라고 안내했어요. 기존 npm 패키지용 절차는 뺐어요.
- UI 소스를 다른 콘텐츠 버전으로 옮기는 명령은 아직 없어요.
- 설치한 ELI 컴포넌트를 프로젝트에 맞게 키우게 했어요. 실제 화면에서 맞지 않으면 원본을 다듬고, 일부 상황에서만 다른 모양이 필요하면 복사해서 프로젝트 변형을 만들어요. 만든 것은 `DESIGN.md`의 새 `## 컴포넌트` 표에 적고 디자인 시스템 페이지의 "프로젝트 컴포넌트" 구역에 보여줘요. 변형 여러 개가 같은 방향을 가리키면 디자인 원칙으로 올려요.
- 변형은 ELI 설치 폴더 밖에 두고 프로젝트 토큰만 써요. 바탕 컴포넌트의 포커스 표시·누르는 영역·상태·이름은 잃지 않아요. 겹치는 변형은 합치고 쓰지 않는 변형은 지워요.
- `/eli-verify`는 표에 적힌 변형과 고친 원본을 위반으로 보지 않아요. 기록 없는 변형, 겹치는 변형, 변형이 잃은 것을 찾아요.
- 이전의 "ELI에 맞는 컴포넌트가 있으면 직접 만들지 않아요"를 "바닥부터 새로 만들지 않아요"로 바꿨어요. 실제 에이전트가 변형을 어떻게 만드는지는 아직 확인하지 않았어요.

## 하네스 콘텐츠 0.5.0 — 2026-11-25

[GitHub Release harness-v0.5.0](https://github.com/ELI-team/ELI/releases/tag/harness-v0.5.0)에 공개했어요. 원본 커밋은 `14c09d9d1684b786a229c590957436198d9e5f2d`([#122](https://github.com/ELI-team/ELI/pull/122)), `harness.json`의 SHA-256은 `94dd82cc42b994c358a0e64f6a908b97055daa769c7a2a5fff86402e11dbeb5c`예요. 설치 도구는 0.5.0 그대로이고 npm 게시는 없어요. `npx eli-design@latest harness --agent claude`로 새 프로젝트에 설치해 스킬·훅의 새 기준과 `status`를 확인했어요.

### 변경

- 색을 단정하게 쓰게 했어요. 화면의 기본은 중립색이고 브랜드 색으로 채운 요소는 한 화면에 주요 버튼 하나예요. 눈에 띄는 색상은 브랜드 색 하나, 배경의 단계는 두 개까지예요. 보조 버튼은 중립색으로 낮춰요.
- 테두리는 필요한 곳에만 쓰게 했어요. 없으면 알 수 없게 되는 것이 있을 때 쓰고, 테두리와 그림자를 함께 쓰거나 테두리 안에 테두리를 넣지 않아요.
- 불필요한 면을 줄이게 했어요. 배경이 있는 면은 한 겹까지이고, 버튼만 감싼 면과 자식이 하나뿐인 면을 만들지 않아요. 채운 버튼은 주요 버튼 하나면 충분해요.
- 떠 있는 버튼을 남발하지 않게 했어요. 주요 버튼의 기본은 일반 버튼이고, 떠 있는 버튼은 모바일의 목록·피드 화면에서 새 항목을 만드는 행동 하나에만 써요. 비슷한 컴포넌트는 `when-to-use`와 `variants`를 읽고 비교해 골라요.
- 모바일 화면에서 큰 단계의 글자·간격 토큰을 쓰지 않게 했어요. 역할 토큰이 우선 기기에 맞는 단계를 가리키게 해요. ELI 토큰의 값은 바꾸지 않았어요.
- `/eli-verify`가 색 남용, 테두리 남용, 불필요한 면, 떠 있는 버튼, 모바일에서 큰 크기를 찾아요. 디자인 시스템 페이지도 같은 기준으로 만들어요.
- 스킬 문구의 변경이에요. 실제 에이전트가 만든 화면에서의 효과는 아직 확인하지 않았어요.

## eli-design 0.5.0 — 2026-11-24

2026-11-24에 npm `next`로 게시한 뒤 `latest`로 전환했어요. 원본 커밋은 `56fa0395f18a8791d73c3702dce52add2d2035f3`([#119](https://github.com/ELI-team/ELI/pull/119))이에요. npm의 integrity는 고정 파일과 같아요(SHA-256 `0a091aebacea80502e4b912e7c8db590fcb142e74cc6ad23966a7c4d9fd7efb8`). 공개 명령으로 새 프로젝트에 `harness --agent all`, `init`, `add button tab`, `status`를 확인했어요. 고정 범위와 생략한 검사는 [릴리스 기록](handbook/releases/0.5.0.md)에 있어요.

### 변경

- BREAKING CHANGE: 설치 설정과 기록을 프로젝트 루트에서 `.eli/` 폴더로 옮겼어요. `eli.json`은 `.eli/config.json`, `eli.lock.json`은 `.eli/lock.json`, `eli.harness.json`은 `.eli/harness.json`이에요. 옛 위치는 읽지 않아요. 기존 프로젝트는 있는 파일만 `mkdir .eli && mv eli.json .eli/config.json && mv eli.lock.json .eli/lock.json && mv eli.harness.json .eli/harness.json`으로 옮겨요. 공식 홍보 전 0.x의 MINOR예요.
- `init --dir .eli`는 거부해요. 이 폴더는 설치 기록 전용이에요.
- 하네스 설치 뒤 안내가 셋업의 세 질문을 질문 도구로 먼저 띄우라고 알려요.

## 하네스 콘텐츠 0.4.0 — 2026-11-24

[GitHub Release harness-v0.4.0](https://github.com/ELI-team/ELI/releases/tag/harness-v0.4.0)에 공개했어요. 원본 커밋은 `56fa0395f18a8791d73c3702dce52add2d2035f3`, `harness.json`의 SHA-256은 `0984318a957db5b0c1f544e5acd42e89dcb957e672d14f5b8285ec676367ae06`이에요. 설치 도구 0.5.0 이상과 함께 써요.

### 변경

- `/eli-setup`이 서비스 기획, 디자인 레퍼런스, 브랜드 컬러를 질문 도구로 반드시 물어요. Claude Code는 `AskUserQuestion`, Codex는 `request_user_input_async`를 쓰고(Plan 모드에서는 `request_user_input`), 도구가 없는 환경에서는 질문만 담은 메시지로 대신해요. 사용자가 직접 답하기 전에는 문서·토큰·페이지를 만들지 않아요.
- 브랜드 컬러는 사용자가 정한 색으로 만들어요. ELI에 없는 색이어도 돼요. 토큰 파일에 기준 색을 적고 상태별 색은 기준 색에서 계산하며, ELI의 브랜드 시맨틱 토큰이 그 색을 가리키게 해요.
- 세션 시작 훅과 스킬이 설치 기록을 `.eli/` 폴더에서 읽어요.
- 실제 Claude Code·Codex가 질문 도구를 띄우는지, 브랜드 컬러가 설치된 컴포넌트에 반영되는지는 확인하지 않았어요.

## eli-design 0.4.0 — 2026-11-24

2026-11-24에 npm `next`로 게시한 뒤 `latest`로 전환했어요. 원본 커밋은 `a9a3ae8c130de440e455638c20f76bfad78ee529`([#113](https://github.com/ELI-team/ELI/pull/113))이에요. npm의 tarball은 고정 파일과 SHA-256(`d8613f5ed2ec0fc62bda4e45ffc9b92c086b1d7e3aa6c089b3943375657db516`)이 같아요. 공개 명령 `npx eli-design@0.4.0 harness --agent claude`로 새 프로젝트에 하네스 0.3.0 설치, `.mcp.json` 등록, 재실행 재사용, `status`를 확인했어요. 고정 범위와 생략한 검사는 [릴리스 기록](handbook/releases/0.4.0.md)에 있어요.

### 변경

- `harness --agent claude`가 프로젝트의 `.mcp.json`에 문서 서버 `eli-docs`를 등록해요. 이미 있는 `eli-docs` 항목과 다른 서버는 바꾸지 않아요. Codex는 등록 명령을 안내해요. 새 기능이라 MINOR예요.
- 설치 뒤 안내가 새 세션을 열지 않고 같은 세션에서 `eli-setup`을 읽어 진행하라고 알려요. 도구가 보이지 않는 세션에서 쓰는 조회 스크립트의 경로도 함께 알려요.

## 하네스 콘텐츠 0.3.0 — 2026-11-24

[GitHub Release harness-v0.3.0](https://github.com/ELI-team/ELI/releases/tag/harness-v0.3.0)에 공개했어요. 원본 커밋은 `a9a3ae8c130de440e455638c20f76bfad78ee529`, `harness.json`의 SHA-256은 `779c59297d16e30f1712f65d2d4bac4e0b83765438de1e682961716f65a7e8e1`이에요. 조회 스크립트와 절차가 달라진 MINOR예요.

### 변경

- MCP 서버는 세션을 시작할 때만 불러와서 방금 등록한 세션에는 도구가 보이지 않아요. 조회 스크립트 `hooks/eli-docs.mjs`를 더해 같은 서버의 같은 도구를 같은 세션에서 읽어요. 스킬과 세션 시작 훅은 도구가 보이지 않아도 멈추거나 새 세션을 요구하지 않아요.
- `/eli-design-system`과 `/eli-setup`이 디자인 시스템 페이지를 데스크톱 폭 기준으로 만들어요. 본문을 휴대폰 폭으로 좁히지 않고 토큰·변형을 여러 열로 보여주며 좁은 화면에서는 접어요.
- 이전 버전의 하네스를 설치한 프로젝트를 다른 버전으로 덮어쓰는 명령은 아직 없어요. 실제 Claude Code·Codex에서의 전체 흐름은 확인하지 않았어요.

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
