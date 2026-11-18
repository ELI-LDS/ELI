# 선택 설치용 레지스트리

`@eli-design/ui` 전체 설치와 별도로 제작 중인 CLI가 필요한 소스만 받게 하는 배포 규격이에요. 생성기와 검사는 구현되어 있지만 CLI 연결과 GitHub Release 게시는 아직 하지 않았어요. 생성 결과만으로 사용자 선택 설치가 제공된다고 안내하지 않아요.

## 원본과 생성물을 구분해요

- 컴포넌트 원본은 `packages/ui/src`, 공개 컴포넌트의 기준은 `packages/ui/package.json`의 `exports`예요.
- `packages/registry/catalog.json`은 규격 버전·공유 토큰 경로·예약된 항목 종류만 관리해요. 컴포넌트 명단과 의존 파일 목록을 수동 복제하지 않아요.
- `pnpm build:registry`가 `.artifacts/registry/registry.json`과 항목별 JSON을 생성해요. 생성물은 직접 고치거나 Git에 올리지 않아요.
- `packages/registry/schema.json`은 목록과 상세 JSON의 공개 JSON Schema예요. 규격을 호환되지 않게 바꾸면 `schemaVersion`을 올리고 CLI 담당자와 먼저 맞춰요.
- UI 원본과 개발 도구의 실행 의존성은 추가하지 않아요. 레지스트리 생성기는 기존 TypeScript 개발 의존성과 Node.js 기본 API를 사용해요.

## 항목을 작게 제공해요

공개 named export 하나를 하나의 `component` 항목으로 제공해요. ID는 공개 심벌의 PascalCase를 kebab-case로 바꿔요. 예를 들어 `TextField`는 `text-field`, `SnackBar`는 `snack-bar`예요. Button을 받았다고 같은 그룹의 IconButton을 받지 않아요.

토큰과 내부 파일은 `shared` 항목으로 제공해요. 내부 파일 ID는 `_file-` 접두사를 사용하고 CLI 선택 목록에는 `component`만 표시해요. 내부 항목 ID와 파일 경로를 직접 사용할 공개 API로 안내하지 않아요. 경로 변경도 설치 파일에 영향을 주므로 같은 릴리스의 데이터끼리 사용해야 해요.

TypeScript의 import·재수출·타입 참조와 CSS의 `@import`·`url()`을 따라 실제로 참조하는 파일만 수집해요. 타입·Hook·SVG도 포함하고, 같은 파일은 하나의 항목만 소유해요. 누락 참조, 소스 루트 밖의 참조, 개발 파일, 선언하지 않은 외부 의존성은 생성 오류예요. 새 참조 방식이나 파일 형식이 생기면 분석기와 소비 검사를 함께 보완해요.

TS 소스를 복사한 뒤 Next.js에서도 해석되도록 **생성물의 로컬 TS import에서만 `.js` 확장자를 제거**해요. 원본 라이브러리와 CSS·SVG 경로는 바꾸지 않아요. JSDoc·한국어 주석·`'use client'`와 상대 폴더 구조는 유지해요. 이 변환을 소비 프로젝트 설정으로 떠넘기지 않아요.

## CLI가 읽는 계약

목록 JSON에는 `schemaVersion`, `version`, `license`, `reservedKinds`, `items`가 있어요. 각 목록 항목은 `id`, `kind`, `name`, `description`, `filename`, `sha256`을 제공해요. 목록에는 실제 소스를 담지 않아요.

상세 JSON에는 같은 규격·릴리스 버전과 항목 정보에 더해 아래 값을 제공해요.

| 필드 | 의미 |
| --- | --- |
| `entry` | 공개 컴포넌트의 `{ path, export }`. 공유 항목은 `null`이에요 |
| `dependencies` | 함께 받아야 하는 항목 ID 배열이에요. 타입 참조 의존성도 포함해요 |
| `peerDependencies` | 해당 항목이 외부에서 요구하는 패키지와 버전 범위예요. 의존 항목의 값도 함께 확인해요 |
| `files` | `{ path, content, sha256 }` 배열이에요. 텍스트 TS·TSX·CSS·SVG만 제공해요 |

CLI 담당자는 다음 순서로 연결해요. 이 절차를 실행하는 CLI 자체는 이번 구현에 포함하지 않아요.

1. 신뢰하는 ELI GitHub Release의 `registry.json`을 읽고 규격 버전을 확인해요. 선택한 항목과 의존 항목 JSON만 재귀적으로 받아요. 전체 tarball이나 저장소를 먼저 받지 않아요.
2. 상세 JSON의 원본 UTF-8 바이트로 SHA-256을 확인해요. 파일의 해시는 **설치할 `content`의 UTF-8 바이트**를 기준으로 확인해요. 해시는 무결성 확인 수단이며 배포 출처 인증을 대신하지 않아요.
3. 모든 JSON의 `version`·`schemaVersion`이 목록과 같은지 확인해요. `peerDependencies`는 소비 프로젝트의 도구로 확인하며 React나 다른 UI를 임의로 추가하지 않아요.
4. `files.path`는 설정한 ELI 설치 폴더를 기준으로 사용해요. 기본 폴더는 `src`가 있으면 `src/components/eli`, 없으면 `components/eli`예요. 절대 경로·`..`·역슬래시·심볼릭 링크를 통한 설치 폴더 밖 쓰기를 허용하지 않아요. `LICENSE`도 같은 폴더에 전달해요.
5. 전체 의존 항목을 먼저 검증하고 같은 경로는 한 번만 써요. 경로가 같은데 내용이나 해시가 다르면 중단해요. 그룹 barrel 파일은 추가하지 않고 `entry.path`의 로컬 모듈에서 `entry.export`를 가져오는 예시를 안내해요.
6. 설치 버전·항목 ID·설치 경로·파일 해시를 기록해요. 같은 파일은 재사용하고 사용자 수정 파일은 확인 없이 덮어쓰지 않아요. 버전 변경 시 기존 공유 파일과 모든 설치 항목의 호환성을 함께 확인해요. 기록 파일의 형식과 설치·업데이트 명령은 CLI 담당자가 정해요.

일반 npm 패키지 방식은 전체 파일을 내려받아요. 선택 설치 예시와 npm 전체 설치의 import·다운로드 범위를 혼동하지 않아요. 두 방식을 자동으로 전환하거나 기존 `@eli-design/ui` 의존성을 제거하지 않아요.

## 하네스 담당자와 연결해요

`harness` 종류를 독립적인 선택 설치 항목으로 예약해요. 현재 목록에는 `reservedKinds: ["harness"]`만 있고 설치할 하네스 항목은 없어요. UI 항목에는 하네스 의존성을 추가하지 않아요.

하네스 담당자는 전체 하네스를 하나의 항목으로 연결할 때 공통 `schemaVersion`·`version`·파일 목록·해시 계약을 사용해요. 스킬 복사, 에이전트 선택, 훅 병합, 사용자 신뢰와 업데이트 처리는 담당자의 구현 영역이에요. 현재 npm 패키지의 하네스 내용·설치 경로·상세 지침을 이번 레지스트리 작업에서 바꾸지 않아요.

## 검증하고 배포해요

`pnpm test:registry`는 규격·해시·의존성·개별 선택 범위를 검사하고 생성 JSON만 복원한 소비 앱에서 모든 공개 컴포넌트의 타입·Vite CSS 연결과 대표 Next.js SSR·hydration·상호작용을 확인해요. 수행 범위는 [검증 기준](testing.md#선택-설치-데이터를-확인해요)을 따라요.

GitHub Release `v{version}`의 개별 asset으로 생성 폴더의 JSON 파일 전부를 제공하는 것을 배포 계약으로 정해요. `filename`은 같은 Release의 파일명이에요. npm 배포물과 레지스트리는 **같은 릴리스 커밋**에서 만들고, 같은 태그의 데이터를 덮어쓰지 않아요. 릴리스 번호는 [버전 규칙](versioning.md)을 따라요. 게시된 `0.0.0`에 뒤늦게 다른 소스를 붙이지 않고 다음 미게시 버전의 릴리스에서 시작해요.

현재 생성 결과가 `0.0.0`이어도 로컬 검증 후보일 뿐 공개 Release가 있다는 뜻은 아니에요. GitHub Release 업로드·npm 게시·CLI 연동 완료 여부는 각각 확인해서 안내해요.
