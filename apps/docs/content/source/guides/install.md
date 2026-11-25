---
title: 설치
description: 필요한 ELI 소스만 추가하고 실제 설치 위치·버전·CSS 연결을 확인해요.
---

# 필요한 컴포넌트 소스를 추가해요

ELI는 기존 React 프로젝트에 필요한 소스를 복사해 사용해요. 설치된 코드는 소비 프로젝트에서 소유하고 수정해요. 신규 프로젝트에 종료 예정인 `@eli-design/ui` 전체 패키지나 그 그룹 import를 안내하지 않아요. 기존 앱이 그 패키지를 실제로 사용한다면 의존성·수정 파일을 보존하고 이전 계획을 먼저 확인해요.

## 실행 전에 확인해요

- 프로젝트의 package.json·packageManager·lockfile과 기존 ELI 설치 기록을 읽어요. 이미 초기화한 앱에 다시 init하거나 다른 패키지 매니저의 lockfile을 만들지 않아요.
- CLI 지원 환경은 Node.js 24.21.0 이상의 24.x 또는 26 이상이에요. 소스 추가에는 실제로 설치된 React `^19.3.0`이 필요해요. 기존 React를 강제로 교체하거나 peer 검사를 해제하지 않아요.
- CLI는 React나 소비 앱의 의존성을 자동 설치하지 않아요. 조건이 맞지 않으면 소비 앱 담당자와 호환성을 먼저 확인해요.
- `@latest`는 설치 도구의 npm 태그예요. UI 콘텐츠 버전이나 하네스 버전이 아니며 이미 설치한 소스를 자동 업데이트하지 않아요. 사전 배포 태그는 명시적으로 선택한 경우만 사용해요.

## 프로젝트의 패키지 매니저로 실행해요

프로젝트 루트에서 실행해요. 아래 중 하나만 선택하고 전역 설치는 요구하지 않아요.

| 환경 | 초기화 | 필요한 소스 추가 |
| --- | --- | --- |
| npm | `npx eli-design@latest init` | `npx eli-design@latest add button` |
| pnpm | `pnpm dlx eli-design@latest init` | `pnpm dlx eli-design@latest add button` |
| Yarn Modern | `yarn dlx eli-design@latest init` | `yarn dlx eli-design@latest add button` |
| Yarn Classic | `npx eli-design@latest init` | `npx eli-design@latest add button` |
| Bun | `bunx eli-design@latest init` | `bunx eli-design@latest add button` |

Yarn Classic에는 dlx가 없어서 실행 도구만 npx를 사용해요. 앱 의존성 관리는 계속 Yarn으로 해요. Yarn PnP에서도 node_modules 경로를 가정하지 않고 실제 설치 결과와 앱의 해석 설정을 확인해요.

사용 가능한 항목은 `list`, 여러 항목은 `add button select`로 확인·추가해요. 조합 컴포넌트의 실제 의존 파일과 토큰은 함께 추가되고 공유 파일은 재사용돼요. 관련 컴포넌트 추천 목록을 모두 설치하지 않아요. 전체가 필요한 경우에만 `add --all`을 명시해요. UI 소스 추가에는 하네스가 자동으로 따라오지 않아요.

## 실제 설치 경로로 import해요

기본 폴더는 src가 있으면 `src/components/ui`, 없으면 `components/ui`예요. 새 초기화 때만 `init --dir src/shared/ui`처럼 원하는 상대 경로를 지정할 수 있어요. 이미 설치한 폴더와 기록을 자동으로 이동하지 않아요.

아래 예시는 기본 폴더에 Button을 추가하고 `src/App.tsx`에서 사용하는 경우예요.

```tsx
import { Button } from './components/ui/button';

export default function App() {
  return <Button icon={null} onClick={() => console.log('저장')}>저장</Button>;
}
```

이벤트를 사용하는 Next.js App Router 화면에서는 해당 소비 컴포넌트를 Client Component로 연결해요. 페이지 전체에 불필요하게 'use client'를 붙이지 않아요.

예시 경로를 다른 위치의 파일에 그대로 복사하지 않아요. 설치 기록의 entries에서 id·path·export를 읽고 사용하는 파일과의 상대 import를 계산해요. 기존 `@/*` 같은 별칭이 실제 TypeScript·번들러 설정에 있을 때만 사용해요. ELI 전용 별칭이나 플러그인을 추가하지 않아요.

## 설치 기록과 버전을 구분해요

| 설치 도구 | UI 설정 | UI 파일·진입점 기록 | 하네스 기록 |
| --- | --- | --- | --- |
| CLI 0.4.0 | eli.json | eli.lock.json | eli.harness.json |
| CLI 0.5.0 | .eli/config.json | .eli/lock.json | .eli/harness.json |

기록 위치는 설치 도구 버전에 따라 달라요. 버전이 다른 도구가 기존 설치를 인식하지 못해도 UI가 없다고 단정하거나 다시 init하지 않아요. 설치할 때 사용한 도구 버전으로 상태를 확인하고 이전 계획을 정해요. 기록 파일을 임의로 이동하거나 형식을 다시 쓰지 않아요. 설정·기록과 설치 소스를 함께 Git으로 관리해요.

- UI 설정의 version은 콘텐츠 버전이며 레지스트리 주소·목록 해시와 설치 폴더를 고정해요.
- UI 기록의 entries는 실제 로컬 진입 파일과 export를, files는 파일 해시를 알려줘요. 기록만 믿지 않고 실제 파일도 확인해요.
- 하네스 기록의 version과 installerVersion은 각각 하네스와 설치 도구 버전이에요. UI 버전과 같아야 한다고 판단하지 않아요.
- MCP get_versions의 ui.docs는 서버가 설명하는 UI 버전이에요. 로컬 UI와 다르면 문서의 props를 적용하기 전에 로컬 소스와 차이를 대조해요.

props는 get_props에서 필요한 이름만 조회해요. 이 도구는 직접 정의한 props만 반환하고 React에서 상속한 타입은 extends로 알려줘요. 네이티브 type처럼 목록에 없는 속성의 조회 오류를 컴포넌트가 그 속성을 지원하지 않는다는 뜻으로 단정하지 않아요. extends의 Omit 제외 목록과 실제 로컬 타입·구현을 확인하고 미확인 속성은 지어내지 않아요.

## CSS·파일 상태를 확인해요

컴포넌트를 import하면 기본 CSS·공통 토큰이 자동 연결돼요. 별도 ELI CSS import나 Tailwind 플러그인은 필요하지 않아요. Pretendard는 소비 앱에서 직접 연결하므로 `font` 가이드를 읽어요.

- `status --json`으로 unchanged·modified·missing과 실제 진입 경로를 확인해요. 상태 조회의 성공은 누락 복구나 수정 파일 승인이라는 뜻이 아니에요.
- modified는 파일 해시가 다르다는 뜻이에요. 사용자 수정 자체를 디자인 위반으로 보거나 원본으로 자동 복구하지 않아요.
- `add modal --dry-run --json`처럼 먼저 변경 계획을 확인할 수 있어요. 수정한 공유 의존 파일과 충돌하면 파일·설치 기록을 유지한 채 중단해요. 우회 복사나 강제 덮어쓰기를 하지 않아요.
- 자동화는 종료 코드와 JSON의 ok를 함께 확인해요. 실패했는데 설치 완료로 기록하지 않아요.
- 소스 추가 뒤 소비 앱의 타입·빌드·브라우저에서 이벤트와 CSS 연결을 확인해요. 원본 소스·문서 버전·실제 설치 경로가 맞아야 해요.

## 하네스는 따로 선택해요

원하는 에이전트를 정한 뒤 `harness --agent claude`, `harness --agent codex` 또는 `harness --agent all`로 설치해요. 위 표에서 선택한 실행 도구 명령에 harness 인자를 사용해요. 하네스만 설치할 때 UI init이나 React가 필요하지 않아요.

기존 스킬·훅·설정은 보존해요. Claude의 MCP 등록과 Codex의 연결·훅 신뢰는 설치 결과의 nextSteps를 확인해요. MCP 도구가 설치한 세션에 아직 보이지 않으면 설치된 eli-docs.mjs로 같은 문서를 읽는 기존 절차를 사용해요. 조회도 실패하면 확인하지 못한 단계를 밝히고 명세를 지어내지 않아요.
