# 소비자 패키지 매니저 지원

## 개발 환경과 소비 환경을 구분해요

ELI 저장소의 개발·lockfile·스크립트 실행은 루트 `packageManager`에 고정한 pnpm만 사용해요. `@eli-design/ui` 소비자는 npm·pnpm·Yarn·Bun 중 자신의 프로젝트가 사용하는 패키지 매니저로 설치할 수 있어야 해요.

소비 호환성을 위해 저장소에 `package-lock.json`, `yarn.lock`, `bun.lock`을 추가하지 않아요. 각 패키지 매니저 검증은 저장소 밖의 격리된 임시 소비 프로젝트에서 수행해요.

## 라이브러리는 프로젝트 의존성으로 설치해요

`@eli-design/ui`는 사용자의 `package.json`과 lockfile에 기록되어야 하므로 각 패키지 매니저의 의존성 추가 명령을 안내해요.

```bash
# npm
npm install @eli-design/ui

# pnpm
pnpm add @eli-design/ui

# Yarn
yarn add @eli-design/ui

# Bun
bun add @eli-design/ui
```

`npx`, `pnpm dlx`, `yarn dlx`, `bunx`는 패키지 실행 파일을 임시로 내려받아 실행하는 명령이에요. `@eli-design/ui` 설치 방법으로 안내하지 않아요. 특히 `yarn dlx`는 프로젝트 의존성을 기록하지 않으므로 `yarn add` 대신 사용하지 않아요.

선택 설치용 JSON 생성기는 준비되어 있고, CLI 구현·연동은 진행 중이에요. 데이터의 기준은 [레지스트리 지침](registry.md)이에요. 추후 초기 설정과 선택 컴포넌트 설치 CLI를 구현하면 라이브러리 설치와 구분해 아래 형식으로 안내해요. 실제 CLI 패키지명과 명령은 구현 전까지 예시로 공개하지 않아요.

```text
npx {CLI 패키지} init
pnpm dlx {CLI 패키지} init
yarn dlx {CLI 패키지} init
bunx {CLI 패키지} init

# 원하는 컴포넌트 소스만 추가하는 예시
npx {CLI 패키지} add button
pnpm dlx {CLI 패키지} add button
yarn dlx {CLI 패키지} add button
bunx {CLI 패키지} add button
```

CLI는 현재 프로젝트의 lockfile과 실행 중인 패키지 매니저를 확인하고 같은 도구로 필요한 외부 의존성을 설치해야 해요. 패키지 방식을 선택한 경우에만 `@eli-design/ui`를 설치해요. 선택 설치 방식에서는 공통 `tokens/`와 요청한 컴포넌트 폴더, 그 컴포넌트가 실제로 참조하는 파일만 추가하고 `@eli-design/ui` 전체 패키지는 설치하지 않아요. 다른 패키지 매니저의 lockfile을 만들거나 전역 설치를 요구하지 않아요. 두 소비 방식의 구조 기준은 [프로젝트 구조](architecture.md#두-가지-소비-방식을-제공해요)에서 관리해요.

## 초기 지원 행렬을 고정해요

아래 버전은 2026년 11월 2일 기준 자동 검증 행렬이에요. `.github/workflows/package-manager-compatibility.yml`이 한 번 만든 같은 tarball을 각 소비 환경에 전달하고, 저장소 밖 임시 프로젝트에서 설치·타입 검사·Vite 빌드를 실행해요.

| 대상 | 설치 방식 | 목표 버전 |
| --- | --- | --- |
| npm | `node_modules` | Node.js 24.21.0 환경의 npm 11.19.0 |
| pnpm | pnpm 기본 linker | 12.8.1 |
| Yarn Classic | `node_modules` | 1.22.22 |
| Yarn Modern | `nodeLinker: node-modules` | 4.18.1 |
| Yarn Modern PnP | `nodeLinker: pnp` | 4.18.1 |
| Bun | Bun 기본 설치 방식 | 1.4.4 |

“Yarn 지원”이라고만 작성하지 않아요. Classic과 Modern을 구분하고, Modern은 `node-modules`와 PnP를 각각 검증해요. 버전을 갱신할 때는 공식 안정 버전을 다시 확인하고 별도 PR에서 행렬 전체를 실행해요. `latest`, `stable` 같은 이동 태그를 CI 검증 버전으로 사용하지 않아요.

전체 행렬은 `pnpm test:package-managers`로 실행할 수 있어요. 이 명령은 표에 고정한 각 패키지 매니저가 로컬에 준비돼 있어야 하므로, PR의 자동 행렬을 공통 확인 기준으로 사용해요. CI는 npm과 Yarn 실행 파일을 임시 경로에 설치하고 Bun과 pnpm도 고정 버전으로 준비해 개인의 전역 설정을 바꾸지 않아요.

## 같은 tarball로 검증해요

한 번 생성한 실제 배포 tarball을 모든 행렬에서 사용해 패키지 매니저에 따라 결과물이 달라지지 않게 해요. 각 소비 프로젝트는 React·React DOM과 빌드 도구를 직접 선언하고 다음 항목을 확인해요.

1. 강제 설치 옵션 없이 의존성을 설치해요.
2. 공개 경로와 타입을 해석해요.
3. 별도 CSS import 없이 Vite 소비 빌드를 완료해요.
4. 일반 SSR과 지원하기로 한 프레임워크 소비 검사를 완료해요.
5. 실제 브라우저에서 상호작용과 외부 스타일 계산 결과를 확인해요.

`--force`, `--legacy-peer-deps`, peer dependency 검사 해제 옵션은 사용하지 않아요. 한 행렬이라도 실패하면 초기 배포 준비가 끝난 것으로 보지 않아요.

패키지 원본의 파일 목록·JSDoc·CSS 레이어 검사는 tarball을 직접 풀어 한 번 확인해요. 소비 환경 검사에서는 `node_modules/@eli-design/ui` 같은 설치 경로를 직접 읽지 않고 각 패키지 매니저의 해석 방식으로 import·타입 검사·빌드를 실행해요.

## Yarn PnP를 별도로 검증해요

Yarn Modern PnP 소비 예제는 아래 설정을 사용해 선언하지 않은 의존성 접근을 허용하지 않아요.

```yaml
# .yarnrc.yml
nodeLinker: pnp
pnpMode: strict
pnpFallbackMode: none
```

PnP에는 `node_modules`와 일반적인 `.bin` 경로가 없어요. `node_modules/typescript/bin/tsc`처럼 설치 위치를 가정하지 않고 `yarn typecheck`, `yarn build`처럼 소비 프로젝트의 scripts를 통해 도구를 실행해요.

현재 Vite 8은 PnP 사용을 권장하지 않는다는 경고를 출력하지만, ELI의 strict PnP 타입 검사와 Vite 빌드는 통과해요. 경고를 성공으로 숨기지 않고 Vite를 갱신할 때 행렬을 다시 실행해 실제 호환성이 깨지지 않았는지 확인해요.

ELI의 누락된 dependency나 peer dependency를 `packageExtensions`, `pnpIgnorePatterns`, `pnpMode: loose`로 숨기지 않아요. 실패 원인이 ELI의 패키지 선언이라면 `packages/ui/package.json`을 수정하고, 외부 도구 문제라면 근거와 임시 대응 범위를 검증 결과에 기록해요.

## 검증 결과를 승격해요

지원 행렬의 구현 상태는 [개선 제안](../handbook/improvements.md#배포-안정성-검사를-보완해요)에서 관리해요. 자동 검사는 관련 패키지·빌드·검증 파일이 바뀌는 PR에서 실행하고, 릴리스 PR에서도 최신 성공 결과를 확인해요. README와 패키지 README에 안내한 지원 버전을 바꾸려면 행렬과 지침을 함께 갱신해요.

명령과 설치 방식은 [npm 패키지 설치](https://docs.npmjs.com/using-npm-packages-in-your-projects/), [pnpm add](https://pnpm.io/cli/add), [Yarn 사용법](https://yarnpkg.com/getting-started/usage), [Yarn PnP](https://yarnpkg.com/features/pnp), [Bun add](https://bun.sh/docs/pm/cli/add)의 공식 문서를 기준으로 확인해요.
