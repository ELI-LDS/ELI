# ELI

동아리 개발자가 제품의 기능 구현에 집중할 수 있도록 만든 React 디자인 컴포넌트 라이브러리예요.

[Storybook에서 컴포넌트 보기](https://eli-storybook.jihong.dev) · [사용 예시](packages/ui/README.md) · [기여 방법](#함께-개발해요)

> **개발 중인 라이브러리예요.** 현재 버전은 `0.1.0`이며 npm에는 아직 게시하지 않았어요. 라이선스와 npm scope 소유권을 확정하기 전까지 외부 서비스의 프로덕션 의존성으로 사용하지 않아요.

## ELI를 사용하는 이유

- 컴포넌트만 import하면 기본 CSS와 디자인 토큰이 함께 연결돼요.
- `@eli/ui/button`처럼 역할별 경로에서 필요한 컴포넌트를 가져와요.
- `className`과 `style`로 일반 CSS, CSS Modules, Tailwind CSS, Emotion, vanilla-extract 스타일을 적용할 수 있어요.
- Vite와 Next.js App Router의 빌드·SSR·hydration을 실제 패키지 tarball로 확인해요.
- React를 패키지에 중복해서 넣지 않고 소비 앱의 React를 peer dependency로 공유해요.

## 빠르게 확인해요

구현된 컴포넌트와 상태는 [ELI Storybook](https://eli-storybook.jihong.dev)에서 확인할 수 있어요.

- `한눈에 보기`: 형태·크기·색상·상태를 함께 비교해요.
- `직접 바꿔보기`: 문구와 공개 props를 Controls에서 바꿔봐요.

### 설치 명령은 npm 게시 후 사용할 수 있어요

ELI가 npm에 게시되면 사용하는 패키지 매니저에 맞춰 하나의 명령만 실행해요.

```bash
# npm
npm install @eli/ui

# pnpm
pnpm add @eli/ui

# Yarn
yarn add @eli/ui

# Bun
bun add @eli/ui
```

ELI는 React `^19.3.0`을 peer dependency로 사용해요. 기존 React 프로젝트라면 React를 다시 설치할 필요가 없어요.

### 컴포넌트를 사용해요

```tsx
import { Button } from '@eli/ui/button';

export function SaveButton() {
  return (
    <Button icon={null} onClick={() => console.log('저장했어요')}>
      저장하기
    </Button>
  );
}
```

별도의 ELI CSS 파일을 import하지 않아도 Button의 기본 스타일과 공통 토큰이 함께 연결돼요.

### 필요한 스타일만 덮어써요

```tsx
import { Button } from '@eli/ui/button';

export function FullWidthButton() {
  return (
    <Button
      className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800"
      icon={null}
    >
      계속하기
    </Button>
  );
}
```

`className`은 루트 요소에 전달돼요. 상태가 있는 스타일을 바꿀 때는 Default뿐 아니라 Hover·Pressed·Disabled 상태도 함께 확인해요. CSS Modules와 CSS-in-JS도 생성한 클래스 이름을 같은 prop에 전달하면 돼요. 더 많은 예시는 [`@eli/ui` 패키지 안내](packages/ui/README.md)에서 확인해요.

## 제공하는 컴포넌트

공개 import 경로는 다음과 같아요. 각 경로의 최신 props와 디자인 상태는 Storybook과 에디터의 JSDoc에서 확인해요.

| 가져오는 경로 | 컴포넌트 |
| --- | --- |
| `@eli/ui/alert` | `Alert` |
| `@eli/ui/badge` | `Badge` |
| `@eli/ui/button` | `Button`, `IconButton` |
| `@eli/ui/checkbox` | `Checkbox` |
| `@eli/ui/chip` | `Chip`, `FilterChip`, `RemovableChip` |
| `@eli/ui/divider` | `Divider` |
| `@eli/ui/fab` | `Fab`, `FabMenu`, `FabMenuSegment` |
| `@eli/ui/loading` | `LoadingIndicator`, `ProgressIndicator` |
| `@eli/ui/menu` | `MenuItem` |
| `@eli/ui/modal` | `Modal` |
| `@eli/ui/navigation` | `NavigationBar`, `NavigationBarItem`, `NavigationDrawer`, `NavigationDrawerCategory`, `NavigationDrawerMenu`, `NavigationDrawerItem` |
| `@eli/ui/radio` | `Radio` |
| `@eli/ui/segment-control` | `SegmentControl` |
| `@eli/ui/select` | `Select` |
| `@eli/ui/slider` | `Slider` |
| `@eli/ui/snackbar` | `SnackBar` |
| `@eli/ui/tab` | `Tab` |
| `@eli/ui/text` | `TextField`, `TextArea` |
| `@eli/ui/toggle` | `Toggle` |
| `@eli/ui/tooltip` | `Tooltip` |

Modal의 최종 최대 너비는 디자인 확정을 기다리고 있어요. 확정되지 않은 값을 임의로 공개 계약으로 만들지 않아요.

## 폰트를 연결해요

ELI의 기본 글꼴은 Pretendard Variable이에요. 패키지 크기와 소비 앱의 폰트 정책을 분리하기 위해 폰트 파일이나 CDN import는 포함하지 않아요.

소비 앱에서 Pretendard Variable을 한 번 불러오면 ELI의 폰트 토큰이 이를 사용해요. 폰트를 불러오지 않은 환경에서는 Pretendard와 시스템 글꼴 순서로 대체해요. 폰트 초기 설정 도구는 후속 작업으로 제공할 예정이에요.

## 지원 환경

| 영역 | 기준 |
| --- | --- |
| React | `^19.3.0` |
| 모듈 | ESM과 TypeScript 타입 선언 |
| 프레임워크 | Vite, Next.js App Router 소비 검증 |
| 데스크톱 브라우저 | 최신 안정 Chrome, Edge, Safari, Firefox 지원 목표 |
| 모바일 웹 | Android Chrome, iOS Safari 지원 목표 |
| 패키지 매니저 | npm, pnpm, Yarn Classic, Yarn Modern `node-modules`·PnP, Bun |

브라우저 자동 검사는 실제 Chrome·Edge와 Playwright의 Chromium·Firefox·WebKit에서 실행해요. Android와 iOS 조건은 자동 에뮬레이션하며, 실제 기기의 터치·가상 키보드·보조 기술 확인과 구분해요.

## 저장소에서 개발해요

ELI 자체를 개발할 때는 Vite 프로젝트를 따로 만들지 않아요. 저장소를 내려받으면 Storybook과 개발용 React가 함께 설치돼요.

### 필요한 환경

- Node.js `24.21.0`
- pnpm `12.8.1`

```bash
git clone https://github.com/ELI-LDS/ELI.git
cd ELI
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Storybook은 `http://localhost:6006`에서 열려요. Node.js와 pnpm 버전은 `.node-version`과 루트 `package.json`에 고정돼 있어요.

### 자주 사용하는 명령

| 명령 | 하는 일 |
| --- | --- |
| `pnpm dev` | Storybook 개발 서버를 실행해요 |
| `pnpm dev:docs` | 문서·랜딩 페이지 Next.js 개발 서버를 실행해요 |
| `pnpm build:docs` | 문서·랜딩 페이지를 프로덕션 빌드해요 |
| `pnpm build` | ESM·타입·CSS 배포 파일을 만들어요 |
| `pnpm typecheck` | TypeScript 타입을 확인해요 |
| `pnpm lint` | 코드 규칙을 확인해요 |
| `pnpm test:packaging` | tarball의 공개 경로·SSR·CSS 연결을 확인해요 |
| `pnpm test:browser` | Chromium에서 상호작용·접근성·계산 스타일을 확인해요 |
| `pnpm test:browsers` | 브라우저 엔진과 모바일 기기 조건을 함께 확인해요 |
| `pnpm test:next` | Next.js App Router 소비 환경을 확인해요 |
| `pnpm test:package-managers` | 지원 패키지 매니저의 설치와 소비 빌드를 확인해요 |
| `pnpm size` | 패키지 압축 크기·압축 해제 크기·파일 수를 기록해요 |
| `pnpm check` | 일상 핵심 검증을 순서대로 실행해요 |

전체 검사 범위와 실행 기준은 [검증 지침](Agent/testing.md)에서 확인해요.

## 프로젝트 구조

```text
ELI/
├── Agent/              # 개발·검증·배포 규칙
├── handbook/           # 팀 내부 협업 가이드와 점검 기록
├── apps/docs/          # 문서·랜딩 페이지 Next.js 앱 (초기 셋업)
├── apps/storybook/     # 컴포넌트 개발·디자인 확인 앱
├── packages/ui/        # 배포할 @eli/ui 소스
├── scripts/            # 빌드와 패키지 검사 도구
└── tests/              # 소비 환경·브라우저·성능 검사
```

`packages/ui`만 `@eli/ui`로 배포해요. Storybook과 테스트 도구는 배포 패키지에 포함하지 않아요. 자세한 구조는 [프로젝트 구조 지침](Agent/architecture.md)에서 확인해요.

## 로드맵

현재 패키지 방식은 `@eli/ui`를 한 번 설치하고 그룹 경로에서 컴포넌트를 가져오는 구조예요. 다음 기능은 아직 구현되지 않았어요.

- 원하는 컴포넌트와 필요한 토큰만 소스로 추가하는 레지스트리·CLI
- Pretendard 초기 설정 도구
- 사용자용 문서 사이트와 한글 가이드
- MCP 도구
- npm 게시와 자동 배포

예정된 기능을 현재 사용할 수 있는 기능처럼 안내하지 않아요. 논의 중인 개선안은 [개선 제안](handbook/improvements.md)에서 확인할 수 있어요.

## 함께 개발해요

1. [AGENTS.md](AGENTS.md)에서 작업에 맞는 지침을 확인해요.
2. 최신 `main`에서 목적에 맞는 브랜치를 만들어요.
3. 변경 위험도에 맞는 검증을 실행해요.
4. 한국어 Conventional Commit과 PR 규칙을 따라요.

세부 절차는 [Git 규칙](Agent/branch.md), 컴포넌트 구현은 [컴포넌트 지침](Agent/components.md), 디자인 전달은 [디자이너 협업 가이드](handbook/designer-guide.md)를 참고해요.

## 라이선스

현재 `UNLICENSED`예요. 공개 라이선스를 확정하기 전에는 npm에 게시하지 않아요.
