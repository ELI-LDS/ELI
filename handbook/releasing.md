# 릴리스 절차

기본 소스 배포는 **npm의 `eli-design` 설치 도구와 GitHub Release의 UI·하네스 콘텐츠**로 나눠 진행해요. 기존 전체 패키지 `@eli-design/ui`는 종료 예정이며 새 UI npm 릴리스를 병행하는 방식으로 안내하지 않아요. 버전·태그 이름은 [버전 규칙](../Agent/versioning.md#설치-도구와-콘텐츠-버전을-구분해요), 검사 범위는 [검증 기준](../Agent/testing.md), 선택 설치 데이터는 [레지스트리 지침](../Agent/registry.md)을 따라요.

지침 작성·일반 PR 병합·Storybook 배포만으로 npm에 게시하지 않아요. 실제 릴리스 요청이 있을 때 아래 절차를 실행해요. 이번 지침을 추가했다고 릴리스 자동화나 이미 게시된 버전의 기록이 복구되는 것은 아니에요.

## npm 게시만 위임할 수 있게 준비해요

릴리스 준비자는 아래 최종 파일 생성·사전 검사·GitHub 콘텐츠 게시·공개 콘텐츠 소비와 GitHub의 파일 전달을 맡아요. npm 담당자는 전달받은 tarball의 무결성을 확인하고 npm 게시·배포 태그 변경만 수행해요. 담당자에게 UI 빌드·레지스트리 생성·Git 태그·GitHub 업로드를 다시 요구하지 않아요.

설치 도구의 `cli-v{버전}` GitHub Release에 검증한 tarball·`SHA256SUMS`·원본 SHA와 integrity를 담은 `release.json`을 제공해요. UI 소스 콘텐츠의 `v{버전}` Release에는 개별 JSON, 하네스의 `harness-v{버전}` Release에는 `harness.json`을 제공해요. 파일 전달은 npm 게시 완료와 구분하고, 이미 고정한 파일을 담당자의 환경에서 다시 빌드하지 않아요.

npm 담당자가 `next`로 게시하면 릴리스 준비자가 같은 버전의 공개 명령을 검사하고 결과를 전달해요. 통과한 뒤 담당자가 `latest`로 승격해요. 단계별 담당·명령·중단 기준은 [npm 담당자 안내](npm-publishing.md)를 따라요. 기존 `@eli-design/ui`의 삭제·사용 중단은 하네스 담당자와 별도로 결정하며 이번 CLI 게시에 묶지 않아요.

## CLI와 UI 소스 콘텐츠를 배포해요

`packages/cli`의 설치 도구와 `packages/registry`의 생성기·소비 검사는 구현되어 있어요. 준비 PR을 병합했다고 npm·GitHub에 게시된 것으로 기록하지 않아요. 설치 도구에 전체 UI·하네스를 담거나 소스 설치를 위해 전체 UI 패키지를 먼저 게시·설치하는 조건을 두지 않아요.

### 1. 준비 PR에서 버전과 범위를 확정해요

조립 구성 요소의 설치 관계나 폰트 바이너리 규격을 바꾸는 릴리스는 [조립 설치 호환성 계약](../Agent/registry.md#조립-부품도-같은-설치-그래프로-연결해요)에 따라 CLI·콘텐츠 게시 순서와 기본 레지스트리 주소를 먼저 확정해요. 로컬 후보의 성공으로 기존 공개 CLI의 지원을 가정하지 않아요. 폰트 v2의 전달·v1 호환·공통 가이드 인계는 [바이너리 계약](../Agent/registry.md#폰트-바이너리는-v2로-전달해요)도 확인해요.

최신 `main`에서 `release/v{버전}` 브랜치를 만들고 실제 npm 버전·태그와 기존 GitHub Release를 확인해요. `eli-design`의 E404 응답은 현재 조회 결과이며 패키지명에 대한 게시 권한까지 보장하지 않아요. 네트워크·인증 오류를 미게시로 판단하지 않아요.

```bash
npm view eli-design versions dist-tags --json
npm view @eli-design/ui versions dist-tags --json
gh release list
gh repo view ELI-team/ELI --json visibility
```

콘텐츠를 일반 사용자에게 제공할 저장소는 공개되어 있어야 해요. 인증된 `gh`에서 Release를 확인한 것만으로 공개 다운로드가 된다고 판단하지 않아요. 인증 정보가 없는 CLI에서 목록 API와 개별 asset을 실제로 받아 확인해요. 비공개 저장소라면 전체 원본을 임의로 공개하거나 토큰을 CLI에 넣지 않고 공개 배포 위치부터 합의해요.

설치 도구는 `packages/cli/package.json`, UI 콘텐츠는 `packages/ui/package.json`, 하네스는 `packages/harness/package.json`에서 버전을 정해요. 번호를 억지로 맞추지 않으며 콘텐츠 버전 변경만으로 기존 전체 UI 패키지를 npm에 게시하지 않아요. 고정된 pnpm으로 lockfile을 동기화하고, 실제 릴리스 대상만 CHANGELOG의 준비 중인 구역으로 옮겨요. 게시 날짜·최종 원본 SHA·게시 후 검사 결과를 미리 채우지 않아요.

초기 CLI는 레지스트리 규격 v1과 같은 프로젝트 내 단일 콘텐츠 버전을 지원해요. UI·하네스 업데이트·강제 덮어쓰기·React/폰트 자동 설치·원격 MCP 연결을 제공한다고 안내하지 않아요. 하네스는 명시적 선택 설치와 같은 버전 재사용만 지원해요. 기존 수정 파일을 보존하는 제한도 릴리스 노트에 남겨요.

저장소를 이전했다면 고정 후보에 들어 있는 Release API·asset 주소로 인증 없는 조회·다운로드가 계속 되는지 확인해요. 이전 API의 이동 응답이 설치 도구에서 거부되면 새 주소를 사용하는 CLI 후보를 별도 버전으로 준비해요. 이전 검증 결과만으로 게시하지 않고 기존 고정 파일은 보존해요.

### 2. 최종 후보를 한 번 만들고 고정해요

준비 PR 병합 후 깨끗한 `main`의 SHA를 고정해요. 그 SHA에서 고정 환경 설치, `pnpm check`, `pnpm test:registry`, `pnpm test:cli`, `pnpm test:cli:consumer`를 확인하고 필요한 브라우저·실기기 확인 범위를 기록해요. 같은 SHA의 성공 CI는 링크로 재사용할 수 있지만, 이전 기능 PR의 다른 SHA를 검사한 결과와 구분해요.

```bash
pnpm install --frozen-lockfile
pnpm build:registry
pnpm build:harness
pnpm build:cli
node tests/cli/package-managers.mjs --prepare
```

이 준비 명령이 `.artifacts/cli-package-managers/`에 도구 tarball·`candidate.json`·`registry/`·`harness/` 스냅샷을 만들어요. `candidate.json`의 파일명·버전·SHA-256·크기와 스냅샷의 콘텐츠 버전·규격·모든 파일 해시를 확인해요. source SHA도 결과 기록에 함께 남겨요.

최종 tarball은 폴더를 다시 빌드해 게시하지 않고 이 파일을 그대로 사용해요. 고정한 후보로 아래 행렬을 실행하고, 실제 설치한 bin으로 같은 레지스트리 스냅샷의 Next.js SSR·hydration도 확인해요. `pnpm test:cli:consumer`는 작업 폴더의 CLI를 다시 빌드하므로 최종 파일 검사에는 사용하지 않아요. 최종 tarball을 저장소 밖 도구 폴더에 설치한 뒤 `ELI_CLI_BINARY`를 실제 설치한 `dist/cli.mjs`의 절대 경로로 지정하고 `node tests/registry/consumer.mjs --cli`를 실행해요. 공개 콘텐츠 검증은 같은 명령에 `ELI_REGISTRY_URL`을 게시한 `registry.json` URL로 지정해요. 받은 소스는 로컬 스냅샷과 대조해요.

```bash
node tests/cli/package-managers.mjs --all
```

고정 도구 준비·개별 행 재실행은 [CLI 실행 행렬](../Agent/package-managers.md#cli-실행-행렬도-구분해요)을 따라요. `pnpm test:cli:package-managers`와 `--prepare`는 후보를 새로 만들기 때문에 고정 뒤에 다시 실행하지 않아요. `pnpm size:cli`도 자체 후보의 참고 측정이며 실제 npm/CDN 전송량이나 최종 파일 검증을 대신하지 않아요. 소스나 후보 파일이 달라졌다면 새 후보로 검증해요.

### 3. 콘텐츠를 먼저 공개하고 로컬 CLI로 받아봐요

이미 공개된 UI 콘텐츠를 그대로 사용한다면 기존 `v{콘텐츠 버전}`과 JSON 해시를 확인해 재사용해요. CLI·하네스 번호를 맞추려고 UI를 다시 올리거나 기존 파일을 덮어쓰지 않아요. UI·CLI·하네스 원본 커밋이 다르면 각 SHA를 기록해요.

하네스 선택 설치를 제공하는 릴리스는 `pnpm build:harness`로 고정한 `harness.json`도 별도의 `harness-v{버전}` 태그·Release에 제공해요. 공개 URL의 묶음·파일 해시를 대조하고 최종 로컬 CLI로 UI 없는 앱에 `harness --agent all`을 실행해 복사·설정 보존·재실행·status를 확인해요. 기존 UI 소스가 있는 앱에서도 실제 훅이 기록된 로컬 경로를 인식하는지 확인해요. 실제 에이전트의 신뢰·스킬 사용과 원격 MCP 미연결은 별도 상태로 남겨요.

`v{콘텐츠 버전}` 태그를 해당 콘텐츠의 고정 SHA에 만들고 원격에 올려요. 같은 태그가 있으면 SHA와 기존 asset 해시를 확인하고 다른 내용이면 중단해요. 그 태그의 GitHub Release에 고정한 `registry/`의 **모든 JSON을 개별 asset**으로 올려요. zip 파일이나 저장소 전체를 받도록 바꾸지 않아요.

CLI의 기본 `init`은 `v{버전}` 형태의 정식 Release 중 `registry.json`이 있는 항목만 선택해요. 따라서 기본 경로로 공개할 콘텐츠 Release는 draft·prerelease로 남기지 않아요. 시험용 콘텐츠를 prerelease로 올렸다면 `--content-version`으로만 명시적으로 확인해요. 도구 전용 Release는 `cli-v{버전}` 태그로 구분해요.

게시 후 공개 URL의 목록·항목 JSON을 내려받아 버전·SHA-256·의존 항목을 확인해요. 아직 npm에 게시하지 않은 **최종 CLI tarball의 bin**으로 새 React 앱에서 공개 콘텐츠의 `init`·개별/조합/전체 추가·CSS·타입·Next.js 동작을 확인해요. 이 검사가 실패하면 CLI 게시를 진행하지 않아요. 이미 공개한 콘텐츠는 다른 파일로 덮어쓰지 않아요.

### 4. 검증한 CLI 파일을 next로 게시해요

아래 변수는 앞에서 고정한 실제 파일과 버전으로 지정해요. `npm whoami`로 게시 계정과 권한을 확인하고, 필요 시 npm의 인증 절차를 진행해요. 토큰·OTP를 저장소나 릴리스 기록에 넣지 않아요.

```bash
npm publish "$ELI_CLI_TARBALL" --ignore-scripts --access public --tag next
npm view "eli-design@$ELI_CLI_VERSION" version dist.integrity --json
npm view eli-design dist-tags --json
```

`dist.integrity`가 검증한 tarball의 SHA-512와 같은지 확인해요. `next`도 공개 npm 게시이며 동일 버전은 수정해 다시 게시할 수 없어요. 게시 실패 응답이 불분명하면 먼저 npm의 실제 버전·integrity를 조회하고 결과가 없다고 확인하기 전까지 재게시하지 않아요.

### 5. 공개 명령을 확인하고 latest로 전환해요

게시된 **명시적 도구 버전**으로 npm·pnpm·Yarn Classic·Yarn Modern node-modules/PnP·Bun의 실행을 확인해요. 로컬 tarball 행렬만으로 게시된 이름·태그·다운로드 경로까지 확인했다고 적지 않아요. 대표 형태는 아래와 같고 실제 실행 버전은 기록에 남겨요.

```bash
npx eli-design@next init
npx eli-design@next add button
npx eli-design@next add modal select
npx eli-design@next add --all
```

새 앱에서 실제 소스 import·CSS 연결·타입·SSR·hydration과 설정 보존을 확인하고, 이미 설치한 앱에서는 공통 파일 재사용·수정 파일 보호도 확인해요. 설치 도구 버전과 콘텐츠 버전을 각각 기록해요. 검증한 공개 명령이 통과하면 `npm dist-tag add "eli-design@$ELI_CLI_VERSION" latest`로 승격하고 태그를 다시 조회해요.

CLI의 `cli-v{버전}` 태그도 고정한 도구 SHA를 가리키게 해요. CLI와 콘텐츠가 다른 커밋이라면 각 SHA와 지원하는 콘텐츠 버전·목록 해시를 따로 기록해요. CHANGELOG에는 실제 게시 시각과 완료 범위를 반영하며, 준비 중인 버전이 게시된 것으로 README를 미리 바꾸지 않아요. 이후 문서 기록 커밋이 생겨도 기존 배포 태그는 이동하지 않아요.

하네스 독립 배포는 `harness-v{버전}`으로 구분해요. MCP 응답 변경과 실제 에이전트 동작은 해당 담당자가 별도로 확인해요. 이 항목을 작성한 것만으로 배포 패키지명·태그·설치 안내가 전환된 것은 아니에요.

## 종료 예정인 전체 패키지를 구분해요

`@eli-design/ui`를 신규 배포 대상에 포함하지 않아요. UI 콘텐츠 변경은 GitHub의 소스 콘텐츠 릴리스로 제공하고, 전체 UI도 `add --all`로 추가해요.

현재 내부 workspace와 검사 코드가 기존 이름을 참조하므로 패키지 manifest·exports·빌드·검사를 문서 작업에서 임의로 삭제하지 않아요. npm의 deprecate·삭제와 내부 연결 정리는 별도 작업으로 검토해요. 기존 사용자 프로젝트의 의존성·lockfile·수정 소스도 자동으로 지우지 않아요.

## 4. 중단과 복구를 구분해요

- **게시 전 실패:** 게시하지 않고 수정·검증해요. 선택한 버전이 여전히 미게시인지 다시 조회해요.
- **게시 명령이 실패하거나 응답을 받지 못함:** 먼저 해당 버전의 존재와 integrity를 조회해 실제 결과를 확인해요. 이미 같은 파일이 게시됐으면 검증 단계부터 재개해요. 다른 integrity라면 중단하고 원인을 조사해요.
- **게시 후 설치·검증 실패:** 기존 `latest`를 유지하고 문제 버전과 실패 원인을 기록해요. 수정은 새로운 번호로 게시해요.
- **승격 후 문제 발견:** 이전 정상 버전이 설치 가능한지 확인하고 `latest`를 그 버전으로 되돌려요. 영향받는 사용자에게 정확한 버전 고정·업데이트 방법을 알려요. 이미 설치된 lockfile과 복사된 소스까지 자동으로 되돌아가는 것은 아니에요.
- **문제 버전 안내:** 필요하면 문제가 있는 정확한 버전만 npm deprecate로 표시해요. 패키지 전체를 deprecated 처리하거나 삭제하는 것을 기본 복구 방법으로 삼지 않아요. 태그·Release·레지스트리를 다른 내용으로 덮어쓰지 않아요.
- **npm 게시 후 GitHub 작업 실패:** 게시된 파일의 검증 결과가 유효하면 같은 SHA·파일로 기록과 asset 공개부터 재개해요. 이미 게시된 패키지를 다시 만들지 않아요.

## 5. 결과를 남겨요

릴리스 PR 또는 GitHub Release에 아래 양식을 채워요. 배포 후 검사는 게시 전에 완료한 것으로 체크하지 않아요. 실제 게시 날짜가 CHANGELOG의 준비 날짜와 달라졌다면 후속 문서 커밋으로 바로잡고 원래 배포 태그의 SHA는 유지해요.

```text
패키지 / 버전 / 일반·시험 배포:
릴리스 준비 PR / 배포 커밋 SHA / Git 태그:
실제 npm 게시 시각 / GitHub Release 링크:
tarball 파일명 / integrity / 압축·압축 해제 크기 / 파일 수:
이전 latest·next / 게시 후 latest·next:
실행한 검증 또는 같은 SHA의 성공 CI 링크:
게시 후 명시적 버전의 설치·동작 확인:
레지스트리 게시 여부 / 버전·해시 확인:
미검증 범위·남은 제한 / 중단·복구 내역:
```

현재는 수동 운영 기준이에요. 버전 증가·최종 tarball 고정·게시·태그·Release 기록을 한 번에 보장하는 자동화는 구현하지 않았어요. 기존 CI의 타입·브라우저·설치 검사를 릴리스 자동화가 있는 것으로 설명하지 않아요.

명령의 기준은 [npm publish](https://docs.npmjs.com/cli/commands/npm-publish/), [npm 배포 태그](https://docs.npmjs.com/adding-dist-tags-to-packages/), [버전별 deprecate](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)예요.
