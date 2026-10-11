# 프로젝트 구조

## 하나의 패키지를 배포해요

`packages/ui`만 `@eli/ui`로 배포해요. 공통 토큰도 이 패키지에 포함해요. `apps/storybook`은 비공개 개발 앱이에요.

`packages/ui/src/alert/index.ts`는 Alert와 관련 타입을 `@eli/ui/alert`로 공개해요. Alert는 `error`, `success`, `caution`, `info` 상태에 맞는 색상과 아이콘으로 제목과 선택적인 본문을 표시하는 표시용 컴포넌트예요. 화면에 띄우고 자동으로 사라지게 하는 Toast 동작과 라이브 리전은 포함하지 않아요.

`packages/ui/src/badge/index.ts`는 Badge와 관련 타입을 `@eli/ui/badge`로 공개해요. Badge는 상호작용이 없는 표시용 요소이고, `large`·`medium` 크기는 각각 Label/Large·Label/Medium 타이포그래피만 다르게 적용해요.

`packages/ui/src/button/index.ts`는 Button과 관련 타입을 `@eli/ui/button`으로 공개해요. 크기·형태·색상 조합은 별도 컴포넌트가 아니라 하나의 Button props로 관리해요. `color`는 디자인 속성과 같은 `brand`, `neutral`을 사용해요. 아이콘만 표시하는 IconButton도 같은 경로로 공개해요. IconButton은 `solid`, `outline` 형태와 `large`(48px), `medium`(40px) 크기를 지원하고, 텍스트가 없으므로 `aria-label`을 필수로 받아요.

`packages/ui/src/chip/index.ts`는 Chip과 관련 타입을 `@eli/ui/chip`으로 공개해요. Chip은 `selected` 값에 따라 Off·On 상태를 표시만 하고 상태를 직접 바꾸지 않아요. 닫기 버튼을 누르면 `onRemove`를 호출하고, 닫기 버튼의 접근성 이름은 `removeLabel`로 바꿀 수 있어요.

`packages/ui/src/checkbox/index.ts`는 Checkbox와 관련 타입을 `@eli/ui/checkbox`로 공개해요. Checkbox는 네이티브 `input type="checkbox"`를 사용해 클릭·스페이스바·폼 제출과 `checked`·`defaultChecked`·`onChange`를 브라우저와 React 기본 동작으로 처리해요. 라벨 텍스트가 없으므로 사용처에서 `aria-label` 또는 연결된 `label`로 접근성 이름을 제공해요.

`packages/ui/src/divider/index.ts`는 Divider와 관련 타입을 `@eli/ui/divider`로 공개해요. Divider는 부모 영역의 너비를 따르고 `Border/Divider` 의미 토큰으로 구분선을 표시해요.

`packages/ui/src/menu/index.ts`는 MenuItem과 관련 타입을 `@eli/ui/menu`로 공개해요. MenuItem은 기본 텍스트와 선택적인 좌우 아이콘·단축키를 하나의 컴포넌트로 관리하고, Hover·Pressed는 실제 사용자 상호작용으로 표현해요. Pointer 상태는 `MenuItem/useMenuItem.ts`, 기본 모양은 `MenuItem.css`, Mouse Down·Up 애니메이션은 `MenuItem.interaction.css`에서 관리해요.

`packages/ui/src/snackbar/index.ts`는 SnackBar와 관련 타입을 `@eli/ui/snackbar`로 공개해요. 메시지, 액션 버튼명과 액션 버튼 색상은 하나의 SnackBar props로 관리해요.

`packages/ui/src/modal/index.ts`는 Modal과 관련 타입을 `@eli/ui/modal`로 공개해요. 제목, 최대 두 개의 본문 문장, 좌우 버튼명과 콘텐츠 크기는 하나의 Modal props로 관리해요. 본문은 `message`와 `subMessage`로 각각 받고 임의 줄바꿈으로 나누지 않아요. Modal의 최종 최대 너비는 디자인 확정 전까지 TODO로 구분해요.

`packages/ui/src/select/index.ts`는 Select와 관련 타입을 `@eli/ui/select`로 공개해요. 라벨, Placeholder 문구, 옵션 배열과 제어·비제어 선택 값은 하나의 Select props로 관리해요. 반복되는 옵션 행은 공개 MenuItem을 재사용하고, 선택 상태·키보드·포커스 동작은 `Select/useSelect.ts`에서 관리해요.

`packages/ui/src/toggle/index.ts`는 Toggle과 관련 타입을 `@eli/ui/toggle`로 공개해요. 제어·비제어 상태와 상태 변경 함수는 하나의 Toggle props로 관리하고, 상태와 클릭 동작은 `Toggle/useToggle.ts`에서 관리해요. 기본 모양은 `Toggle.css`, 상태 전환과 모션 감소 처리는 `Toggle.interaction.css`에서 관리해요.

`packages/ui/src/text/index.ts`는 TextField와 TextArea를 `@eli/ui/text`로 공개해요. TextField의 `default`, `error`, `success`, `disabled` 상태는 하나의 `state` prop으로 관리해 서로 겹치지 않게 해요. TextArea의 Hover·Focus·입력 완료·Disabled 상태는 네이티브 `textarea`의 상호작용과 속성으로 표현해요. 각 컴포넌트의 구현과 스타일은 `text` 아래의 PascalCase 폴더에서 따로 관리해요.

`packages/ui/src/dim`은 Modal 같은 오버레이 컴포넌트가 내부에서 공유해요. 공개 사용 사례가 확정되기 전까지 별도의 패키지 진입점을 만들지 않아요.

`packages/ui/src/icon`은 컴포넌트 내부에서 재사용하는 아이콘을 관리해요. 아이콘 자체를 공개하기 전까지 별도의 패키지 진입점을 만들지 않아요.

컴포넌트 Storybook 예제는 `apps/storybook/stories`에서 관리하고 개발용 `@/` 경로로 UI 소스를 연결해요. 이를 통해 `packages/ui`에 Storybook 의존성을 추가하지 않아요.

## 코드와 스타일을 함께 연결해요

TypeScript는 ESM과 타입 선언을 만들고 `scripts/build-ui.mjs`는 CSS를 같은 상대 경로로 복사해요. 컴포넌트는 자신의 CSS를 import하고, 그 CSS는 필요한 공통 토큰을 연결해요. `sideEffects`에는 CSS를 등록해요.

그룹 진입점에서 여러 CSS 의존성이 연결되면 사용하지 않는 형제 컴포넌트의 CSS도 포함될 수 있어요. JS 트리 셰이킹과 CSS 제거를 같은 것으로 설명하지 않아요. 실제 소비 번들로 확인해요.

## 폰트 로딩을 분리해요

`@eli/ui`는 `--eli-font-family-sans`와 fallback만 제공해요. 폰트 파일을 패키지에 넣거나 CDN에서 자동으로 불러오지 않아요. 이를 통해 컴포넌트 패키지 용량과 소비 앱의 폰트 로딩 정책을 분리해요.

추후 초기 설정 도구가 소비 프로젝트의 프레임워크를 확인하고 Pretendard를 설치한 뒤 전역 진입점에 한 번 연결해요. 이미 같은 폰트가 설정되어 있으면 다시 추가하지 않아요. MCP는 이 과정을 안내할 수 있지만 재현 가능한 설치와 파일 변경은 초기 설정 도구가 담당해요.

## 실행 의존성을 검토해요

현재 배포 패키지에는 `dependencies`가 없어요. React 19.3 계열을 개발·검증 기준으로 삼고 peer 범위는 `^19.3.0`이에요. React DOM은 포털 같은 기능을 구현할 때 필요성을 검토해요. 지원 범위를 넓힐 때 해당 버전의 소비 테스트를 추가해요.

새 실행 의존성을 추가하면 목적·직접 구현 비용·용량·라이선스를 검토하고 패키징 검사의 기준을 함께 갱신해요. 개발 도구와 실행 의존성을 구분해요.

## 현재 상태와 예정된 기능

색상·타이포그래피·레이아웃 토큰과 Alert·Badge·Button·IconButton·Chip·Checkbox·Divider·MenuItem·SnackBar·Toggle, Modal, Select, TextField, TextArea의 기본 구조와 디자인 상태를 구현했어요. 색상은 원시 색상과 의미 색상으로 나누고, 타이포그래피에는 폰트 패밀리·크기·굵기 토큰을 포함해요. Modal의 최종 최대 너비는 아직 확정되지 않았어요. Storybook의 Worker 정적 파일 배포 설정은 추가했지만 Cloudflare 빌드 설정과 실제 배포는 아직 확인하지 않았어요. 다른 컴포넌트와 폰트 초기 설정 도구, Next.js 소비 검증, 문서 사이트, MCP, npm 배포 자동화는 아직 없어요. 필요할 때 `apps/docs`, `packages/docs-mcp`를 추가해요. 초기 셋업의 Vite 검증만으로 Next.js 호환성을 보장하지 않아요.
