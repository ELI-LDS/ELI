# 문서 앱 구조

`apps/docs`는 하나의 Next.js App Router 앱에서 사람용 문서 페이지, GET API, 원격 MCP를 함께 제공해요. 세 출력은 같은 문서 원본에서 만든 데이터만 읽어요. 이를 통해 페이지와 에이전트가 보는 내용이 어긋나지 않아요.

목표는 Claude Code 같은 에이전트가 문서 HTML 전체를 읽지 않고, 필요한 컴포넌트의 필요한 섹션만 조회하게 하는 것이에요.

## 데이터 흐름

```text
content/*.md ──빌드 스크립트──▶ 엄격한 TS 데이터 ──▶ 조회 계층 ─┬─▶ 사람용 페이지
 (사람이 작성)   (파싱·검증)      (생성 파일)        (필터)    ├─▶ GET API  /api/v1/*
                                                              └─▶ 원격 MCP  /mcp
```

## 폴더 구조

프론트 영역과 백엔드 영역을 나누고, 두 영역이 함께 읽는 문서 데이터는 공용 영역에 둬요.

```text
apps/docs/
├── app/                      # Next.js 라우팅 진입점
│   ├── layout.tsx, page.tsx  # 프론트 라우트
│   ├── api/v1/               # 백엔드 라우트: GET Route Handler
│   └── mcp/                  # 백엔드 라우트: 원격 MCP 엔드포인트
├── frontend/                 # 프론트 영역: 사람용 페이지 UI
├── backend/                  # 백엔드 영역
│   ├── api/                  # GET API 파라미터 검증·응답 구성
│   └── mcp/                  # MCP 서버와 도구 정의
├── content/                  # 공용 영역: 문서 데이터
│   ├── source/
│   │   ├── components/       # 컴포넌트 마크다운 원본, 컴포넌트당 파일 하나 (예: button.md)
│   │   └── guides/           # 설치·폰트 설정 같은 공통 가이드 원본
│   ├── schema.ts             # 문서 데이터 타입 (예정)
│   ├── query.ts              # 목록·단건·섹션·검색 조회 함수 (예정)
│   └── generated/            # 빌드 결과, Git에 포함하지 않아요 (예정)
└── scripts/                  # 마크다운 → TS 데이터 빌드 스크립트
```

- `app/`에는 라우트 파일만 둬요. 라우트 파일은 `frontend/`나 `backend/`의 코드를 불러와 연결만 해요.
- `frontend/`와 `backend/`는 `content/`에만 의존해요. 두 영역은 서로 import하지 않아요.
- `content/`는 `frontend/`와 `backend/`를 import하지 않아요.
- `frontend/`는 `pages`, `features`, `layouts`, `shared`로 역할을 나눠요. 페이지 조립, 코드 배치와 Server·Client Component 기준은 [문서 프론트엔드 지침](docs-frontend.md)에서 관리해요.

## 원본은 마크다운으로 써요

- 컴포넌트 문서는 frontmatter와 정해진 `##` 섹션으로 써요. 섹션 제목은 데이터의 섹션 키와 1:1로 대응해요.
- 빌드 스크립트는 원본을 파싱해 `schema.ts` 타입을 만족하는 TS 데이터를 만들어요.
- 검증은 엄격하게 해요. 필수 frontmatter가 없거나, 정해지지 않은 섹션이 있거나, `packages/ui`에 없는 컴포넌트를 가리키면 빌드를 실패시켜요.
- props는 마크다운에 직접 쓰지 않아요. `packages/ui`의 TypeScript 타입에서 추출해요. 직접 쓴 props는 구현과 쉽게 어긋나고, 틀린 props는 에이전트가 잘못된 코드를 쓰게 만들어요.
- 토큰도 마크다운에 직접 쓰지 않아요. `packages/ui/src/tokens`의 CSS 파일에서 추출해요.
- 전달받지 않은 컴포넌트 명세와 디자인 값을 문서에 임의로 쓰지 않아요.

frontmatter 필드, 섹션 키, 가이드 주제와 각 가이드가 담아야 하는 내용은 [원격 MCP 규격](mcp-spec.md#콘텐츠)에서 관리해요.

## 조회 계층을 하나로 둬요

페이지, GET API, MCP는 모두 `content/query.ts`의 같은 함수를 호출해요. MCP는 같은 앱에 있으므로 자기 GET API를 HTTP로 다시 호출하지 않아요. 필터 규칙은 이 계층 한 곳에서 관리해요.

## API와 MCP 도구를 작게 나눠요

도구 설명도 에이전트의 컨텍스트를 차지해요. 그래서 도구 수는 적게 두고 필터는 파라미터로 받아요. 응답에는 요청한 부분만 담아요.

도구 목록·GET API 대응·입력과 응답 형식·오류 응답·도구 설명·구현 순서는 [원격 MCP 규격](mcp-spec.md#도구)에서만 관리해요. 목록이나 개수를 이 문서에 복제하지 않아요.

## 사용 의미와 설치 데이터를 연결해요

사람용 문서와 MCP는 같은 사용 목적·선택 기준·조합 규칙을 읽어요. Props·토큰은 코드에서 추출하고, 설치할 파일은 레지스트리를 기준으로 확인해요. 설치 규격을 문서 원본에 다시 작성하지 않아요.

후속 소스 배포에서는 문서의 컴포넌트와 레지스트리의 항목을 연결해야 해요. 하네스는 문서로 사용할 UI를 선택하고 실제 설치 기록으로 사용 경로를 확인해요. 경계와 기준 정보는 [레지스트리 연동 계약](registry.md#하네스가-소비-방식을-구분하게-해요)을 따라요. 서버는 소비 프로젝트의 파일 위치를 모르는 상태에서 로컬 import 경로를 만들어 주지 않아요. 이 연결은 아직 구현되지 않았어요.

## 원격 MCP를 연결해요

`backend/mcp/server.ts`에서 `mcp-handler`와 `@modelcontextprotocol/server`로 MCP 서버를 정의하고, `app/mcp/route.ts`에서 GET·POST로 연결해요. 서버는 세션 없이 동작해서 별도 저장소가 필요 없어요.

```bash
pnpm dev:docs
claude mcp add --transport http eli-docs http://localhost:3000/mcp
```

도구는 `registerTool`로 등록하고 입력 스키마는 zod로 검증해요. 모든 도구에 `annotations: { readOnlyHint: true }`를 지정해요.

## 정하지 않은 것

- **배포 설정:** 배포 대상은 Cloudflare로 정했어요. Next.js를 올리려면 OpenNext 어댑터가 필요하고, 아직 설정하지 않았어요.
- **압축 응답 형식:** TOON 같은 압축 형식은 실제 응답으로 토큰 수를 측정해 효과가 확인되면 추가해요.
- **문서 버전:** npm 배포는 시작했지만 버전별 문서 조회는 아직 구현하지 않았어요. 문서 앱을 공개할 때 설명 대상인 게시 버전을 명시하고, 설치 버전과 다르면 차이를 안내해요. `0.x`·정식 릴리스의 운영 기준은 [버전 규칙](versioning.md)을 따라요.

현재는 MCP 엔드포인트만 있고 등록된 도구가 없어요. 문서 원본·조회 계층·GET API·MCP 도구는 아직 구현되지 않았어요. 구현할 때는 [원격 MCP 규격](mcp-spec.md)을 따라요.
