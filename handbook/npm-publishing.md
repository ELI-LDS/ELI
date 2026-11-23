# npm 담당자 안내

npm 담당자는 검증된 `eli-design` tarball의 게시와 배포 태그 변경만 맡아요. GitHub 콘텐츠·검증·파일 전달과 게시 후 동작 확인은 릴리스 준비자가 맡아요. CLI `eli-design@0.2.0`은 이미 게시됐어요. 다음 릴리스도 설치 도구를 대상으로 하며 `@eli-design/ui`를 다시 게시하거나 삭제하지 않아요.

이전 `@eli-design/ui` 게시 절차의 대상 폴더를 그대로 사용하지 않아요. 새 npm 대상은 **`packages/cli/package.json`의 `name: eli-design`**이에요. `main` 병합만으로 기존 게시 도구의 대상이 자동 변경되지는 않아요. 아래의 고정 tarball을 게시해요.

현재 게시 사실과 고정 파일은 [0.2.0 릴리스 기록](releases/0.2.0.md)을 확인해요. 아래 절차는 다음 릴리스용이며 이미 게시한 0.2.0을 다시 게시하지 않아요.

현재 게시 대상은 [CLI 0.3.0](releases/0.3.0.md)이에요. UI 콘텐츠 0.2.0 공개·최종 파일·공개 콘텐츠 소비 검증을 완료했고, [cli-v0.3.0](https://github.com/ELI-LDS/ELI/releases/tag/cli-v0.3.0)에 tarball·체크섬·검증 기록을 제공했어요. npm에는 아직 게시하지 않았어요. 별도로 전달했던 미게시 0.2.1은 과거 패치 후보이며 파일·검사 결과를 혼용하지 않아요.

## 전달받을 파일

[CLI Release 목록](https://github.com/ELI-LDS/ELI/releases)에서 `cli-v<도구 버전>`의 다음 파일을 받아요. 공개되지 않았거나 검증 완료 기록이 없으면 준비자에게 확인하고 기다려요.

- `eli-design-<버전>.tgz`: 그대로 게시할 npm 파일
- `SHA256SUMS`: 파일의 SHA-256
- `release.json`: 패키지·버전·고정 원본 SHA·SHA-512 integrity·콘텐츠 URL·검증 결과·미검증 범위

CLI Release가 있는 것만으로 npm에 게시됐다고 판단하지 않아요. 전달 파일과 원본 SHA는 버전별 [릴리스 기록](releases/0.2.0.md)에서도 확인해요. 소스 폴더에서 `npm publish`하거나 파일을 다시 패키징하지 않아요.

저장소 공개 전환은 저장소 담당자가 맡아요. 공개 콘텐츠의 익명 다운로드 검사가 통과한 뒤 npm 게시를 진행해요. 비공개 저장소에서 파일 전달을 끝냈더라도 일반 사용자 준비 완료로 보지 않아요. 하네스 선택 설치의 코드·파일 검사와 실제 에이전트 동작은 [하네스 완료 기준](../Agent/harness.md#새-설치-도구와-연결하는-완료-기준)으로 별도 확인해요. 하네스는 별도 `harness` 명령으로만 설치되고 원격 MCP 연결은 따로 확인해요.

## 1. 받은 파일과 게시 계정을 확인해요

아래 명령의 `<새 버전>`은 릴리스 기록에서 확정한 미게시 버전으로 바꿔요. 파일을 받은 폴더에서 Node.js `24.21.0` 환경의 npm을 사용해요.

```bash
shasum -a 256 -c SHA256SUMS
npm whoami
npm view eli-design versions dist-tags --json
```

해시가 다르면 중단해요. 기존 `@eli-design/ui`의 권한이 새 이름 `eli-design`의 권한을 보장하지는 않아요. 토큰·OTP는 문서나 저장소에 공유하지 않고 본인 npm 인증 절차를 사용해요. 같은 버전이 이미 존재하면 덮어쓰지 말고 준비자에게 알려요. 조회가 E404라면 미게시 이름인지 확인하고, 다른 인증·네트워크 오류는 미게시로 판단하지 않아요.

## 2. 검증된 파일을 next로 게시해요

```bash
npm publish ./eli-design-<새 버전>.tgz --ignore-scripts --access public --tag next
npm view eli-design@<새 버전> version dist.integrity --json
npm view eli-design dist-tags --json
```

`dist.integrity`를 `release.json`의 integrity와 비교해요. 게시 명령의 성공 여부가 불분명하면 같은 조회로 실제 결과부터 확인하고 재게시하지 않아요. `next`도 실제 공개 게시이며 게시된 버전은 수정해서 재사용할 수 없어요.

여기까지 끝나면 준비자에게 **게시한 버전과 integrity**를 전달해요. 준비자가 공개 명령의 선택·조합·전체 설치와 타입·CSS·SSR을 확인해요. 담당자가 검증 앱을 만들거나 GitHub 파일을 업로드할 필요는 없어요.

## 3. 공개 검증 통과 후 latest로 전환해요

준비자의 공개 검증 통과 결과를 받은 뒤 실행해요. 실패했거나 결과를 받지 못했다면 기존 태그를 유지해요.

```bash
npm dist-tag add eli-design@<새 버전> latest
npm view eli-design dist-tags --json
```

최종 태그와 게시 시각을 준비자에게 전달하면 준비자가 README·CHANGELOG·릴리스 기록을 마무리해요. `@eli-design/ui`는 종료 예정이에요. 실제 npm deprecate·삭제와 내부 연결 정리는 별도 작업이에요. UI 추가 명령이 하네스를 자동 설치하지 않으므로 기존 하네스 경로를 확인하기 전에는 정리하지 않아요.

전체 순서·검증 책임과 실패 후 처리는 [릴리스 절차](releasing.md)를 따라요.
