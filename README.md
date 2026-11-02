# ELI

동아리 개발자를 위한 React 디자인 컴포넌트 라이브러리예요. 현재는 `@eli/ui`를 한 번 설치하고 그룹별 경로에서 컴포넌트를 가져오는 사용 경험을 만들어요. 기본 CSS와 디자인 토큰은 컴포넌트가 내부에서 연결해요. 추후에는 shadcn/ui처럼 공통 `tokens/`와 원하는 컴포넌트 폴더만 소스로 추가하고, 관계없는 컴포넌트는 내려받지 않는 선택 설치 방식도 함께 제공할 예정이에요.

현재는 개발 환경과 패키징 검증을 준비하고 색상·타이포그래피·레이아웃 토큰 구현을 완료한 단계예요. Alert·Badge·Button·IconButton·Chip·RemovableChip·FilterChip·Checkbox·Divider·Fab·FabMenu·LoadingIndicator·ProgressIndicator·MenuItem·NavigationBar·NavigationBarItem·NavigationDrawer·NavigationDrawerMenu·NavigationDrawerItem·SnackBar·Toggle·Tooltip·Modal·Select·SegmentControl·Slider·Tab·TextField·TextArea의 기본 구조와 디자인 상태를 구현했어요. Modal의 최종 최대 너비는 디자인 확정을 기다리고 있어요. 선택 컴포넌트 레지스트리·CLI, 문서 사이트와 MCP는 아직 구현하지 않았어요. npm에도 게시하지 않았어요.

`@eli/ui`는 폰트 패밀리 토큰만 제공하고 Pretendard 파일이나 폰트 패키지를 포함하지 않아요. 추후 초기 설정 도구가 소비 프로젝트에 폰트를 한 번 설치하고 연결할 예정이에요. 현재는 소비 프로젝트가 Pretendard를 직접 불러와야 해요.

## 개발 환경을 준비해요

- Node.js **24.21.0**: `.node-version`과 같은 버전을 사용해요.
- pnpm **12.8.1**: 루트 `package.json`의 `packageManager`에 고정돼 있어요.
- TypeScript **5.9.3**, React **19.3.0**, Next.js **16.4.3**, Storybook **10.6.1**, Vite **8.3.2**를 기준으로 검증해요. 최신 TypeScript 7은 현재 린트 도구의 지원 범위 밖이라 사용하지 않아요.

사용하는 버전 관리 도구로 위 Node.js·pnpm 버전을 준비한 뒤 아래 명령을 실행해요. 버전 확인 결과가 다르면 먼저 개발 환경을 맞춰요.

```bash
node --version
pnpm --version
pnpm exec node --version
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

`node --version`과 `pnpm exec node --version`은 모두 `v24.21.0`, `pnpm --version`은 `12.8.1`이어야 해요. Chromium은 브라우저 소비 검증에만 사용하며 배포 패키지에는 포함되지 않아요. Storybook은 `http://localhost:6006`에서 열어요. Vite로 React 프로젝트를 따로 생성하지 않아도 개발용 React와 도구들이 함께 설치돼요.

다른 Node.js나 pnpm 버전은 설치 검사에서 거절해요. `pnpm-lock.yaml`을 삭제하거나 peer 검사를 끄는 방식으로 충돌을 해결하지 않아요. 도구 버전 변경은 별도 변경으로 검증해요.

## 명령어

아래 명령은 개발 환경을 맞춘 뒤 저장소 루트에서 실행해요.

| 명령 | 하는 일 |
| --- | --- |
| `pnpm dev` | Storybook에서 컴포넌트를 개발해요 |
| `pnpm build` | ESM·타입·CSS 배포 파일을 만들어요 |
| `pnpm typecheck` | 코드와 예제의 타입을 확인해요 |
| `pnpm lint` | 코드 규칙을 확인해요 |
| `pnpm build:storybook` | Storybook 정적 페이지를 만들어요 |
| `pnpm test:packaging` | tarball·공개 경로·소비 앱·CSS 연결을 확인해요 |
| `pnpm test:package-managers` | 같은 tarball을 npm·pnpm·Yarn Classic·Yarn Modern·Bun에서 설치하고 타입·Vite 빌드를 확인해요 |
| `pnpm test:performance` | Select 긴 목록과 Checkbox 100개 변경의 브라우저 성능 기준선을 측정해요 |
| `pnpm test:browser` | 실제 tarball 소비 화면의 상호작용·키보드·계산 스타일·axe 접근성을 확인해요 |
| `pnpm test:browsers` | Chromium·Firefox·WebKit과 Android·iOS 기기 조건에서 같은 소비 화면을 확인해요 |
| `pnpm test:next` | 실제 tarball의 Next.js App Router 빌드·서버 렌더링·hydration·CSS 연결을 확인해요 |
| `pnpm size` | 다운로드 크기·압축 해제 크기·파일 수를 기록해요 |
| `pnpm check` | 타입·린트·Storybook·브라우저·Next.js·용량의 일상 핵심 검증을 실행해요 |

용량 보고서는 `.artifacts/package-size.txt`와 `.artifacts/package-size.json`에서 확인해요. **ELI 패키지 자체 크기**이며 React·추가 의존성·브라우저 번들 크기는 포함하지 않아요. 초기 빈 패키지와 완성된 라이브러리의 크기는 달라요.

패키지 매니저·브라우저 전체 행렬과 성능 기준선은 실행 비용이 커서 일반 `pnpm check`에 중복하지 않아요. 관련 파일이 바뀌거나 릴리스를 준비할 때 각각의 전용 명령과 자동 행렬을 확인해요. 브라우저 행렬의 모바일 대상은 기기 조건을 에뮬레이션하므로 실제 iOS Safari와 Android Chrome 확인을 대신하지 않아요.

## 폴더 구조

`apps/`는 개발용 앱, `packages/`는 배포할 라이브러리를 관리해요.

```text
ELI/
├── .github/workflows/       # GitHub에서 실행하는 자동화 작업
├── Agent/                  # 구조·코드·검증·버전·협업 지침
├── handbook/               # 팀 내부 협업 가이드·개선 제안·감사 보고서
├── apps/
│   └── storybook/          # 컴포넌트를 개발하고 디자인을 확인하는 앱
│       ├── .storybook/     # Storybook 실행과 미리보기 설정
│       └── stories/        # 컴포넌트 개발·확인 예제
├── packages/
│   └── ui/                 # npm으로 배포할 @eli/ui 패키지
│       └── src/
│           ├── {group}/    # 공개 컴포넌트를 역할별로 묶은 그룹
│           ├── dim/        # 오버레이 컴포넌트가 공유하는 내부 Dim
│           ├── icon/       # 컴포넌트에서 재사용하는 내부 아이콘
│           └── tokens/     # 공통 색상·타이포그래피 토큰
├── scripts/                # 빌드·개발 환경·배포 용량 검사
└── tests/
    ├── browser/            # 실제 브라우저 상호작용·접근성 검증
    ├── next/               # Next.js App Router 소비 검증
    ├── package-managers/   # 소비자 패키지 매니저 호환성 검증
    ├── performance/        # 실제 브라우저 상호작용 성능 기준선
    └── packaging/          # 패키지 설치·타입·CSS 연결 검증
```

새 컴포넌트는 `packages/ui/src/`의 해당 그룹 안에 PascalCase 폴더로 추가하고 그룹의 `index.ts`에서 공개해요. Storybook 예제는 `apps/storybook/stories/`, 소스 단위 테스트는 컴포넌트 가까이, 실제 소비 환경의 통합 검사는 `tests/`에 둬요. 실제 공개 그룹 경로는 `packages/ui/package.json`의 `exports`에서 확인해요. `dim/`과 `icon/`은 컴포넌트 내부에서 재사용하고 별도 공개 경로를 제공하지 않아요. `tokens/`에는 공통 색상·타이포그래피·레이아웃 토큰이 있어요.

공통 작업 규칙은 루트 `AGENTS.md`에서 안내하고, 상세 지침은 `Agent/`에서 관리해요. `node_modules/`, `dist/`, `storybook-static/`, `.artifacts/`는 자동 생성 폴더라 직접 수정하거나 Git에 올리지 않아요.

## Storybook을 배포해요

[Storybook](https://eli-storybook.jihong.dev)은 `main`에 변경 사항이 반영될 때 Cloudflare Worker에서 새로 빌드해요. 설정과 확인 방법은 [Storybook 배포 설정](Agent/testing.md#storybook-배포를-확인해요)을 참고해요. npm 패키지 배포는 아직 자동화하지 않았어요.

## 함께 작업해요

[AGENTS.md](AGENTS.md)에서 작업별 지침을 확인해요. [Git 규칙](Agent/branch.md)을 따르고 [검증 기준](Agent/testing.md)에 따라 PR에 실제 검사 결과와 용량을 기록해요. [버전 규칙](Agent/versioning.md)에 따라 예상 변경 유형도 적어요.

디자인 전달과 공동 검토 방법은 [디자이너 협업 가이드](handbook/designer-guide.md)에서 확인해요. 앞으로 논의할 작업은 [개선 제안](handbook/improvements.md)에 정리하고, 특정 시점의 점검 결과는 `handbook/audits/`에 보관해요. 개선 제안의 확정 여부와 진행 상태는 현재 적용 중인 지침과 구분해요. `handbook/`은 팀 내부 문서를 관리하고, 추후 사용자용 문서 사이트는 `apps/docs`에서 별도로 관리할 예정이에요.

현재 패키지 라이선스는 `UNLICENSED`로 두고 공개 게시를 막아뒀어요. 배포 전에는 라이선스·npm scope 소유권·지원 환경을 확정해요. npm 자동 배포는 후속 작업이에요.
