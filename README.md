# ELI

동아리 개발자를 위한 React 디자인 컴포넌트 라이브러리예요. `@eli/ui`를 한 번 설치하고 그룹별 경로에서 컴포넌트를 가져오는 사용 경험을 만들어요. 기본 CSS와 디자인 토큰은 컴포넌트가 내부에서 연결해요.

현재는 개발 환경과 패키징 검증을 준비하고 색상·타이포그래피·레이아웃 토큰 구현을 완료한 단계예요. Button·SnackBar·Toggle·Modal·Select·TextField·TextArea의 기본 구조와 디자인 상태를 구현했어요. Modal의 최종 최대 너비는 디자인 확정을 기다리고 있어요. 문서 사이트와 MCP는 아직 구현하지 않았어요. npm에도 게시하지 않았어요.

`@eli/ui`는 폰트 패밀리 토큰만 제공하고 Pretendard 파일이나 폰트 패키지를 포함하지 않아요. 추후 초기 설정 도구가 소비 프로젝트에 폰트를 한 번 설치하고 연결할 예정이에요. 현재는 소비 프로젝트가 Pretendard를 직접 불러와야 해요.

## 개발 환경을 준비해요

- Node.js **24.21.0**: `.node-version`과 같은 버전을 사용해요.
- pnpm **12.8.1**: 루트 `package.json`의 `packageManager`에 고정돼 있어요.
- TypeScript **5.9.3**, React **19.3.0**, Storybook **10.6.1**, Vite **8.3.2**를 기준으로 검증해요. 최신 TypeScript 7은 현재 린트 도구의 지원 범위 밖이라 사용하지 않아요.

사용하는 버전 관리 도구로 위 Node.js·pnpm 버전을 준비한 뒤 아래 명령을 실행해요. 버전 확인 결과가 다르면 먼저 개발 환경을 맞춰요.

```bash
node --version
pnpm --version
pnpm exec node --version
pnpm install --frozen-lockfile
pnpm dev
```

`node --version`과 `pnpm exec node --version`은 모두 `v24.21.0`, `pnpm --version`은 `12.8.1`이어야 해요. Storybook은 `http://localhost:6006`에서 열어요. Vite로 React 프로젝트를 따로 생성하지 않아도 개발용 React와 도구들이 함께 설치돼요.

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
| `pnpm size` | 다운로드 크기·압축 해제 크기·파일 수를 기록해요 |
| `pnpm check` | 위 검증을 한 번에 실행해요 |

용량 보고서는 `.artifacts/package-size.txt`와 `.artifacts/package-size.json`에서 확인해요. **ELI 패키지 자체 크기**이며 React·추가 의존성·브라우저 번들 크기는 포함하지 않아요. 초기 빈 패키지와 완성된 라이브러리의 크기는 달라요.

## 폴더 구조

`apps/`는 개발용 앱, `packages/`는 배포할 라이브러리를 관리해요.

```text
ELI/
├── .github/workflows/       # GitHub에서 실행하는 자동화 작업
├── Agent/                  # 구조·코드·검증·버전·협업 지침
├── apps/
│   └── storybook/          # 컴포넌트를 개발하고 디자인을 확인하는 앱
│       ├── .storybook/     # Storybook 실행과 미리보기 설정
│       └── stories/        # 컴포넌트 개발·확인 예제
├── packages/
│   └── ui/                 # npm으로 배포할 @eli/ui 패키지
│       └── src/
│           ├── button/     # Button 컴포넌트 그룹
│           ├── dim/        # 오버레이 컴포넌트가 공유하는 내부 Dim
│           ├── icon/       # 컴포넌트에서 재사용하는 내부 아이콘
│           ├── modal/      # Modal 컴포넌트 그룹
│           ├── select/     # Select 컴포넌트 그룹
│           ├── snackbar/   # SnackBar 컴포넌트 그룹
│           ├── text/       # TextField·TextArea 같은 텍스트 입력 컴포넌트 그룹
│           ├── toggle/     # Toggle 컴포넌트 그룹
│           └── tokens/     # 공통 색상·타이포그래피 토큰
├── scripts/                # 빌드·개발 환경·배포 용량 검사
└── tests/
    └── packaging/          # 패키지 설치·타입·CSS 연결 검증
```

새 컴포넌트는 `packages/ui/src/`의 해당 그룹 안에 PascalCase 폴더로 추가하고 그룹의 `index.ts`에서 공개해요. Storybook 예제는 `apps/storybook/stories/`, 동작 테스트는 컴포넌트 가까이에 둬요. 현재 `button/Button/`, `snackbar/SnackBar/`, `modal/Modal/`, `select/Select/`, `select/SelectOption/`, `text/TextField/`, `text/TextArea/`, `toggle/Toggle/`에는 각 컴포넌트의 타입·구조·스타일이 있어요. `dim/`과 `icon/`은 컴포넌트 내부에서 재사용하고, 별도 공개 경로를 제공하지 않아요. `tokens/`에는 완성된 색상·타이포그래피·레이아웃 토큰이 있어요.

공통 작업 규칙은 루트 `AGENTS.md`에서 안내하고, 상세 지침은 `Agent/`에서 관리해요. `node_modules/`, `dist/`, `storybook-static/`, `.artifacts/`는 자동 생성 폴더라 직접 수정하거나 Git에 올리지 않아요.

## 함께 작업해요

[AGENTS.md](AGENTS.md)에서 작업별 지침을 확인해요. [Git 규칙](Agent/branch.md)을 따르고 [검증 기준](Agent/testing.md)에 따라 PR에 실제 검사 결과와 용량을 기록해요. [버전 규칙](Agent/versioning.md)에 따라 예상 변경 유형도 적어요.

현재 패키지 라이선스는 `UNLICENSED`로 두고 공개 게시를 막아뒀어요. 배포 전에는 라이선스·npm scope 소유권·지원 환경을 확정해요. Next.js 소비 검증과 자동 배포는 후속 작업이에요.
