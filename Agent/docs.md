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

### 컴포넌트 문서의 형식

frontmatter 필드는 모두 필수예요.

| 필드 | 값 |
| --- | --- |
| `name` | `packages/ui`가 내보내는 컴포넌트 이름 (예: `Button`) |
| `group` | `packages/ui/package.json`의 `exports` 경로 (예: `button`) |
| `description` | 한 줄 설명 |
| `status` | `stable` 또는 `draft` |

`##` 제목에는 섹션 키를 그대로 써요. 사람용 페이지는 `schema.ts`의 한국어 라벨로 바꿔 보여줘요.

| 섹션 키 | 내용 | 필수 |
| --- | --- | --- |
| `summary` | 무엇을 하는 컴포넌트인지 | 필수 |
| `when-to-use` | 언제 쓰고 언제 쓰지 않는지, 대신 쓸 컴포넌트 | 필수 |
| `examples` | 복사해서 쓸 수 있는 코드 예시 | 필수 |
| `variants` | 크기·색상·상태 같은 변형과 고르는 기준 | 선택 |
| `do-dont` | 권장하는 사용법과 피해야 할 사용법. `/eli-verify`가 점검 기준으로 읽어요 | 선택 |
| `accessibility` | 키보드, 스크린 리더, 라벨 요구 사항 | 선택 |
| `related` | 함께 쓰거나 헷갈리기 쉬운 컴포넌트 | 선택 |

### 가이드 문서의 형식

`content/source/guides/{topic}.md`에 frontmatter `title`, `description`과 마크다운 본문으로 써요. 주제는 아래 목록만 허용해요.

| 주제 | 내용 | 읽는 곳 |
| --- | --- | --- |
| `install` | 프레임워크·패키지 매니저별 설치 방법 | 기본 동작, `/eli-design-system`, `/eli-doctor` |
| `font` | Pretendard 연결 방법 | 기본 동작, `/eli-design-system`, `/eli-doctor` |
| `design-md` | `DESIGN.md` 질문 목록과 템플릿 | `/eli-design-md` |
| `design-system-page` | 디자인 시스템 페이지의 구성과 순서 | `/eli-design-system` |
| `verify` | 점검 규칙, 예외, 네이티브 요소와 ELI 컴포넌트의 대응, 화면 품질 기준(터치 영역 크기 등) | `/eli-verify` |
| `ux-writing` | `UX-WRITING.md` 질문 목록과 템플릿 | `/eli-ux-writing` |
| `icon` | 커스텀 아이콘의 그리드·선 굵기·모서리·색 규칙 | `/eli-icon` |

`icon` 가이드는 디자이너에게 규칙을 전달받은 뒤에 써요. 가이드 주제를 추가하거나 이름을 바꾸면 [하네스](harness.md)의 스킬도 함께 고쳐요.

## 조회 계층을 하나로 둬요

페이지, GET API, MCP는 모두 `content/query.ts`의 같은 함수를 호출해요. MCP는 같은 앱에 있으므로 자기 GET API를 HTTP로 다시 호출하지 않아요. 필터 규칙은 이 계층 한 곳에서 관리해요.

## API와 MCP 도구를 작게 나눠요

도구 설명도 에이전트의 컨텍스트를 차지해요. 그래서 도구 수는 적게 두고 필터는 파라미터로 받아요. 응답에는 요청한 부분만 담아요.

| MCP 도구 | GET API | 입력 | 응답 |
| --- | --- | --- | --- |
| `list_components` | `/api/v1/components?group=&status=` | `group?`, `status?` | `{ components: [{ name, group, description, status, import }] }` |
| `get_component` | `/api/v1/components/{name}?sections=` | `name`, `sections?` (섹션 키 배열) | `{ name, group, import, sections: { [키]: 마크다운 } }` |
| `get_props` | `/api/v1/components/{name}/props?names=` | `name`, `names?` | `{ name, props: [{ name, type, required, default, description }] }` |
| `search` | `/api/v1/search?q=&limit=` | `q` (2자 이상), `limit?` (기본 5, 최대 20) | `{ results: [{ id, kind, title, excerpt }] }` |
| `get_tokens` | `/api/v1/tokens?category=` | `category` | `{ category, tokens: [{ name, value, description }] }` |
| `get_guide` | `/api/v1/guides/{topic}` | `topic?` | `{ topic, title, body }` |

- `name`은 컴포넌트 이름이에요. 대소문자를 구분하지 않고 찾아요.
- `import`는 `@eli/ui/button` 같은 그룹 경로예요.
- `get_component`에서 `sections`를 생략하면 `summary`와 `when-to-use`만 돌려줘요. 문서에 없는 선택 섹션을 요청하면 그 키를 응답에서 빼요.
- `get_props`에서 `names`를 생략하면 모든 prop을 돌려줘요. `default`와 `description`은 타입에 없으면 `null`이에요.
- `search`의 `kind`는 `component` 또는 `guide`예요. `id`는 `get_component`의 `name`이나 `get_guide`의 `topic`으로 바로 쓸 수 있어요. `excerpt`는 200자 이하예요. 본문 전체는 주지 않아요.
- `get_tokens`의 `category`는 `color`, `semantic-color`, `typography`, `layout` 중 하나예요. `name`은 `--eli-layout-scale-4` 같은 CSS 변수 이름이에요. `description`은 CSS 주석에 없으면 `null`이에요.
- `get_guide`에서 `topic`을 생략하면 `{ guides: [{ topic, title, description }] }` 목록을 돌려줘요.

### 공통 규칙

- 엔드포인트는 `/mcp` 하나예요. Streamable HTTP로 통신하고 세션과 인증 없이 동작해요.
- 서버 이름은 `eli-docs`예요. 서버 버전은 `@eli/ui`의 버전과 같게 둬요.
- 모든 API와 MCP 도구는 읽기 전용이에요.
- MCP 도구는 JSON을 텍스트 콘텐츠 하나로 돌려줘요.
- 허용하지 않는 값이나 없는 이름을 받으면 MCP 도구는 `isError: true`와 함께 허용하는 값 목록을 돌려줘요. GET API는 잘못된 파라미터에 400, 없는 이름에 404를 돌려줘요. 에이전트가 다시 추측하지 않고 바로 고쳐 호출할 수 있어야 해요.
- 문서 내용은 배포 단위로만 바뀌므로 GET API는 빌드할 때 정적으로 만들어요.
- 도구를 추가하거나 입력·응답을 바꾸면 [하네스](harness.md)의 스킬도 함께 고쳐요.

## 원격 MCP를 연결해요

`backend/mcp/server.ts`에서 `mcp-handler`와 `@modelcontextprotocol/server`로 MCP 서버를 정의하고, `app/mcp/route.ts`에서 GET·POST로 연결해요. 서버는 세션 없이 동작해서 별도 저장소가 필요 없어요.

```bash
pnpm dev:docs
claude mcp add --transport http eli-docs http://localhost:3000/mcp
```

도구는 `registerTool`로 등록하고 입력 스키마는 zod로 검증해요. 모든 도구에 `annotations: { readOnlyHint: true }`를 지정해요.

## 정하지 않은 것

- **도메인:** 아직 정하지 않았어요. 정해지면 이 문서와 `packages/harness/skills/eli/SKILL.md`의 주소를 함께 고쳐요.
- **배포 설정:** 배포 대상은 Cloudflare로 정했어요. Next.js를 올리려면 OpenNext 어댑터가 필요하고, 아직 설정하지 않았어요.
- **압축 응답 형식:** TOON 같은 압축 형식은 실제 응답으로 토큰 수를 측정해 효과가 확인되면 추가해요.
- **문서 버전:** 아직 npm 배포 전이라 최신 문서 하나만 제공해요. 배포를 시작하면 버전별 조회가 필요한지 다시 검토해요.

현재는 MCP 엔드포인트만 있고 등록된 도구가 없어요. 문서 원본·조회 계층·GET API·MCP 도구는 아직 구현되지 않았어요. 위 스펙은 구현할 때 따를 기준이에요.
