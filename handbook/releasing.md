# 릴리스 절차

기본 소스 배포는 **npm의 `eli-design` 설치 도구와 GitHub Release의 UI 콘텐츠**로 나눠 진행해요. 기존 전체 패키지 `@eli-design/ui`의 npm 게시 절차는 아래에 별도로 남겨요. 버전·태그 이름은 [버전 규칙](../Agent/versioning.md#설치-도구와-콘텐츠-버전을-구분해요), 검사 범위는 [검증 기준](../Agent/testing.md), 선택 설치 데이터는 [레지스트리 지침](../Agent/registry.md)을 따라요.

지침 작성·일반 PR 병합·Storybook 배포만으로 npm에 게시하지 않아요. 실제 릴리스 요청이 있을 때 아래 절차를 실행해요. 이번 지침을 추가했다고 릴리스 자동화나 이미 게시된 버전의 기록이 복구되는 것은 아니에요.

## CLI와 UI 소스 콘텐츠를 배포해요

`packages/cli`의 설치 도구와 `packages/registry`의 생성기·소비 검사는 구현되어 있어요. 준비 PR을 병합했다고 npm·GitHub에 게시된 것으로 기록하지 않아요. 설치 도구에 전체 UI·하네스를 담거나 소스 설치를 위해 전체 UI 패키지를 먼저 게시·설치하는 조건을 두지 않아요.

### 1. 준비 PR에서 버전과 범위를 확정해요

최신 `main`에서 `release/v{버전}` 브랜치를 만들고 실제 npm 버전·태그와 기존 GitHub Release를 확인해요. `eli-design`의 E404 응답은 현재 조회 결과이며 패키지명에 대한 게시 권한까지 보장하지 않아요. 네트워크·인증 오류를 미게시로 판단하지 않아요.

```bash
npm view eli-design versions dist-tags --json
npm view @eli-design/ui versions dist-tags --json
gh release list
```

설치 도구는 `packages/cli/package.json`, 현재 콘텐츠는 `packages/ui/package.json`에서 버전을 정해요. 번호를 억지로 맞추지 않으며 콘텐츠 버전 변경만으로 기존 전체 UI 패키지를 npm에 게시하지 않아요. 고정된 pnpm으로 lockfile을 동기화하고, 실제 릴리스 대상만 CHANGELOG의 준비 중인 구역으로 옮겨요. 게시 날짜·최종 원본 SHA·게시 후 검사 결과를 미리 채우지 않아요.

초기 CLI는 레지스트리 규격 v1과 같은 프로젝트 내 단일 콘텐츠 버전을 지원해요. 업데이트·강제 덮어쓰기·React/폰트 자동 설치·MCP/하네스 연결을 제공한다고 안내하지 않아요. 기존 수정 파일을 보존하는 제한도 릴리스 노트에 남겨요.

### 2. 최종 후보를 한 번 만들고 고정해요

준비 PR 병합 후 깨끗한 `main`의 SHA를 고정해요. 그 SHA에서 고정 환경 설치, `pnpm check`, `pnpm test:registry`, `pnpm test:cli`, `pnpm test:cli:consumer`를 확인하고 필요한 브라우저·실기기 확인 범위를 기록해요. 같은 SHA의 성공 CI는 링크로 재사용할 수 있지만, 이전 기능 PR의 다른 SHA를 검사한 결과와 구분해요.

```bash
pnpm install --frozen-lockfile
pnpm build:registry
pnpm build:cli
node tests/cli/package-managers.mjs --prepare
```

이 준비 명령이 `.artifacts/cli-package-managers/`에 도구 tarball·`candidate.json`·`registry/` 스냅샷을 만들어요. `candidate.json`의 파일명·버전·SHA-256·크기와 스냅샷의 콘텐츠 버전·규격·모든 파일 해시를 확인해요. source SHA도 결과 기록에 함께 남겨요.

최종 tarball은 폴더를 다시 빌드해 게시하지 않고 이 파일을 그대로 사용해요. 고정한 후보로 아래 행렬을 실행하고, 실제 설치한 bin으로 같은 레지스트리 스냅샷의 Next.js SSR·hydration도 확인해요. 현재 `test:cli:consumer`는 작업 폴더의 CLI를 빌드해 검사하므로 최종 tarball 자체의 Next.js 검증을 완료한 것으로 표시하지 않아요.

```bash
node tests/cli/package-managers.mjs --all
```

고정 도구 준비·개별 행 재실행은 [CLI 실행 행렬](../Agent/package-managers.md#cli-실행-행렬도-구분해요)을 따라요. `pnpm test:cli:package-managers`와 `--prepare`는 후보를 새로 만들기 때문에 고정 뒤에 다시 실행하지 않아요. `pnpm size:cli`도 자체 후보의 참고 측정이며 실제 npm/CDN 전송량이나 최종 파일 검증을 대신하지 않아요. 소스나 후보 파일이 달라졌다면 새 후보로 검증해요.

### 3. 콘텐츠를 먼저 공개하고 로컬 CLI로 받아봐요

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

하네스 독립 배포와 MCP 응답 변경은 해당 담당자와 지원 범위를 맞춘 뒤 연결해요. 이 항목을 작성한 것만으로 배포 패키지명·태그·설치 안내가 전환된 것은 아니에요.

## 기존 전체 UI 패키지를 별도로 배포해요

아래 절차는 `@eli-design/ui`를 실제로 npm에 게시하기로 한 경우에만 적용해요. CLI·소스 콘텐츠 릴리스의 필수 단계가 아니에요.

### 1. 릴리스 준비 PR을 만들어요

1. 최신 `main`에서 `release/v{버전}` 브랜치를 만들어요. 한 릴리스 담당자가 시작부터 결과 기록까지 맡고 같은 패키지를 동시에 게시하지 않아요.
2. 아래 조회로 실제 게시 버전과 기존 `latest`·`next` 값을 기록해요. 조회 실패를 미게시로 판단하지 않아요. 이미 게시한 번호는 다시 쓰지 않아요.

```bash
npm view @eli-design/ui versions --json
npm view @eli-design/ui dist-tags --json
```

3. 직전 게시 이후의 변경과 `CHANGELOG.md`의 `Unreleased`를 대조하고 가장 큰 변경 유형으로 버전을 정해요. 이전 게시 커밋이 불명확하면 npm tarball의 코드·타입·CSS와 비교하고 미확인 내용을 남겨요. 최신 `main`을 과거 게시 원본으로 간주하지 않아요.
4. `packages/ui/package.json`의 버전을 한 번 갱신하고 고정된 pnpm으로 lockfile을 동기화해요. lockfile에 UI 버전 참조가 없다면 억지로 추가하지 않아요. CHANGELOG의 배포 대상 변경을 확정 버전 구역으로 옮기고 `Unreleased`는 다음 변경을 위해 남겨요.
5. 검사 결과, 예상 용량, 호환성·이전 방법과 미검증 범위를 PR에 기록해요. 기능 PR마다 수행한 검증과 최종 릴리스 검증을 구분해요. 검토 후 준비 PR을 `main`에 병합해요.

### 2. 배포 커밋과 파일을 고정해요

릴리스 준비 PR이 병합된 커밋 SHA를 배포 기준으로 기록하고 그 SHA의 깨끗한 작업 폴더를 사용해요. 로컬 미커밋 변경이 있거나 검사 후 새 코드가 섞였다면 게시하지 않아요. Node.js·pnpm은 저장소에 고정한 버전을 사용해요.

1. `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:browsers`, `pnpm test:package-managers`를 실행해요. 같은 SHA를 검사한 성공 CI로 대체한 항목은 실행 링크를 남겨요.
2. 레지스트리도 게시한다면 같은 SHA에서 `pnpm test:registry`를 실행하고 `pnpm build:registry`로 최종 JSON을 만들어요. 실제 Safari·Android·iOS·화면 낭독기 확인은 자동 검사와 구분해 기록해요. 검증에서 남긴 배포 전 필수 항목이 해결되지 않으면 중단해요.
3. 빌드를 완료한 상태에서 아래 명령으로 최종 tarball과 `npm pack`의 integrity·파일 수·크기 정보를 얻어요. `--ignore-scripts`를 사용해 패키징 중 재빌드를 막아요. 이 명령 자체가 빌드·검증을 대신하지는 않아요.

```bash
pnpm build
mkdir -p .artifacts/release
npm pack ./packages/ui --ignore-scripts --pack-destination .artifacts/release --json
```

4. 생성한 **바로 그 tarball**의 manifest·공개 파일·개발 파일 제외를 확인하고, 저장소 밖 임시 React 소비 프로젝트에 설치해 타입·빌드·CSS 연결과 필요한 상호작용을 확인해요. 설치할 때 React는 소비 앱이 선언하고 ELI는 생성한 파일의 절대 경로로 설치해요.
5. 검사한 tarball 경로와 integrity를 릴리스 기록에 남겨요. `pnpm test:packaging`, `test:next`, 패키지 매니저 검사도 각각 자체 tarball을 만들기 때문에 그 통과 결과만으로 최종 파일을 검사했다고 적지 않아요. 최종 파일을 직접 전달하는 검증은 현재 수동 절차이며 자동화되어 있다고 표시하지 않아요.

소스·lockfile·빌드 파일을 바꾸거나 후보를 다시 패키징하면 새 후보로 보고 다시 확인해요. `.artifacts`의 검사 파일을 정리할 때 고정한 게시 후보를 함께 삭제하지 않아요.

### 3. 게시한 버전을 확인한 뒤 일반 배포로 전환해요

아래의 버전·파일명·SHA 자리는 실제 확인한 값으로 바꿔 사용해요. 명령 형식은 설명용이며 자동 실행 스크립트가 아니에요.

| 순서 | 실행과 확인 |
| --- | --- |
| 후보 게시 | 검증한 tarball을 `npm publish <파일.tgz> --access public --tag next`로 게시해요. 소스 폴더에서 다시 빌드해 게시하지 않아요 |
| 게시 확인 | `npm view @eli-design/ui@<버전> version dist.integrity --json`으로 버전과 integrity를 대조해요. 임시 소비 앱에서 명시적 버전을 실제 설치해요 |
| Git 태그 | `ui-v<버전>`의 annotated tag를 고정한 배포 SHA에 만들고 원격에 게시해요. 콘텐츠의 `v<버전>`과 구분하며 같은 이름이 있으면 SHA를 비교하고, 다른 커밋이면 중단해요 |
| GitHub Release | 같은 태그에 CHANGELOG 기반 설명과 실제 검사 결과를 남겨요. 레지스트리를 제공하는 릴리스라면 고정해 둔 JSON 전부를 개별 asset으로 올리고 목록·해시·버전과 접근 가능 여부를 확인해요 |
| 일반 배포 승격 | 일반 버전의 모든 확인이 끝나면 `npm dist-tag add @eli-design/ui@<버전> latest`로 전환해요. beta·rc 같은 시험 버전은 `next`에만 남겨요 |
| 결과 확인 | `npm view @eli-design/ui dist-tags --json`을 다시 읽고 실제 태그 값을 확인해요. 문서 앱이 해당 버전을 제공할 준비가 됐을 때 배포하고, 실제로 공개한 기능과 준비 중인 MCP·하네스 연결을 구분해요 |

`next`로 게시하는 단계에서도 패키지는 공개되며 명시적 버전으로 설치할 수 있어요. 검사 실패로 `latest` 승격을 보류해도 같은 버전을 수정해 다시 게시할 수는 없어요.

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
