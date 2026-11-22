# eli-design

필요한 ELI React 컴포넌트만 프로젝트에 추가해요. 컴포넌트와 함께 필요한 토큰·아이콘도 가져오고, 추가한 코드는 직접 수정할 수 있어요.

> 아래의 짧은 import 경로와 `components/eli` 기본 위치는 다음 CLI·UI 콘텐츠 릴리스에 반영할 변경이에요. 이미 설치한 소스는 `status`와 설치 기록의 경로를 사용해요.

## 시작하기

기존 React 프로젝트의 루트에서 실행해요. CLI를 전역으로 설치할 필요는 없어요.

```bash
npx eli-design@latest init
npx eli-design@latest add button
```

- Node.js: 24.21.0 이상의 24.x 또는 26 이상
- UI를 추가할 프로젝트: React `^19.3.0` 설치 필요
- npm·pnpm·Yarn·Bun 프로젝트에서 사용할 수 있어요.

## 컴포넌트 사용하기

기본 경로는 `src` 폴더가 있으면 `src/components/eli`, 없으면 `components/eli`예요. 설치가 끝나면 출력되는 파일 경로에서 import해요.

아래는 `src/App.tsx`에서 Button을 사용하는 예시예요.

```tsx
import { Button } from './components/eli/button';

export default function App() {
  return <Button onClick={() => console.log('저장하기')}>저장하기</Button>;
}
```

기본 CSS와 토큰은 함께 연결돼 있어 별도로 import하지 않아도 돼요. Pretendard 폰트는 앱에서 직접 불러와요.

기존 `@/* → src/*` 별칭이 설정된 앱에서는 `@/components/eli/button`으로 가져올 수도 있어요. CLI가 별칭이나 TypeScript·빌드 설정을 추가·변경하지 않아요.

## 다른 컴포넌트 추가하기

사용할 수 있는 컴포넌트를 확인해요.

```bash
npx eli-design@latest list
```

하나씩 또는 여러 개를 함께 추가할 수 있어요. 필요한 하위 컴포넌트와 공통 파일도 함께 추가해요.

```bash
npx eli-design@latest add select
npx eli-design@latest add modal select
```

전체 컴포넌트가 필요할 때만 `--all`을 사용해요. 하네스는 포함하지 않아요.

```bash
npx eli-design@latest add --all
```

## 설치 위치 바꾸기

원하는 위치가 있다면 초기화할 때만 지정해요.

```bash
npx eli-design@latest init --dir src/shared/ui
```

기존 설정과 소스를 자동으로 이동하지 않아요. `eli.json`, `eli.lock.json`과 추가한 소스를 Git에 함께 저장해요.

## 설치 상태 확인하기

설치한 컴포넌트와 파일의 수정·누락 여부를 확인해요. 같은 파일은 재사용하고 사용자가 수정한 파일은 덮어쓰지 않아요.

```bash
npx eli-design@latest status
```

파일을 추가하기 전에 변경 내용을 미리 볼 수도 있어요.

```bash
npx eli-design@latest add modal --dry-run
```

`@latest`는 실행 도구의 최신 버전을 사용한다는 뜻이에요. 이미 추가한 컴포넌트 소스를 자동으로 업데이트하지는 않아요.

## AI 에이전트용 하네스 설치하기

Claude Code·Codex에서 사용할 스킬과 훅은 따로 선택해요. 하네스만 설치할 때는 React나 UI 초기 설정이 필요하지 않아요.

```bash
# Claude Code
npx eli-design@latest harness --agent claude

# Codex
npx eli-design@latest harness --agent codex

# 둘 다 사용하기
npx eli-design@latest harness --agent all
```

기존 에이전트 설정을 보존하며 훅을 추가해요. 설치 후 표시되는 안내에 따라 스킬을 다시 불러오고, Codex는 `/hooks`에서 훅을 확인·신뢰해요. 원격 MCP는 별도로 연결해야 해요.

설치 기록은 `eli.harness.json`에 저장해요. `status --json`으로 수정·누락을 확인할 수 있고, 수정한 스킬·훅을 자동으로 덮어쓰거나 다른 버전으로 업데이트하지 않아요.

## 자동화에서 사용하기

`--json`을 붙이면 결과를 JSON으로 받아요. 성공은 종료 코드 `0`과 `ok: true`, 실패는 종료 코드 `1`과 `ok: false`로 구분해요.

```bash
npx eli-design@latest add button --dry-run --json
npx eli-design@latest status --json
```

다른 폴더에서 실행하려면 명령 뒤에 `--cwd <프로젝트 경로>`를 붙여요.
