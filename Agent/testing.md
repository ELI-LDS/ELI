# 검증 기준

## 기본 검사를 실행해요

고정한 Node.js·pnpm 환경에서 `pnpm install --frozen-lockfile`로 설치해요. 코드·설정 변경 후 `pnpm check`를 실행해요. 이 명령은 타입 검사, 린트, Storybook 빌드, 패키징 검사, 용량 측정을 순서대로 실행해요.

문서만 바뀌었다면 링크·명령어·규칙의 일관성을 확인해요. 하지 않은 검사를 통과했다고 적지 않아요.

## 소비자 입장에서 확인해요

`pnpm test:packaging`은 실제 tarball의 크기·파일 목록·공개 경로를 확인해요. 비공개 소비 앱에 tarball을 설치하고, 별도 CSS import 없이 Vite에서 Alert·Badge·Button·IconButton·Chip·RemovableChip·FilterChip·Checkbox·SnackBar·Modal·Select·SegmentControl·TextField·TextArea·Toggle CSS와 토큰이 연결되는지 확인해요.

같은 tarball을 SSR용으로 번들하고 모든 공개 컴포넌트를 `react-dom/server`로 렌더링해 브라우저 전역 없이 초기 HTML을 만들 수 있는지 확인해요. Hook이나 사용자 이벤트가 있는 컴포넌트는 배포 JS 첫 줄에 `'use client'`가 유지되는지도 확인해요. 이 검증은 공통 SSR 안전성을 확인하며 Next.js·Remix 같은 프레임워크별 통합 테스트를 대신하지 않아요.

검증용 소비 앱은 저장소의 개발용 React·React DOM·Vite를 사용해요. React 버전별 독립 설치나 프레임워크별 라우팅·RSC·hydration 검증을 대신하지 않아요. 테스트·Storybook이 실제 tarball에 들어가면 실패해요.

`pnpm dev`로 Storybook의 Alert·Badge·Button·Chip·RemovableChip·FilterChip·Checkbox·Divider·IconButton·MenuItem·Modal·Select·SegmentControl·SnackBar·TextArea·TextField·Toggle 예제를 열어 기본 스타일·상태·커스터마이징을 확인해요. 상호작용·키보드·접근성 자동 검사는 아직 없어요.

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

실제 npm 배포 전에는 `pnpm test:packaging`으로 생성한 원본 tarball도 확인해요. npm 게시와 배포 자동화는 현재 설정하지 않아요.

## Storybook 배포를 확인해요

Cloudflare Workers Builds는 연결된 Git 저장소의 `main` 푸시마다 Storybook을 빌드하고 `wrangler.jsonc`에 지정된 정적 파일을 기존 Worker `eli-lds-storybook`에 배포해요. 작업 브랜치의 빌드를 막으려면 Cloudflare의 Preview Builds를 꺼요. 프로젝트 규칙대로 PR을 병합하면 `main`에 푸시되지만, `main`에 직접 푸시해도 빌드가 실행돼요.

Cloudflare 대시보드에서 **Workers & Pages → eli-lds-storybook → Settings → Build**를 열어 Git 저장소가 `ELI-LDS/ELI`, 프로덕션 브랜치가 `main`, 루트 디렉터리가 저장소 루트인지 확인해요. **Build command**는 `pnpm build:storybook`, **Deploy command**는 `npx wrangler deploy`로 지정하고 **Enable Preview Builds**를 꺼요. **Build Variables and Secrets**에 일반 변수 `PNPM_VERSION=12.8.1`을 추가해요. Node.js는 저장소 루트의 `.node-version`을 따라요. GitHub Actions 비밀 값은 필요 없어요.

설정을 마친 뒤 PR을 `main`에 병합해 Cloudflare **Deployments**에서 빌드 성공과 `https://eli-storybook.jihong.dev`의 실제 Storybook 화면을 확인해요. 실패한 빌드는 설정을 수정한 후 **Retry**로 다시 실행할 수 있어요. 이 설정은 npm 패키지를 게시하지 않아요.
