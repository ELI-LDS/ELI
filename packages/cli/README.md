# eli-design

필요한 ELI 컴포넌트 소스와 의존 파일만 기존 React 프로젝트에 추가하는 설치 도구예요. 전체 ELI 패키지·UI 소스·하네스를 실행 도구에 담지 않아요. 아직 npm 게시와 GitHub Release 콘텐츠 배포를 진행하지 않았어요.

## 저장소에서 실행해요

저장소의 고정 Node.js·pnpm 환경에서 실행해요. 아래의 `<프로젝트>`는 `package.json`과 지원 범위의 React가 설치된 앱 폴더예요.

```bash
pnpm install --frozen-lockfile
pnpm build:registry
pnpm build:cli
node packages/cli/dist/cli.mjs init --cwd <프로젝트> --registry <ELI 저장소 절대 경로>/.artifacts/registry
node packages/cli/dist/cli.mjs list --cwd <프로젝트>
node packages/cli/dist/cli.mjs add button --cwd <프로젝트>
node packages/cli/dist/cli.mjs add modal select --cwd <프로젝트>
node packages/cli/dist/cli.mjs add --all --cwd <프로젝트>
node packages/cli/dist/cli.mjs status --cwd <프로젝트>
```

게시 후의 실행 진입점은 `npx eli-design@latest`예요. 현재는 이 명령으로 이번 코드를 받을 수 있다고 안내하지 않아요. Node.js 24.21.0으로 개발·검증해요.

## 설정과 설치 기록

`init`은 프로젝트 루트에 `eli.json`을 만들어요. 소스 경로는 `src`가 있으면 `src/components/eli`, 없으면 `components/eli`이고 `--dir`로 바꿀 수 있어요. 레지스트리 주소·목록 해시·콘텐츠 버전을 고정하며, 다시 init해서 기존 설정을 덮어쓰지 않아요.

`add`는 필요한 공개·공유 항목만 재귀적으로 받고 소스와 `eli.lock.json`을 만들어요. 같은 내용의 파일은 재사용하고 수정된 파일은 덮어쓰지 않아요. 실패하면 이번에 새로 만든 파일을 되돌려요. 프로세스 강제 종료·전원 장애까지 복구하는 트랜잭션은 아니며, 중단 후 `.eli-install.lock`이 남았다면 실행 중인 설치가 없는지 확인하고 제거해요.

기록에는 소비 방식(`source`), 콘텐츠 버전, 요청·의존 항목, 파일 경로·소유 항목·SHA-256과 진입 파일·export를 담아요. 하네스는 `status --json`과 실제 파일을 대조할 수 있어요. 기록만으로 설치 파일이 변경되지 않았다고 가정하지 않아요. `eli.json`, `eli.lock.json`, 복사한 소스는 함께 버전 관리해요.

출력된 진입 파일을 실제 사용하는 파일 기준의 로컬 경로로 가져와요. `@/` 별칭을 임의로 만들거나 `@eli-design/ui`를 다시 설치하지 않아요.

```tsx
import { Button } from './components/eli/button/Button/Button';

<Button onClick={save}>저장하기</Button>
```

기본 CSS·토큰은 소스에 연결돼 있어 별도 CSS import가 필요 없어요. React는 프로젝트에 먼저 선언·설치되어 있어야 해요. CLI는 실제 설치 버전을 `semver`로 확인하고 React·폰트·다른 npm 의존성을 자동으로 추가하거나 교체하지 않아요. PnP 앱은 `yarn node`로 설치된 peer를 해석하므로 해당 프로젝트의 Yarn이 필요해요. Pretendard는 소비 앱의 폰트 로딩 정책에 맞춰 별도로 연결해요.

## 원격 레지스트리

`init --content-version <버전>`은 `ELI-LDS/ELI`의 `v<버전>` Release에 있는 `registry.json`을 사용해요. 인자 없이 실행하면 최근 100개 GitHub Release 중 정식 콘텐츠 목록 asset을 가진 첫 릴리스를 선택해 고정해요. 도구 전용 릴리스와 사전 릴리스는 제외해요. 아직 콘텐츠를 게시하지 않았다면 오류로 중단해요.

`init --registry https://.../registry.json` 또는 로컬 폴더로 별도 레지스트리를 지정할 수 있어요. HTTPS를 사용하며 HTTP는 로컬 검증용 loopback만 허용해요. GitHub Release의 지정된 asset CDN 외 리디렉션은 거부해요. 해시는 변경 감지 수단이며 배포 출처 인증을 대신하지 않아요. 업데이트·버전 혼합·파일 덮어쓰기 옵션·하네스 설치는 제공하지 않아요.

## 에이전트가 실행해요

모든 명령은 필수 입력이 있으면 질문 없이 실행해요. `--dry-run`은 `init`과 `add`의 변경 계획만 조회하고, `--json`은 표준 출력에 결과 JSON 하나만 출력해요. 파일 충돌이나 부족한 조건은 실패로 반환해요. 설치 계획 단계에서도 React 호환성을 확인해요.

```bash
node packages/cli/dist/cli.mjs add button --cwd <프로젝트> --dry-run --json
node packages/cli/dist/cli.mjs status --cwd <프로젝트> --json
```

- 성공: 종료 코드 `0`, `ok: true`. add는 `version`, `requested`, `resolved`, `entries`, `files`, `requirements`, `manager`, `downloads`를 반환해요.
- 실패: 종료 코드 `1`, `ok: false`, `error: { code, message, details }`를 반환해요. 사람이 읽는 모드의 오류는 표준 오류에 출력해요.
- 파일: add의 `action`은 `add` 또는 `reuse`, status의 `state`는 `unchanged`, `modified`, `missing`이에요. 진입 경로는 프로젝트 루트 기준이에요.
- 다운로드: `downloads[].bytes`는 읽은 JSON의 압축 해제 후 바이트예요. HTTP 압축 전송량·CLI/semver npm 다운로드·브라우저 번들 크기가 아니에요. 별도 영구 캐시는 아직 없어요.

| 오류 코드 | 대응 |
| --- | --- |
| `INVALID_ARGUMENT`, `NOT_INITIALIZED`, `INVALID_CONFIG`, `INVALID_PROJECT` | 인자와 프로젝트 설정을 확인해요 |
| `UNKNOWN_ITEM` | list에서 공개 ID를 확인해요 |
| `REGISTRY_UNAVAILABLE` | 연결과 콘텐츠 게시 여부를 확인해요 |
| `INVALID_DATA`, `SCHEMA_UNSUPPORTED`, `INTEGRITY_MISMATCH`, `VERSION_MISMATCH` | 배포 데이터·규격·고정 버전을 확인해요 |
| `UNSAFE_PATH`, `UNSAFE_REGISTRY` | 안전한 상대 경로와 레지스트리 주소를 사용해요 |
| `FILE_CONFLICT`, `INVALID_RECORD`, `PROJECT_BUSY` | 기존 파일·설치 기록·진행 중인 설치를 확인해요 |
| `MISSING_DEPENDENCY`, `INCOMPATIBLE_DEPENDENCY`, `PACKAGE_MANAGER_CONFLICT` | 앱의 React 설치와 패키지 매니저를 맞춰요 |
| `IO_ERROR` | 파일 권한과 경로를 확인해요 |

## 검증

`pnpm test:cli`는 실제 도구 tarball의 파일 목록·설치·JSON 결과와 선택 다운로드·공유 파일·충돌·경로·해시·설치 기록을 확인해요. `pnpm test:cli:consumer`는 CLI로 추가한 소스로 타입·Vite·CSS·Next.js SSR·hydration을 확인해요.

`pnpm test:cli:package-managers`는 같은 tarball로 npm·pnpm·Yarn Classic·Yarn Modern node-modules·strict PnP·Bun의 임시 실행을 검사해요. 앱의 package.json·lockfile·PnP 설정 보존과 소스 타입·Vite·CSS·SSR도 확인해요. 고정 도구 준비와 개별 행 재실행은 [CLI 실행 행렬](../../Agent/package-managers.md#cli-실행-행렬도-구분해요)을 따라요. 현재 로컬 macOS arm64에서 여섯 행이 통과했으며 Linux CI의 실제 실행 결과는 PR에서 따로 확인해요. 실제 npm 이름·버전으로 받는 공개 명령은 게시 후 별도 확인 항목이에요. 기존 UI tarball 검사는 유지해요.

`pnpm size:cli`는 Button·조합 컴포넌트·연속 추가·전체 추가를 빈 npm 캐시와 재실행 조건으로 측정해요. 격리된 로컬 HTTP 서버에서 CLI를 실제 실행해 도구·semver·npm 메타데이터·UI JSON 응답 본문을 기록하고 identity/gzip 조건을 비교해요. 공개 CDN·HTTP 헤더·TLS·기존 React 다운로드를 포함한 수치는 아니에요. 결과는 `.artifacts/cli-download-size/report.json`과 `report.md`, 정확한 범위는 [측정 지침](../../Agent/testing.md#소스-설치의-전체-다운로드량을-확인해요)에서 확인해요.

규격은 [레지스트리 지침](../../Agent/registry.md), 버전과 배포는 [버전 지침](../../Agent/versioning.md)을 따라요.
