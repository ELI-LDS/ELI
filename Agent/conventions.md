# 파일과 코드 규칙

## 이름을 맞춰요

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 폴더·파일·심벌 | PascalCase | `text/TextField/TextField.tsx` |
| 테스트·스토리·스타일 | 같은 이름과 소문자 접미사 | `TextField.test.tsx`, `TextField.stories.tsx`, `TextField.css` |
| 그룹·구조 폴더 | 소문자 | `text`, `src`, `packages`, `tokens` |
| 훅·유틸리티 | camelCase | `useToggle.ts`, `mergeRefs.ts` |
| 설정·진입점 | 도구의 표준 이름 | `package.json`, `index.ts` |
| 지침 문서 | 소문자 | `architecture.md` |

현재 공개 컴포넌트 이름은 `Button`, `Chip`, `Divider`, `IconButton`, `MenuItem`, `Modal`, `Select`, `SnackBar`, `TextArea`, `TextField`, `Toggle`로 맞춰요. 서로 다른 대소문자 표기를 섞지 않아요.

## 공개 경로를 관리해요

사용자는 `@eli/ui/button` 같은 그룹 경로에서 named import해요. 내부 파일 경로를 공개하지 않아요. 공개 entry는 `package.json`의 `exports`에 JS와 타입을 함께 등록해요. 실제 구현이 없는 컴포넌트를 임시로 export하지 않아요.

라이브러리의 상대 TS/TSX import는 출력 경로에 맞춰 `.js` 확장자를 써요. 타입 전용 import와 export에는 `type`을 붙여요. `any`로 오류를 숨기지 않아요.

props 타입은 기본적으로 구현 파일에 두고 재사용할 필요가 생기면 분리해요. 공통 유틸리티와 추상화는 실제 중복을 확인한 뒤 추가해요.

컴포넌트의 상태와 상호작용을 분리하는 기준, 단일 책임과 `'use client'` 적용 방법은 [컴포넌트 구현 규칙](components.md#상태와-상호작용을-hook으로-분리해요)을 따라요.

## 개발용 경로를 짧게 써요

Storybook과 `tests` 같은 개발용 코드에서는 `@/`를 저장소 루트 경로로 사용해요. 예를 들어 `@/packages/ui/src`는 루트의 `packages/ui/src`를 가리켜요. TypeScript와 Storybook이 같은 경로를 사용하도록 설정을 함께 관리해요.

`packages/ui/src`의 TypeScript와 CSS에서는 `@/`를 사용하지 않아요. 현재 빌드는 라이브러리의 import 경로를 다시 쓰지 않으므로 별칭이 배포 파일에 남을 수 있어요. 배포 소스에서는 출력 파일에서도 해석되는 상대 경로와 `.js` 확장자를 사용해요.

## 도구 버전을 맞춰요

Node.js는 `.node-version`, pnpm은 루트 `package.json`의 `packageManager`를 기준으로 써요. 직접 개발 의존성은 정확한 버전으로 고정해요. `pnpm-lock.yaml`을 함께 관리하고 `pnpm install --frozen-lockfile`로 재현해요.

버전 변경 시 engines, 환경 검사, README와 lockfile을 함께 확인해요. 충돌을 피하려고 `--force`나 peer 검사 해제를 일상 설치에 사용하지 않아요.
