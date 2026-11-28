# 검증 기준

## 기본 검사를 실행해요

고정한 Node.js·pnpm 환경에서 `pnpm install --frozen-lockfile`로 설치하고, 일상 브라우저 검증을 처음 실행하는 환경에서는 `pnpm exec playwright install chromium`으로 고정된 Playwright용 Chromium을 준비해요. 전체 브라우저 행렬은 `pnpm exec playwright install chromium firefox webkit`으로 엔진을 준비해요. 브라우저 바이너리는 개발 검사에만 사용하며 배포 패키지에는 포함하지 않아요. 검증은 변경 위험도에 맞춰 실행하고 실제로 실행한 범위만 기록해요.

공개 props·import 경로·상태 로직·이벤트·키보드·포커스·접근성, 공통 토큰, 빌드 설정, 의존성, SSR·클라이언트 경계, 패키징 결과처럼 여러 소비자에게 영향을 주는 핵심 변경에는 `pnpm check`를 실행해요. 이 명령은 타입 검사, 린트, Storybook 빌드, 브라우저 소비 검사, Next.js 소비 검사와 용량 측정을 순서대로 실행해요.

문서 문구, 주석, JSDoc, Storybook 설명이나 기존 토큰을 사용하는 고립된 CSS 선언처럼 공개 계약과 핵심 동작을 바꾸지 않는 수정에는 매번 `pnpm check`를 반복하지 않아도 돼요. 변경 diff와 적용 범위를 확인하고 필요한 최소 검증만 선택해요. 전체 검사를 생략했다면 PR에 변경 위험이 낮다고 판단한 근거와 실제 확인 범위를 적고, 실행하지 않은 검사를 통과했다고 표현하지 않아요.

문서만 바뀌었다면 링크·명령어·규칙의 일관성을 확인해요. 하지 않은 검사를 통과했다고 적지 않아요.

컴포넌트 사용 가이드 JSON을 추가·변경하면 [변환 절차](../handbook/component-guide-json.md)에 따라 스키마·원문 해시·공개 이름·선택값·조합 참조와 원문 의미를 확인해요. 템플릿·각 초안의 구조 검증, 사용자 검토, 실제 MCP 도구 연결·초안 필터링 검사는 서로 구분해요. 문서 틀 준비만으로 조회나 하네스 동작 검사가 완료됐다고 기록하지 않아요.

개발자가 보완한 사용 예시는 설명 대상 UI의 레지스트리에서 복원한 소스로 타입 검사하고 import·CSS 연결이 빌드되는지 확인해요. 예시 파일 위치와 상대 import 전제를 명시하며, 미병합 UI 후보를 설명하면 검증한 커밋·선행 PR을 기록해요. 공개된 버전에서 검증한 것으로 대신 표현하지 않아요. 예시만 바뀌고 UI가 같다면 해당 예시 검사만 실행하며 전체 UI 검사를 반복하지 않아요. 타입 검사·빌드 통과와 실제 브라우저 조작·사용자 승인은 구분해요.

## 문서 웹페이지를 확인해요

`apps/docs/frontend`의 실제 페이지, Next.js 라우트, 의존성, Server·Client Component 경계나 빌드 설정을 바꾸면 `pnpm build:docs`로 프로덕션 빌드를 확인해요. 개발 서버에서만 보이는 결과로 완료하지 않아요. 빌드 결과에서 각 경로가 정적 사전 렌더링인지 요청 시점 동적 렌더링인지 확인하고 의도와 다르면 원인을 검토해요.

프로덕션 서버의 첫 HTML에 제목, 본문과 주요 탐색 콘텐츠가 포함되는지 확인해요. 브라우저 JavaScript를 비활성화해도 핵심 문서를 읽고 링크로 이동할 수 있어야 해요. Client Component가 있다면 hydration 이후에도 같은 콘텐츠와 구조가 유지되고 콘솔에 hydration 오류가 없는지 확인해요.

사용자 동작이 있는 페이지는 실제 브라우저에서 키보드와 터치로 확인해요. 링크 이동, 검색, 코드 복사, Sidebar 열기·닫기처럼 변경한 핵심 흐름을 확인하고, 반응형 UI를 바꾸면 모바일과 데스크탑 너비를 함께 확인해요. 접근성 자동 검사를 추가하기 전까지 수행한 수동 범위를 PR에 정확히 기록해요.

폴더 구조와 지침만 바꾸고 실행 코드가 달라지지 않았다면 문서 링크, 의존 방향, 빈 폴더의 역할과 `git diff --check`를 확인해요. 이 경우 `pnpm build:docs`나 패키지 용량 검사를 실행하지 않아도 돼요. 페이지 구성과 코드 배치 기준은 [문서 프론트엔드 지침](docs-frontend.md)을 따라요.

## 소비자 입장에서 확인해요

`pnpm test:packaging`은 실제 tarball의 크기·파일 목록·공개 경로를 확인해요. 비공개 소비 앱에 tarball을 설치하고, `package.json`에 공개된 모든 컴포넌트가 별도 CSS import 없이 Vite에서 CSS와 토큰을 연결하는지 확인해요. 새 공개 경로를 추가할 때는 소비·SSR·CSS 검증 대상에도 함께 추가해요.

같은 tarball을 SSR용으로 번들하고 모든 공개 컴포넌트를 `react-dom/server`로 렌더링해 브라우저 전역 없이 초기 HTML을 만들 수 있는지 확인해요. Hook이나 사용자 이벤트가 있는 컴포넌트는 배포 JS 첫 줄에 `'use client'`가 유지되는지도 확인해요. 이 검증은 공통 SSR 안전성을 확인하며 Next.js·Remix 같은 프레임워크별 통합 테스트를 대신하지 않아요.

`pnpm test:next`는 실제 tarball을 Next.js 16.4.6 App Router 소비 앱에 풀어 프로덕션 빌드를 실행해요. Server Component에서 ELI의 정적·클라이언트 컴포넌트를 그룹 경로로 직접 가져오고, 별도 Client Component에서는 이벤트와 상태를 연결해 클라이언트 경계를 확인해요. 빌드된 CSS와 서버 HTML뿐 아니라 Chromium에서 hydration 이후 Button·Select 상호작용과 콘솔 오류도 확인해요. Next.js나 React 버전을 바꿀 때는 소비 앱의 고정 버전도 함께 갱신하고 결과를 기록해요.

Vite 검증용 소비 앱은 저장소의 개발용 React·React DOM·Vite를 사용해요. React 버전별 독립 설치나 `test:next`가 맡는 Next.js의 RSC·hydration 검증을 대신하지 않아요. 테스트·Storybook이 실제 tarball에 들어가면 실패해요.

`pnpm dev`로 Storybook을 열어 모든 공개 컴포넌트의 디자인 조합·상태와 `직접 바꿔보기`의 Controls 반영을 확인해요. Story 구성과 확인 방법은 [컴포넌트 구현 규칙](components.md#storybook을-함께-확인해요)을 따라요.

`pnpm test:browser`는 `test:packaging`이 만든 실제 tarball 소비 앱을 Chromium에서 열어요. Checkbox·Toggle·Select·SegmentControl·TextField·TextArea·Tab의 클릭·입력·선택·키보드·포커스, 브라우저 콘솔 오류, axe의 자동 접근성 위반을 확인해요. Modal의 닫기·재열기·포커스 순환과 복귀·배경 잠금과 복원도 검사해요. 외부 Button 클래스의 Default·Hover·Pressed·Disabled 계산 스타일도 읽어 ELI 기본 스타일보다 우선하는지 검증해요. Tooltip 트리거처럼 명세가 확정되지 않은 동작, VoiceOver 수동 검토와 모든 컴포넌트의 전체 키보드 조합을 대신하지 않아요.

## 선택 설치 데이터를 확인해요

UI 소스·공개 exports·레지스트리 규격·생성기를 바꾸면 `pnpm test:registry`를 실행해요. 일반 `pnpm check`의 tarball 검사와 대상이 다르며 관련 PR의 별도 레지스트리 CI에서도 확인해요. 전체 npm 설치 검사는 그대로 유지해요.

- `pnpm build:registry`로 생성하고 목록·상세 JSON Schema, 파일과 항목의 SHA-256, 릴리스 버전, 실제 참조 경로를 확인해요.
- Button만 선택했을 때 형제 컴포넌트·Modal·하네스가 없고 조합 컴포넌트에는 필요한 하위 컴포넌트가 있는지 확인해요.
- catalog에서 설치 ID를 지정하면 목록·진입 파일·상대 import·MCP 조회·사용 예시가 같은 ID를 사용하는지 확인해요. 여러 역할을 variant로 합치면 필요한 내부 파일은 포함하되 기존 역할을 별도 공개 항목으로 중복 제공하지 않아요.
- 파일 소유권과 공통 토큰 중복, 누락 파일·미선언 외부 의존성·개발 파일·잘못된 경로를 검사해요.
- 생성 JSON만 복원한 소비 앱에서 모든 공개 컴포넌트의 타입·Vite 빌드·CSS 연결을 확인해요. 대표 Next.js 앱에서는 빌드·SSR·hydration·Button/Select 상호작용을 확인해요. 소비 앱에 `@eli-design/ui`를 설치하지 않아요.
- UI 레지스트리 검사는 하네스 종류 예약과 자동 포함 방지만 확인해요. 별도 하네스 설치는 아래 CLI 검사와 구분해요.

배포 JSON의 규격과 릴리스 절차는 [레지스트리 지침](registry.md)에서 관리해요. 생성물의 크기는 같은 작업 폴더의 소스 기준으로 측정하고 npm tarball 크기와 구분해요.

설치 도구를 바꾸면 `pnpm test:cli`로 실제 tarball 설치·다운로드·파일 쓰기·설정·기록·해시·경로·충돌 보호·구조화된 결과를 확인해요. `pnpm test:cli:consumer`는 실제 CLI로 소스를 추가한 뒤 전체 공개 컴포넌트의 타입·Vite·CSS와 대표 Next.js SSR·hydration을 검사해요. 레지스트리 CI에 두 명령을 연결해요. 별도 `pnpm test:cli:package-managers`는 같은 CLI 후보를 여섯 소비 환경의 임시 실행 도구로 호출해 앱 의존성·lockfile 보존과 소스 소비를 검사해요. [CLI 실행 행렬](package-managers.md#cli-실행-행렬도-구분해요)의 로컬 tarball 결과와 실제 게시 후 공개 명령 확인을 구분해요. 기존 UI tarball 행렬이 CLI까지 검증한 것은 아니에요.

최종 CLI tarball 자체를 검사할 때는 재빌드하는 위 명령 대신, 격리 설치한 bin의 절대 경로를 `ELI_CLI_BINARY`에 지정해 `node tests/registry/consumer.mjs --cli`를 실행해요. 공개 콘텐츠를 받을 때는 `ELI_REGISTRY_URL`도 지정해 같은 로컬 스냅샷과 대조해요. 게시 순서와 npm 담당자에게 전달할 고정 파일은 [릴리스 절차](../handbook/releasing.md#npm-게시만-위임할-수-있게-준비해요)에서 관리해요.

`pnpm test:cli`에는 실제 tarball의 하네스 선택 설치 검사도 포함해요. React·UI 없이 설치, 에이전트 선택, 기존 훅·설정 보존, 중복 등록 방지, dry-run, 수정·누락·해시·경로·다른 버전 거부와 다중 설정 실패 복구를 확인해요. 소스 UI 설치 후 실제로 복사한 훅을 실행해 로컬 기록을 인식하는지도 확인해요. 여섯 실행 행렬에서도 하네스 설치·재사용·상태를 확인하고 앱의 package.json·lockfile이 바뀌지 않아야 해요.

문서 앱의 생성 스크립트·조회 계층·MCP 도구를 바꾸면 `pnpm test:docs`를 실행해요. 컴포넌트 JSDoc의 `###` 제목이나 `{이름}Props` 타입 구조를 바꿀 때도 실행해요. 생성 데이터가 그 형태에 의존해요. 이 검사는 조회 함수까지만 확인하고 MCP 전송과 실제 에이전트 연결은 확인하지 않아요.

`pnpm test:harness`는 훅과 스킬·초안의 형식을 확인해요. Claude Code·Codex가 스킬을 실제로 따르는지, Codex의 사용자 신뢰, 원격 MCP의 문서 조회는 자동 파일 설치 검사로 대체하지 않아요. 하네스 콘텐츠와 업데이트 범위의 기준은 [하네스 구조](harness.md)를 따라요.

컴포넌트 가이드를 실제로 활용하는지 담당자와 확인할 때는 [실제 에이전트 실행 체크리스트](../handbook/harness-guide-acceptance.md)를 사용해요. 공개 MCP 조회 사전 확인과 실제 세션의 선택·설치·기능 연결 결과를 구분해 기록해요.

- 개별·다중 선택은 필요한 항목만 받고 전체 소스 추가는 명시적인 선택일 때만 수행하는지 확인해요. 전체 소스에도 하네스가 자동으로 포함되지 않아야 해요.
- 같은 파일의 중복 추가, 사용자 수정 파일 덮어쓰기, 다른 릴리스의 공유 파일 혼합을 막는지 확인해요.
- 설치 기록의 소비 방식·버전·항목·파일 경로·해시가 실제 파일과 일치하고, 그 경로로 만든 import가 CSS·타입·SSR까지 연결되는지 확인해요.
- 하네스에 전달할 설치 상태를 소스 설치와 npm 패키지 설치 각각에서 확인해요. MCP·하네스 자체의 동작 검사는 담당자와 별도로 연결해요.
- 실제 다운로드 요청에서 전체 UI 패키지·저장소나 요청과 무관한 항목을 먼저 받지 않는지 확인해요. 토큰·공유 파일은 한 번만 추가해야 해요.
- 비대화형 실행·구조화된 결과·변경 미리보기·오류와 종료 코드가 [설치 도구 계약](registry.md#하네스가-설치-도구를-호출해요)을 지키는지 확인해요. 입력 누락이나 충돌로 중단했을 때 성공으로 보고하거나 설치 기록만 완료로 남기면 안 돼요.
- 기존 타입·Vite·Next.js 소비 검사와 별도로 실제 설치 도구를 실행한 결과를 검증해요. 지원 패키지 매니저별 실행 경로·외부 의존성 설치·기존 lockfile 보존도 함께 확인해요.

공개 타입을 보완할 때는 허용해야 하는 사용법뿐 아니라 실제로 렌더링할 수 없는 HTML 속성도 소비 앱의 TypeScript에서 거부되는지 확인해요. 입력 참조는 대상 요소·교체·제거 시 정리를 검사하고, 숫자 입력은 표시·네이티브 값·콜백을 대조해요. 동적 목록은 항목 삭제·빈 목록·제어 값 유지와 비활성 항목의 키보드·포인터 처리를 함께 확인해요. 같은 회귀 시나리오를 tarball과 선택 설치 소스 양쪽에 적용해요.

## 브라우저와 모바일 환경을 구분해 확인해요

데스크톱 지원 목표는 최신 안정 Chrome·Edge·Safari와 Firefox예요. GitHub Actions의 브라우저 행렬은 실제 Chrome·Edge 채널과 Playwright가 고정한 Chromium·Firefox·WebKit에서 같은 tarball 소비 검사를 실행해요. `pnpm test:browsers`는 로컬에서 Chromium·Firefox·WebKit과 Android Chromium·iOS WebKit 기기 조건을 순서대로 확인하고, 일상 `pnpm check`는 실행 비용을 고려해 Chromium 대표 검사만 실행해요.

Android와 iOS 자동 검사는 Playwright의 Pixel·iPhone 기기 설정으로 화면 크기, 사용자 에이전트, 터치 입력을 재현해요. 이 결과는 실제 Android Chrome, iOS Safari나 운영체제 WebView를 실행한 것이 아니므로 실기기 통과로 기록하지 않아요. 릴리스 전에는 최소한 최신 안정 macOS Safari, iOS Safari와 Android Chrome에서 대표 소비 화면의 터치·입력·스크롤·가상 키보드·화면 회전과 콘솔 오류를 수동 확인해요. 실제 기기나 기기 클라우드를 사용할 수 없다면 미검증 범위로 남기고 지원 완료라고 표현하지 않아요.

키보드·Hover·Pressed 계산 스타일은 데스크톱 대상에서 확인하고, 모바일 대상에서는 탭·터치로 같은 작업을 완료할 수 있는지 확인해요. axe 색상 대비 기준선은 엔진별 계산 차이로 중복된 기준선을 만들지 않도록 Chromium 대표 환경에서만 추적하고, 색상 대비를 제외한 자동 접근성 규칙과 브라우저 콘솔 오류는 모든 자동 대상에서 확인해요.

axe 색상 대비 검사는 디자이너와 함께 수정할 기존 14개 대상을 기준선으로 따로 고정해요. 기준선보다 늘거나 줄면 테스트를 실패시키고 [컴포넌트 감사 보고서](../handbook/audits/2026-11-component-audit.md#자동-접근성-기준선)를 갱신할지 확인해요. 색상 값을 임의로 바꾸지 않으며, 색상 대비를 제외한 axe 규칙은 예외 없이 통과해야 해요.

`pnpm test:packaging`은 외부 `className`이 루트 요소에 전달되고 상태별 CSS가 최종 번들에 포함되는지 확인하고, 실제 계산 스타일은 `test:browser`가 맡아요. Storybook에 스타일 도구별 전용 Story를 추가하지 않아요. 현재 `pnpm check`는 소스 단위의 `.test.tsx`를 실행하지 않으며, 실제 tarball 소비 관점의 통합 검사를 우선해요. `apps/storybook`의 설정 파일은 통합 타입 검사에 포함해요.

## 상호작용 성능을 별도로 확인해요

`pnpm size`가 측정하는 패키지 다운로드 용량과 브라우저에서 클릭·입력·선택할 때의 반응성은 서로 다른 지표예요. 패키지가 작다는 이유만으로 상호작용이 빠르다고 판단하지 않아요. 컴포넌트 구현 원칙은 [컴포넌트 구현 규칙](components.md#빠른-동작을-기본값으로-제공해요)을 따라요.

초기 대표 시나리오는 옵션 250개가 있는 Select를 열고 방향키로 이동한 뒤 선택하는 동작과 Checkbox 100개를 한 번에 선택하거나 해제하는 동작이에요. 실제 사용 범위가 달라지면 디자이너와 합의한 최대 규모를 시나리오에 반영해요.

`pnpm test:performance`는 실제 tarball의 프로덕션 Vite 빌드를 Chromium에서 열고 Select 125개·250개와 Checkbox 100개 시나리오를 측정해 `.artifacts/performance/baseline.json`에 기록해요. 이 파일은 기기별 측정 결과라 Git에 올리지 않고, 비교가 필요한 PR에 환경과 중앙값을 직접 적어요.

아래 지표를 각각 기록해요.

- 전체 처리 시간: 한 동작으로 메인 스레드가 작업한 총시간
- 최장 멈춤 시간: 사용자 입력에 응답하지 못한 가장 긴 연속 구간
- 확장 비율: 같은 동작에서 항목 125개 대비 250개가 걸린 시간의 비율

성능 결과는 프로덕션 빌드에서 같은 Chromium 버전과 4배 CPU 제한을 사용해 세 번 측정한 중앙값으로 비교해요. 전체 처리 시간은 브라우저의 메인 스레드 작업 시간으로, 최장 멈춤 시간은 Long Animation Frames처럼 긴 작업 구간을 확인할 수 있는 브라우저 측정값으로 기록해요. 측정 환경과 브라우저 버전도 결과와 함께 남겨요.

[Design Systems Should Be Fast by Default](https://denodell.com/blog/design-systems-should-be-fast-by-default)에서 제안한 전체 300ms 이하, 최장 멈춤 100ms 이하, 확장 비율 2.5 미만은 초기 참고값으로만 사용해요. ELI의 기준선과 실행 환경이 안정되기 전에는 이 수치로 PR을 실패시키지 않아요. 자동 측정 도입 상태는 [개선 제안](../handbook/improvements.md#배포-안정성-검사를-보완해요)에서 관리하고, 기준선을 수집한다는 이유로 일반 `pnpm check`의 필수 실패 조건이라고 표현하지 않아요.

## 실제 배포 전 검증을 완성해요

매 npm 릴리스 전에는 저장소 안에서 빌드되는지만 확인하지 않고, 생성한 tarball을 사용자가 쓰는 조건에 가까운 환경에서 확인해야 해요. `0.x` 배포와 공식 홍보용 `1.0.0`에도 같은 원칙을 적용해요. npm 게시 완료와 검증 완료는 별개예요. 아직 자동화하지 않은 검사는 통과한 것으로 기록하지 않고 [개선 제안](../handbook/improvements.md#배포-안정성-검사를-보완해요)에서 도입 상태를 관리해요.

아래 검사는 자동화하거나 같은 범위를 수동으로 확인한 근거를 릴리스 PR에 남긴 뒤 배포해요.

- 저장소의 상위 `node_modules`를 참조할 수 없는 임시 경로에서 tarball을 설치해요.
- 소비 앱이 React와 React DOM을 직접 선언하고, `--legacy-peer-deps` 없이 지원하는 peer dependency 조합을 설치해요.
- 같은 tarball을 npm·pnpm·Yarn·Bun으로 각각 설치하고 타입 검사와 소비 빌드를 실행해요. Yarn은 Classic·Modern `node-modules`·Modern PnP를 분리해요. 전체 행렬과 설치 원칙은 [패키지 매니저 지원](package-managers.md)을 따라요. 하나라도 실패하면 초기 배포 준비가 끝난 것으로 보지 않아요.
- Vite 소비 빌드와 `pnpm test:next`의 Next.js App Router 빌드·서버 렌더링·클라이언트 경계·브라우저 hydration을 확인해요.
- `pnpm test:browsers`와 브라우저 호환성 CI로 대표 컴포넌트의 클릭·입력·선택·키보드·포커스 이동, 터치와 외부 클래스 계산 스타일을 확인해요.
- 실제 macOS Safari, iOS Safari와 Android Chrome에서 대표 흐름을 수동 확인하고 기기·OS·브라우저 버전을 기록해요.
- 화면 낭독기가 읽는 설명·역할·상태와 키보드 조작을 확인하고, 주요 Story의 모바일·데스크탑 화면 차이를 검토해요.

저장소 개발과 lockfile 관리는 pnpm만 사용해요. 소비자 패키지 매니저 검증의 버전·격리 방식·lockfile 규칙은 [패키지 매니저 지원](package-managers.md)에서 관리하고, README에 안내한 범위와 자동 행렬을 함께 갱신해요.

`pnpm test:package-managers`는 한 번 만든 tarball을 npm·pnpm·Yarn Classic·Yarn Modern의 `node-modules`·strict PnP·Bun 소비 앱에 설치해 타입 검사와 Vite 빌드를 실행해요. 네트워크 설치와 여섯 환경 준비 비용이 크므로 일반 `pnpm check`에는 중복해서 넣지 않고, 관련 파일이 바뀌는 PR의 GitHub Actions 행렬과 릴리스 준비에서 필수로 확인해요.

Node.js·React·브라우저 지원 범위를 늘릴 때는 새 조합을 검증 대상에 추가해요. 모든 조합을 임의로 약속하지 않고 README와 peer dependency에 명시한 범위만 지원해요.

## 다운로드 용량을 반드시 확인해요

배포 코드·CSS·의존성·빌드 설정이 바뀌면 `pnpm size`를 실행해요. 최신 빌드에 대해 `npm pack --dry-run --json`으로 측정해요.

- 압축 패키지 크기: 사용자가 받는 `@eli-design/ui` tarball 자체의 크기예요.
- 압축 해제 크기: 이 패키지 파일의 합계예요. 파일 시스템이나 전체 node_modules 크기는 아니에요.
- 포함 파일 수: 개발 파일이 섞이지 않았는지 확인해요.

결과는 `.artifacts/package-size.json`과 `.artifacts/package-size.txt`에 저장해요. 이 파일은 Git에서 제외하므로 PR에 수치를 직접 기록해요. 용량 측정 실패는 검증 실패예요.

```text
패키지: @eli-design/ui@버전
압축 크기: 실제 측정값 B
압축 해제 크기: 실제 측정값 B
포함 파일: 실제 측정값 개
실행 의존성 변경: 없음 또는 변경 이유
버전 변경 유형: 없음 / patch / minor / major
```

React·추가 의존성까지 합친 다운로드 크기나 브라우저 번들 크기로 표현하지 않아요. 최초 빈 패키지 크기를 완성된 라이브러리 크기로 안내하지 않아요. 임의의 상한은 두지 않고 증가 이유를 검토해요. 이전 릴리스 자동 비교와 Storybook 용량 표시는 후속 작업이에요.

현재 내부 UI 빌드 형식을 확인할 때는 `pnpm test:packaging`으로 원본 UI tarball을 검사해요. 종료 예정인 전체 UI의 검사를 CLI 릴리스 검사로 대신하지 않고, CLI 릴리스는 위 설치 도구·소스 소비·최종 파일 기준을 따라요. 게시 후에는 npm의 게시 버전·배포 태그·integrity와 실제 설치 결과를 확인하고 릴리스 기록에 남겨요. 저장소에는 npm 게시 자동화가 없으며, Storybook 배포만으로 npm에 게시되지 않아요.

기존 검사 명령은 자체 tarball을 만들어요. 실제 게시할 최종 파일을 고정한 뒤 수행하는 설치·무결성 확인은 별도 릴리스 검증이며, 앞의 검사 결과만으로 대신하지 않아요. 최종 후보와 실행 기록·배포 후 확인 순서는 [릴리스 절차](../handbook/releasing.md)를 따라요.

## 소스 설치의 전체 다운로드량을 확인해요

`pnpm size`는 UI tarball만 측정하고, `pnpm test:registry`는 생성 데이터와 복원한 소스의 소비를 확인해요. 설치 흐름의 측정은 별도 `pnpm size:cli`에서 확인해요. 이 명령은 작업 폴더에서 만든 CLI 후보를 격리된 로컬 npm·UI·하네스 HTTP 레지스트리에서 실제 npm exec로 실행하고 도구·실행 의존성 tarball·npm 메타데이터·선택한 UI·하네스 JSON의 응답 본문 바이트를 합산해요.

`size:cli`의 identity와 gzip level 9는 비교를 위한 서버 조건이에요. 공개 npm·GitHub CDN의 실제 전송량이나 상·하한으로 안내하지 않아요. 도구 tarball 해시·콘텐츠 버전·의존성 무결성·메타데이터 스냅샷·실행 환경·범주별 바이트·요청 로그를 `.artifacts/cli-download-size/report.json`에 기록하고 요약은 `report.md`에 남겨요. 원본 소스 파일의 크기는 별도 필드로 기록하며 JSON 본문에 중복 합산하지 않아요.

하네스 단독과 Button·하네스 조합도 같은 조건으로 측정하고 하네스 JSON 전송량을 UI와 별도 범주로 기록해요. 하네스만 선택한 경우 UI 요청이 없고, UI만 선택한 경우 하네스 요청이 없어야 해요. 하네스 단독 앱에는 React를 준비하지 않아요.

각 콜드는 빈 npm 캐시와 새 소비 앱에서 init과 추가 명령을 실행해요. 재실행은 같은 앱·캐시에서 추가 명령만 반복해요. React는 이미 설치된 조건이라 새 앱 의존성 다운로드는 0이에요. 준비용 의존성 다운로드는 측정 실행에 다시 더하지 않아요. 실행 의존성에 전이·선택 의존성이 생기면 누락이 없도록 측정 그래프를 보완하고, 현재 지원하지 않는 그래프를 통과로 표시하지 않아요.

최초 다운로드 총량은 **설치 도구와 그 npm 의존성 + 목록·선택 항목·의존 항목 JSON + 소비 앱에 새로 필요한 npm 의존성**으로 확인해요. 파일 내용이 JSON 안에 있으면 그 소스 크기를 전송량에 다시 더하지 않아요. 네트워크 전송량·압축 해제 후 파일 크기·브라우저 번들 크기는 별도로 기록해요.

- Button 하나, 조합 컴포넌트, 여러 컴포넌트 연속 추가, 전체 소스 추가를 같은 도구·콘텐츠 버전에서 비교해요.
- 캐시가 비어 있는 최초 실행과 캐시를 재사용하는 실행을 분리해요. 이미 설치되어 만족하는 React 등은 재설치하지 않고 새로 받은 의존성 범위를 적어요.
- 선택한 항목·공유 파일·각 다운로드 범주·측정 환경을 기록해요. UI 파일만 작다는 이유로 설치 경험 전체가 가볍다고 판단하지 않아요.
- 실행 도구가 UI 전체나 하네스를 포함하지 않는지 확인해요. 소스 선택 배포가 다른 방식보다 항상 작다고 단정하지 않고 같은 조건의 실측 결과를 사용해요.

HTTP 헤더·TLS·TCP, Node.js·npm 자체 설치, 공개 npm 이름·태그 조회 차이, GitHub Release 탐색·리디렉션과 다른 패키지 매니저의 캐시 정책은 별도 범위예요. 게시 후 공개 명령의 전송량을 다시 확인하기 전에는 전체 사용자의 최초 다운로드량으로 일반화하지 않아요. 근거 없이 용량 상한이나 CI 통과 기준을 만들지 않아요.

## 문서 앱 배포를 확인해요

문서 앱과 원격 MCP는 Storybook과 다른 Worker `eli`로 배포해요. 설정은 `apps/docs/wrangler.jsonc`에 있어요. 저장소 루트의 `wrangler.jsonc`는 Storybook용이므로 루트에서 `wrangler deploy`를 실행하면 Storybook 설정을 읽어요. 문서 앱은 반드시 `apps/docs`에서 배포해요.

Cloudflare Workers Builds의 설정은 아래와 같아요. 루트 디렉터리는 저장소 루트로 두고 일반 변수 `PNPM_VERSION=12.8.1`을 추가해요.

| 항목 | 값 |
| --- | --- |
| Build command | `pnpm --filter @eli/docs build:worker` |
| Deploy command | `cd apps/docs && npx wrangler deploy` |
| Non-production branch deploy command | `cd apps/docs && npx wrangler versions upload` |

배포 전에는 `pnpm --filter @eli/docs preview`로 로컬 Workers 런타임에서 띄워 `/mcp`에 `tools/list`와 도구 호출을 보내 확인해요. `next start`의 결과만으로 Workers에서 동작한다고 판단하지 않아요. 두 런타임은 허용하는 코드가 달라요. 배포한 뒤에는 `https://eli-design.dev/mcp`의 실제 응답을 확인하고, 그 뒤에 주소를 안내하는 하네스를 릴리스해요.

## Storybook 배포를 확인해요

Cloudflare Workers Builds는 연결된 Git 저장소의 `main` 푸시마다 Storybook을 빌드하고 `wrangler.jsonc`에 지정된 정적 파일을 기존 Worker `eli-lds-storybook`에 배포해요. 작업 브랜치의 빌드를 막으려면 Cloudflare의 Preview Builds를 꺼요. 프로젝트 규칙대로 PR을 병합하면 `main`에 푸시되지만, `main`에 직접 푸시해도 빌드가 실행돼요.

Cloudflare 대시보드에서 **Workers & Pages → eli-lds-storybook → Settings → Build**를 열어 Git 저장소가 `ELI-team/ELI`, 프로덕션 브랜치가 `main`, 루트 디렉터리가 저장소 루트인지 확인해요. **Build command**는 `pnpm build:storybook`, **Deploy command**는 `npx wrangler deploy`로 지정하고 **Enable Preview Builds**를 꺼요. **Build Variables and Secrets**에 일반 변수 `PNPM_VERSION=12.8.1`을 추가해요. Node.js는 저장소 루트의 `.node-version`을 따라요. GitHub Actions 비밀 값은 필요 없어요.

저장소 이전 후에는 Cloudflare의 연결 저장소와 GitHub App 권한도 새 조직을 기준으로 확인해요. 공개 도메인의 기존 화면이 열린다는 사실만으로 새 저장소의 자동 배포 연결까지 완료됐다고 판단하지 않아요.

설정을 마친 뒤 PR을 `main`에 병합해 Cloudflare **Deployments**에서 빌드 성공과 `https://storybook.eli-design.dev`의 실제 Storybook 화면을 확인해요. 실패한 빌드는 설정을 수정한 후 **Retry**로 다시 실행할 수 있어요. 이 설정은 npm 패키지를 게시하지 않아요.
