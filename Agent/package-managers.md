# 소비자 패키지 매니저 지원

## 개발 환경과 소비 환경을 구분해요

ELI 저장소의 개발·lockfile·스크립트 실행은 루트 `packageManager`에 고정한 pnpm만 사용해요. 소비자는 npm·pnpm·Yarn·Bun 프로젝트에서 `eli-design`을 실행할 수 있어야 해요. 기존 전체 패키지는 해당 프로젝트의 의존성 추가 명령으로 설치해요.

소비 호환성을 위해 저장소에 `package-lock.json`, `yarn.lock`, `bun.lock`을 추가하지 않아요. 각 패키지 매니저 검증은 저장소 밖의 격리된 임시 소비 프로젝트에서 수행해요.

## 삭제된 전체 패키지를 신규 설치로 안내하지 않아요

`@eli-design/ui`는 npm에서 삭제됐어요. 사용자 설치 안내는 `eli-design` 실행과 로컬 소스 import로 통일해요. 기존 앱의 의존성·lockfile은 이전 검토 없이 지우지 않아요. 아래의 전체 UI tarball 검사는 현재 내부 구조가 남아 있는 동안의 호환성 확인이며 신규 설치 권장이나 재게시 계획이 아니에요.

## 소스 추가를 기본 소비 방식으로 사용해요

설치 진입점의 npm 이름은 `eli-design`이에요. `packages/cli`의 실행 파일과 레지스트리 연결은 구현되어 있어요. npm CLI와 UI·하네스 콘텐츠가 공개되어 아래 명령으로 실행해요. 사용자 안내는 [CLI 사용법](../packages/cli/README.md), 실제 버전·게시 상태와 검증 범위는 [릴리스 기록](../handbook/releases/0.2.0.md)을 따라요.

```text
npx eli-design@latest init
npx eli-design@latest add button
npx eli-design@latest add button modal
npx eli-design@latest add --all
npx eli-design@latest harness --agent claude
```

`harness`는 Claude Code·Codex 또는 둘 모두를 명시적으로 선택하는 별도 명령이에요. UI의 `add --all`에는 하네스가 포함되지 않아요. 하네스 설치는 앱의 React·package.json·lockfile을 바꾸지 않고 UI init 없이도 실행돼요. 상세 경로·설정 병합·사용자 신뢰는 [하네스 지침](harness.md)을 따라요.

같은 설치 도구 tarball을 npm은 `npm exec`(npx와 같은 실행 계열), pnpm은 `pnpm dlx`, Yarn Modern은 `yarn dlx`, Bun은 `bun x`(bunx)에서 검증해요. [Yarn Classic](https://classic.yarnpkg.com/en/docs/cli/)에는 `dlx`가 없으므로 npm exec로 도구를 실행하고 앱 의존성은 계속 Yarn으로 관리해요. [Yarn Modern의 dlx](https://yarnpkg.com/cli/dlx)를 Classic 명령으로 안내하지 않아요. 로컬 tarball 검증과 게시된 이름·버전의 실행 확인을 구분하고 실제 게시 후 공개 명령도 확인해요.

실행 도구를 내려받는 범위와 UI 소스·추가 의존성을 받는 범위를 구분해요. 소스 추가의 구조 기준은 [프로젝트 구조](architecture.md#소스-설치를-기본으로-사용해요), 설치 기록과 비대화형 호출 계약은 [레지스트리 지침](registry.md#하네스가-설치-도구를-호출해요)을 따라요. 기능이 구현되기 전에는 전체 소스 추가나 하네스 호출까지 검증됐다고 안내하지 않아요.

CLI는 실행 도구를 받은 방식보다 소비 프로젝트의 `packageManager`와 lockfile을 기준으로 판단해요. 현재 CLI는 이미 설치한 React의 버전을 확인하고, 누락·호환 오류를 안내하며 package.json이나 lockfile을 수정하지 않아요. 의존성 자동 설치를 추가할 때도 같은 패키지 매니저를 사용하고 기존 React를 임의로 교체하지 않아요. 신규 프로젝트에 `@eli-design/ui` 설치를 제안하지 않아요. 선택 설치 방식에서는 공통 `tokens/`와 요청한 컴포넌트 폴더, 그 컴포넌트가 실제로 참조하는 파일만 추가하고 `@eli-design/ui` 전체 패키지는 설치하지 않아요. 다른 패키지 매니저의 lockfile을 만들거나 전역 설치를 요구하지 않아요. 두 소비 방식의 구조 기준은 [프로젝트 구조](architecture.md#소스-설치를-기본으로-사용해요)에서 관리해요.

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

## CLI 실행 행렬도 구분해요

`pnpm test:cli:package-managers`는 위에 고정한 여섯 환경에 같은 CLI tarball과 레지스트리 스냅샷을 전달해요. 앱은 저장소 밖 임시 폴더에서 각 도구로 실제 설치하고, CLI는 앱 의존성으로 추가하지 않고 임시 실행 경로로 호출해요. tarball의 SHA-256을 모든 행에서 확인하고 결과는 `.artifacts/cli-package-managers/reports`에 남겨요.

- 초기 설정·개별 추가·조합 컴포넌트 의존성·공유 파일 재사용·상태·미리보기와 JSON 결과를 확인해요.
- CLI 실행 전후에 package.json·lockfile·PnP 설정과 설치 상태 파일의 해시를 비교해요. 다른 도구의 lockfile이 새로 생겨도 실패해요.
- 복사한 로컬 소스의 타입 검사·Vite 빌드·CSS 자동 연결·일반 SSR을 확인해요. Next.js 소비 검사는 `pnpm test:cli:consumer`에서 따로 확인해요.
- strict PnP는 Yarn dlx뿐 아니라 npm exec에서 CLI를 실행해도 소비 앱의 React를 해석하는지 확인해요.
- `.github/workflows/cli-package-managers.yml`이 후보를 한 번 생성하고 각 행에 전달해요. 이 설정을 작성한 것과 원격 CI 통과를 구분해요.

로컬에서 전체 행렬을 실행하려면 고정한 도구가 준비되어 있어야 해요. `ELI_NPM_BINARY`, `ELI_PNPM_BINARY`, `ELI_YARN_CLASSIC_BINARY`, `ELI_YARN_MODERN_BINARY`, `ELI_BUN_BINARY`로 임시 설치한 실행 파일을 지정할 수 있어요. 개인 전역 버전이나 홈 설정을 바꾸지 않아요. CI는 각 행에 필요한 도구만 임시 경로에 준비해요.

특정 행만 다시 확인할 때는 같은 후보를 사용해요. `--prepare`는 기존 후보와 보고서를 새로 만들므로, 소스나 패키지를 바꾸지 않았다면 다시 실행하지 않아요.

```bash
pnpm build:registry
pnpm build:harness
pnpm build:cli
node tests/cli/package-managers.mjs --prepare
node tests/cli/package-managers.mjs --manager yarn-modern-pnp
```

이 검사는 로컬 tarball의 실행 호환성이며 실제 npm 이름·배포 태그·공개 레지스트리 서버까지 검증한 결과는 아니에요. CLI·콘텐츠 게시 후 같은 버전의 공개 명령을 확인해요.

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
