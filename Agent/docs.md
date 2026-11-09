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
- `frontend/` 내부 구조는 아직 정하지 않았어요.

## 원본은 마크다운으로 써요

- 컴포넌트 문서는 frontmatter와 정해진 `##` 섹션으로 써요. 섹션 제목은 데이터의 섹션 키와 1:1로 대응해요.
- 빌드 스크립트는 원본을 파싱해 `schema.ts` 타입을 만족하는 TS 데이터를 만들어요.
- 검증은 엄격하게 해요. 필수 frontmatter가 없거나, 정해지지 않은 섹션이 있거나, `packages/ui`에 없는 컴포넌트를 가리키면 빌드를 실패시켜요.
- props는 마크다운에 직접 쓰지 않아요. `packages/ui`의 TypeScript 타입에서 추출해요. 직접 쓴 props는 구현과 쉽게 어긋나고, 틀린 props는 에이전트가 잘못된 코드를 쓰게 만들어요.
- frontmatter 필드, 섹션 목록, props 추출 방법은 첫 컴포넌트 문서를 작성할 때 정해요. 전달받지 않은 컴포넌트 명세를 문서에 임의로 쓰지 않아요.

## 조회 계층을 하나로 둬요

페이지, GET API, MCP는 모두 `content/query.ts`의 같은 함수를 호출해요. MCP는 같은 앱에 있으므로 자기 GET API를 HTTP로 다시 호출하지 않아요. 필터 규칙은 이 계층 한 곳에서 관리해요.

## API와 MCP 도구를 작게 나눠요

도구 설명도 에이전트의 컨텍스트를 차지해요. 그래서 도구 수는 적게 두고 필터는 파라미터로 받아요. 응답에는 요청한 부분만 담아요.

| MCP 도구 | GET API | 응답 |
| --- | --- | --- |
| `list_components` | `/api/v1/components?group=&status=` | 이름·그룹·한 줄 설명·import 경로만 담은 목록 |
| `get_component` | `/api/v1/components/{name}?sections=` | 요청한 섹션만 |
| `get_props` | `/api/v1/components/{name}/props?names=` | 요청한 prop의 타입·기본값·설명 |
| `search` | `/api/v1/search?q=&limit=` | 일치한 문서 id와 짧은 발췌 (본문 전체는 주지 않아요) |
| `get_tokens` | `/api/v1/tokens?category=` | 디자인 토큰 |
| `get_guide` | `/api/v1/guides/{topic}` | 공통 가이드 |

- 문서 내용은 배포 단위로만 바뀌므로 GET API는 빌드할 때 정적으로 만들어요.
- 쿼리 파라미터는 허용된 값만 받아요. 모르는 섹션이나 이름에는 400이나 404를 돌려줘요.
- 모든 API와 MCP 도구는 읽기 전용이에요.
- 표의 도구와 경로는 초안이에요. 구현하면서 확정해요.

## 원격 MCP를 연결해요

`backend/mcp/server.ts`에서 `mcp-handler`와 `@modelcontextprotocol/server`로 MCP 서버를 정의하고, `app/mcp/route.ts`에서 GET·POST로 연결해요. 서버는 세션 없이 동작해서 별도 저장소가 필요 없어요.

```bash
pnpm dev:docs
claude mcp add --transport http eli-docs http://localhost:3000/mcp
```

도구는 `registerTool`로 등록하고 입력 스키마는 zod로 검증해요. 모든 도구에 `annotations: { readOnlyHint: true }`를 지정해요.

## 정하지 않은 것

- **배포 대상:** Vercel과 Cloudflare 모두 페이지·Route Handler·MCP를 한 번에 배포할 수 있어요. Vercel은 Next.js를 바로 지원해요. Cloudflare는 Storybook을 이미 배포하고 있지만 Next.js를 올리려면 OpenNext 어댑터가 필요해요.
- **에이전트 응답 형식:** 기본은 JSON이에요. TOON 같은 압축 형식은 실제 응답으로 토큰 수를 측정해 효과가 확인되면 추가해요.
- **문서 버전:** 아직 npm 배포 전이라 최신 문서 하나만 제공해요. 배포를 시작하면 버전별 조회가 필요한지 다시 검토해요.

현재는 MCP 엔드포인트만 있고 등록된 도구가 없어요. 조회 계층·GET API·MCP 도구는 아직 구현되지 않았어요.
