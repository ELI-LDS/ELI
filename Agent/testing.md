# 검증 기준

## 기본 검사를 실행해요

고정한 Node.js·pnpm 환경에서 `pnpm install --frozen-lockfile`로 설치해요. 코드·설정 변경 후 `pnpm check`를 실행해요. 이 명령은 타입 검사, 린트, Storybook 빌드, 패키징 검사, 용량 측정을 순서대로 실행해요.

문서만 바뀌었다면 링크·명령어·규칙의 일관성을 확인해요. 하지 않은 검사를 통과했다고 적지 않아요.

## 소비자 입장에서 확인해요

`pnpm test:packaging`은 실제 tarball의 크기·파일 목록·공개 경로를 확인해요. 비공개 소비 앱에 tarball을 설치하고, 별도 CSS import 없이 Vite에서 Badge·Button·IconButton·Chip·Checkbox·SnackBar·Modal·Select·TextField·TextArea·Toggle CSS와 토큰이 연결되는지 확인해요.

검증용 소비 앱은 저장소의 개발용 React·Vite를 사용해요. React 버전별 독립 설치나 Next.js 호환 검증을 대신하지 않아요. 테스트·Storybook이 실제 tarball에 들어가면 실패해요.

`pnpm dev`로 Storybook의 Badge·Button·Chip·Checkbox·Divider·IconButton·MenuItem·Modal·Select·SnackBar·TextArea·TextField·Toggle 예제를 열어 기본 스타일·상태·커스터마이징을 확인해요. 상호작용·키보드·접근성 자동 검사는 아직 없어요.

현재 `pnpm check`는 컴포넌트 단위 테스트를 실행하지 않아요. 실제 컴포넌트와 `.test.tsx`를 추가할 때 테스트 실행 도구와 명령도 함께 구성해요. `.storybook`의 설정 파일은 통합 타입 검사에 포함해요.

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

실제 배포 전에는 `pnpm test:packaging`으로 생성한 원본 tarball도 확인해요. 게시 작업과 배포 자동화는 현재 설정하지 않아요.
