# 릴리스 절차

아래 번호가 붙은 명령 절차는 현재 실험 패키지 `@eli-design/ui`의 수동 npm 릴리스 기준이에요. 설치 도구와 소스 배포까지 자동으로 적용되는 절차로 해석하지 않아요. 버전 정책은 [버전 규칙](../Agent/versioning.md), 검사 범위는 [검증 기준](../Agent/testing.md), 선택 설치 데이터는 [레지스트리 지침](../Agent/registry.md)을 따라요.

지침 작성·일반 PR 병합·Storybook 배포만으로 npm에 게시하지 않아요. 실제 릴리스 요청이 있을 때 아래 절차를 실행해요. 이번 지침을 추가했다고 릴리스 자동화나 이미 게시된 버전의 기록이 복구되는 것은 아니에요.

## 목표 소스 배포의 릴리스 준비

`eli-design`은 설치 도구의 목표 이름이고 아직 구현·게시되지 않았어요. 구현 후에는 도구의 최종 tarball과 지원 규격·콘텐츠 범위를 검증하고 게시하는 절차를 별도로 구체화해요. 도구에 전체 UI·하네스를 담거나 소스 설치를 위해 전체 UI 패키지를 먼저 게시·설치하는 조건을 두지 않아요.

콘텐츠는 원본 커밋·콘텐츠 버전·규격 버전·항목별 해시를 고정해 GitHub Release로 제공해요. 도구 버전과 콘텐츠 버전을 같게 만들기 위해 불필요하게 재배포하지 않아요. 실제 게시 기록에는 각각의 버전·커밋·검증 파일과 연결 관계를 남겨요. 현재의 UI tarball 검사만으로 후속 설치 도구의 다운로드·쓰기·소스 설치 검증을 통과했다고 적지 않아요.

하네스 독립 배포와 MCP 응답 변경은 해당 담당자와 지원 범위를 맞춘 뒤 연결해요. 이 항목을 작성한 것만으로 배포 패키지명·태그·설치 안내가 전환된 것은 아니에요.

## 1. 릴리스 준비 PR을 만들어요

1. 최신 `main`에서 `release/v{버전}` 브랜치를 만들어요. 한 릴리스 담당자가 시작부터 결과 기록까지 맡고 같은 패키지를 동시에 게시하지 않아요.
2. 아래 조회로 실제 게시 버전과 기존 `latest`·`next` 값을 기록해요. 조회 실패를 미게시로 판단하지 않아요. 이미 게시한 번호는 다시 쓰지 않아요.

```bash
npm view @eli-design/ui versions --json
npm view @eli-design/ui dist-tags --json
```

3. 직전 게시 이후의 변경과 `CHANGELOG.md`의 `Unreleased`를 대조하고 가장 큰 변경 유형으로 버전을 정해요. 이전 게시 커밋이 불명확하면 npm tarball의 코드·타입·CSS와 비교하고 미확인 내용을 남겨요. 최신 `main`을 과거 게시 원본으로 간주하지 않아요.
4. `packages/ui/package.json`의 버전을 한 번 갱신하고 고정된 pnpm으로 lockfile을 동기화해요. lockfile에 UI 버전 참조가 없다면 억지로 추가하지 않아요. CHANGELOG의 배포 대상 변경을 확정 버전 구역으로 옮기고 `Unreleased`는 다음 변경을 위해 남겨요.
5. 검사 결과, 예상 용량, 호환성·이전 방법과 미검증 범위를 PR에 기록해요. 기능 PR마다 수행한 검증과 최종 릴리스 검증을 구분해요. 검토 후 준비 PR을 `main`에 병합해요.

## 2. 배포 커밋과 파일을 고정해요

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

## 3. 게시한 버전을 확인한 뒤 일반 배포로 전환해요

아래의 버전·파일명·SHA 자리는 실제 확인한 값으로 바꿔 사용해요. 명령 형식은 설명용이며 자동 실행 스크립트가 아니에요.

| 순서 | 실행과 확인 |
| --- | --- |
| 후보 게시 | 검증한 tarball을 `npm publish <파일.tgz> --access public --tag next`로 게시해요. 소스 폴더에서 다시 빌드해 게시하지 않아요 |
| 게시 확인 | `npm view @eli-design/ui@<버전> version dist.integrity --json`으로 버전과 integrity를 대조해요. 임시 소비 앱에서 명시적 버전을 실제 설치해요 |
| Git 태그 | `v<버전>`의 annotated tag를 고정한 배포 SHA에 만들고 원격에 게시해요. 같은 이름이 있으면 SHA를 비교하고, 다른 커밋이면 중단해요 |
| GitHub Release | 같은 태그에 CHANGELOG 기반 설명과 실제 검사 결과를 남겨요. 레지스트리를 제공하는 릴리스라면 고정해 둔 JSON 전부를 개별 asset으로 올리고 목록·해시·버전과 접근 가능 여부를 확인해요 |
| 일반 배포 승격 | 일반 버전의 모든 확인이 끝나면 `npm dist-tag add @eli-design/ui@<버전> latest`로 전환해요. beta·rc 같은 시험 버전은 `next`에만 남겨요 |
| 결과 확인 | `npm view @eli-design/ui dist-tags --json`을 다시 읽고 실제 태그 값을 확인해요. 문서 앱이 해당 버전을 제공할 준비가 됐을 때 배포하고, 아직 없는 CLI·MCP 기능을 제공한다고 안내하지 않아요 |

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
