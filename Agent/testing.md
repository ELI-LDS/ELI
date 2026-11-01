# 검증 기준

## 기본 검사를 실행해요

고정한 Node.js·pnpm 환경에서 `pnpm install --frozen-lockfile`로 설치해요. 검증은 변경 위험도에 맞춰 실행하고 실제로 실행한 범위만 기록해요.

공개 props·import 경로·상태 로직·이벤트·키보드·포커스·접근성, 공통 토큰, 빌드 설정, 의존성, SSR·클라이언트 경계, 패키징 결과처럼 여러 소비자에게 영향을 주는 핵심 변경에는 `pnpm check`를 실행해요. 이 명령은 타입 검사, 린트, Storybook 빌드, 패키징 검사, Next.js 소비 검사와 용량 측정을 순서대로 실행해요.

문서 문구, 주석, JSDoc, Storybook 설명이나 기존 토큰을 사용하는 고립된 CSS 선언처럼 공개 계약과 핵심 동작을 바꾸지 않는 수정에는 매번 `pnpm check`를 반복하지 않아도 돼요. 변경 diff와 적용 범위를 확인하고 필요한 최소 검증만 선택해요. 전체 검사를 생략했다면 PR에 변경 위험이 낮다고 판단한 근거와 실제 확인 범위를 적고, 실행하지 않은 검사를 통과했다고 표현하지 않아요.

문서만 바뀌었다면 링크·명령어·규칙의 일관성을 확인해요. 하지 않은 검사를 통과했다고 적지 않아요.

## 소비자 입장에서 확인해요

`pnpm test:packaging`은 실제 tarball의 크기·파일 목록·공개 경로를 확인해요. 비공개 소비 앱에 tarball을 설치하고, `package.json`에 공개된 모든 컴포넌트가 별도 CSS import 없이 Vite에서 CSS와 토큰을 연결하는지 확인해요. 새 공개 경로를 추가할 때는 소비·SSR·CSS 검증 대상에도 함께 추가해요.

같은 tarball을 SSR용으로 번들하고 모든 공개 컴포넌트를 `react-dom/server`로 렌더링해 브라우저 전역 없이 초기 HTML을 만들 수 있는지 확인해요. Hook이나 사용자 이벤트가 있는 컴포넌트는 배포 JS 첫 줄에 `'use client'`가 유지되는지도 확인해요. 이 검증은 공통 SSR 안전성을 확인하며 Next.js·Remix 같은 프레임워크별 통합 테스트를 대신하지 않아요.

`pnpm test:next`는 실제 tarball을 Next.js 16.4.3 App Router 소비 앱에 풀어 프로덕션 빌드를 실행해요. Server Component에서 ELI의 정적·클라이언트 컴포넌트를 그룹 경로로 직접 가져오고, 별도 Client Component에서는 이벤트와 상태를 연결해 클라이언트 경계를 확인해요. 빌드된 CSS에 ELI 컴포넌트와 토큰이 자동 포함되는지, 프로덕션 서버 HTML에 서버·클라이언트 컴포넌트의 초기 내용이 렌더링되는지도 확인해요.

이 검사는 실제 브라우저에서 React가 hydration을 마친 뒤 이벤트가 작동하는지까지 확인하지 않아요. 브라우저 hydration·콘솔 오류·상호작용은 후속 브라우저 자동 검사에서 검증해요. Next.js나 React 버전을 바꿀 때는 `test:next` 소비 앱의 고정 버전도 함께 갱신하고 결과를 기록해요.

검증용 소비 앱은 저장소의 개발용 React·React DOM·Vite를 사용해요. React 버전별 독립 설치나 프레임워크별 라우팅·RSC·hydration 검증을 대신하지 않아요. 테스트·Storybook이 실제 tarball에 들어가면 실패해요.

`pnpm dev`로 Storybook을 열어 모든 공개 컴포넌트의 디자인 조합·상태와 `직접 바꿔보기`의 Controls 반영을 확인해요. Story 구성과 확인 방법은 [컴포넌트 구현 규칙](components.md#storybook을-함께-확인해요)을 따라요. 상호작용·키보드·접근성 자동 검사는 아직 없어요.

`pnpm test:packaging`은 외부 `className`이 루트 요소에 전달되고 소비 앱의 기본·Hover·Pressed·Disabled CSS가 최종 번들에 포함되는지 확인해요. 현재 검사는 브라우저의 계산된 스타일을 읽지 않으므로 실제 우선순위까지 자동으로 보장한다고 표현하지 않아요. Storybook에 스타일 도구별 전용 Story를 추가하지 않아요.

현재 `pnpm check`는 컴포넌트 단위 테스트를 실행하지 않아요. 실제 컴포넌트와 `.test.tsx`를 추가할 때 테스트 실행 도구와 명령도 함께 구성해요. `.storybook`의 설정 파일은 통합 타입 검사에 포함해요.

## 상호작용 성능을 별도로 확인해요

`pnpm size`가 측정하는 패키지 다운로드 용량과 브라우저에서 클릭·입력·선택할 때의 반응성은 서로 다른 지표예요. 패키지가 작다는 이유만으로 상호작용이 빠르다고 판단하지 않아요. 컴포넌트 구현 원칙은 [컴포넌트 구현 규칙](components.md#빠른-동작을-기본값으로-제공해요)을 따라요.

초기 대표 시나리오는 옵션 250개가 있는 Select를 열고 방향키로 이동한 뒤 선택하는 동작과 Checkbox 100개를 한 번에 선택하거나 해제하는 동작이에요. 실제 사용 범위가 달라지면 디자이너와 합의한 최대 규모를 시나리오에 반영해요.

아래 지표를 각각 기록해요.

- 전체 처리 시간: 한 동작으로 메인 스레드가 작업한 총시간
- 최장 멈춤 시간: 사용자 입력에 응답하지 못한 가장 긴 연속 구간
- 확장 비율: 같은 동작에서 항목 125개 대비 250개가 걸린 시간의 비율

성능 결과는 프로덕션 빌드에서 같은 Chromium 버전과 4배 CPU 제한을 사용해 세 번 측정한 중앙값으로 비교해요. 전체 처리 시간은 브라우저의 메인 스레드 작업 시간으로, 최장 멈춤 시간은 Long Animation Frames처럼 긴 작업 구간을 확인할 수 있는 브라우저 측정값으로 기록해요. 측정 환경과 브라우저 버전도 결과와 함께 남겨요.

[Design Systems Should Be Fast by Default](https://denodell.com/blog/design-systems-should-be-fast-by-default)에서 제안한 전체 300ms 이하, 최장 멈춤 100ms 이하, 확장 비율 2.5 미만은 초기 참고값으로만 사용해요. ELI의 기준선과 실행 환경이 안정되기 전에는 이 수치로 PR을 실패시키지 않아요. 자동 측정 도입 상태는 [개선 제안](../handbook/improvements.md#배포-안정성-검사를-보완해요)에서 관리하고, 구현 전 결과를 `pnpm check`가 검증한다고 표현하지 않아요.

## 실제 배포 전 검증을 완성해요

실제 npm 배포 전에는 저장소 안에서 빌드되는지만 확인하지 않고, 생성한 tarball을 사용자가 쓰는 조건에 가까운 환경에서 확인해야 해요. 아직 자동화하지 않은 검사는 통과한 것으로 기록하지 않고 [개선 제안](../handbook/improvements.md#배포-안정성-검사를-보완해요)에서 도입 상태를 관리해요.

아래 검사는 자동화하거나 같은 범위를 수동으로 확인한 근거를 릴리스 PR에 남긴 뒤 배포해요.

- 저장소의 상위 `node_modules`를 참조할 수 없는 임시 경로에서 tarball을 설치해요.
- 소비 앱이 React와 React DOM을 직접 선언하고, `--legacy-peer-deps` 없이 지원하는 peer dependency 조합을 설치해요.
- 같은 tarball을 npm·pnpm·Yarn·Bun으로 각각 설치하고 타입 검사와 소비 빌드를 실행해요. Yarn은 Classic·Modern `node-modules`·Modern PnP를 분리해요. 전체 행렬과 설치 원칙은 [패키지 매니저 지원](package-managers.md)을 따라요. 하나라도 실패하면 초기 배포 준비가 끝난 것으로 보지 않아요.
- Vite 소비 빌드와 `pnpm test:next`의 Next.js App Router 빌드·서버 렌더링·클라이언트 경계를 확인해요. 실제 브라우저 hydration과 콘솔 오류 검사는 별도로 완료해요.
- 상태가 있는 컴포넌트의 클릭·입력·선택·키보드·포커스 이동을 실제 브라우저에서 확인해요.
- 외부 클래스의 Default·Hover·Pressed·Disabled 계산 스타일을 브라우저에서 읽어 ELI 기본 스타일보다 우선하는지 확인해요.
- 화면 낭독기가 읽는 설명·역할·상태와 키보드 조작을 확인하고, 주요 Story의 모바일·데스크탑 화면 차이를 검토해요.

저장소 개발과 lockfile 관리는 pnpm만 사용해요. 소비자 패키지 매니저 검증의 버전·격리 방식·lockfile 규칙은 [패키지 매니저 지원](package-managers.md)에서 관리해요. 자동 검사가 준비되면 README에 소비자 지원 범위를 명시해요.

Node.js·React·브라우저 지원 범위를 늘릴 때는 새 조합을 검증 대상에 추가해요. 모든 조합을 임의로 약속하지 않고 README와 peer dependency에 명시한 범위만 지원해요.

## 다운로드 용량을 반드시 확인해요

배포 코드·CSS·의존성·빌드 설정이 바뀌면 `pnpm size`를 실행해요. 최신 빌드에 대해 `npm pack --dry-run --json`으로 측정해요.

- 압축 패키지 크기: 사용자가 받는 `@eli/ui` tarball 자체의 크기예요.
- 압축 해제 크기: 이 패키지 파일의 합계예요. 파일 시스템이나 전체 node_modules 크기는 아니에요.
- 포함 파일 수: 개발 파일이 섞이지 않았는지 확인해요.

결과는 `.artifacts/package-size.json`과 `.artifacts/package-size.txt`에 저장해요. 이 파일은 Git에서 제외하므로 PR에 수치를 직접 기록해요. 용량 측정 실패는 검증 실패예요.

```text
패키지: @eli/ui@버전
압축 크기: 실제 측정값 B
압축 해제 크기: 실제 측정값 B
포함 파일: 실제 측정값 개
실행 의존성 변경: 없음 또는 변경 이유
버전 변경 유형: 없음 / patch / minor / major
```

React·추가 의존성까지 합친 다운로드 크기나 브라우저 번들 크기로 표현하지 않아요. 최초 빈 패키지 크기를 완성된 라이브러리 크기로 안내하지 않아요. 임의의 상한은 두지 않고 증가 이유를 검토해요. 이전 릴리스 자동 비교와 Storybook 용량 표시는 후속 작업이에요.

실제 npm 배포 전에는 `pnpm test:packaging`으로 생성한 원본 tarball도 확인해요. npm 게시와 배포 자동화는 현재 설정하지 않아요.

## Storybook 배포를 확인해요

Cloudflare Workers Builds는 연결된 Git 저장소의 `main` 푸시마다 Storybook을 빌드하고 `wrangler.jsonc`에 지정된 정적 파일을 기존 Worker `eli-lds-storybook`에 배포해요. 작업 브랜치의 빌드를 막으려면 Cloudflare의 Preview Builds를 꺼요. 프로젝트 규칙대로 PR을 병합하면 `main`에 푸시되지만, `main`에 직접 푸시해도 빌드가 실행돼요.

Cloudflare 대시보드에서 **Workers & Pages → eli-lds-storybook → Settings → Build**를 열어 Git 저장소가 `ELI-LDS/ELI`, 프로덕션 브랜치가 `main`, 루트 디렉터리가 저장소 루트인지 확인해요. **Build command**는 `pnpm build:storybook`, **Deploy command**는 `npx wrangler deploy`로 지정하고 **Enable Preview Builds**를 꺼요. **Build Variables and Secrets**에 일반 변수 `PNPM_VERSION=12.8.1`을 추가해요. Node.js는 저장소 루트의 `.node-version`을 따라요. GitHub Actions 비밀 값은 필요 없어요.

설정을 마친 뒤 PR을 `main`에 병합해 Cloudflare **Deployments**에서 빌드 성공과 `https://eli-storybook.jihong.dev`의 실제 Storybook 화면을 확인해요. 실패한 빌드는 설정을 수정한 후 **Retry**로 다시 실행할 수 있어요. 이 설정은 npm 패키지를 게시하지 않아요.
