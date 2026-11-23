# 문서 앱 구조

`apps/docs`는 하나의 Next.js App Router 앱에서 사람용 문서 페이지, GET API, 원격 MCP를 함께 제공할 구조예요. 세 출력은 검토한 같은 컴포넌트 JSON을 읽도록 해요. 이를 통해 페이지와 에이전트가 보는 내용이 어긋나지 않아요.

목표는 Claude Code 같은 에이전트가 문서 HTML 전체를 읽지 않고, 필요한 컴포넌트의 필요한 섹션만 조회하게 하는 것이에요.

## 데이터 흐름

```text
디자이너 Markdown → AI가 코드와 대조해 JSON 변환 → 사용자 검토
                                                      ↓
                       검토한 JSON → 공통 조회 계층 ─┬─▶ 사람용 페이지
                                                    ├─▶ GET API /api/v1/*
                                                    └─▶ 원격 MCP /mcp → 하네스
```

JSON은 검토하며 Git으로 관리하는 자료예요. 자동 Markdown 변환기로 매번 덮어쓰는 생성물이 아니에요. JSON Schema·빈 템플릿과 타입 검사를 거친 예시를 담은 컴포넌트별 초안은 준비했으며 조회 계층과 실제 연결은 후속 작업이에요.

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
│   │   ├── components/       # 전달받은 디자이너 Markdown 원문
│   │   ├── guides/           # 설치·폰트 설정 같은 공통 가이드 원본
│   │   └── templates/        # 디자이너가 작성한 문서 양식 원본
│   ├── components/           # 코드와 대조하고 검토하는 컴포넌트 JSON
│   ├── templates/            # 공통 빈 JSON 틀, 조회 대상에서 제외
│   ├── component-guide.schema.json # 컴포넌트 가이드의 JSON Schema
│   └── query.ts              # 목록·단건·섹션·검색 조회 함수 (예정)
└── scripts/                  # 문서 데이터 검사·코드 정보 추출 도구 영역 (예정)
```

- `app/`에는 라우트 파일만 둬요. 라우트 파일은 `frontend/`나 `backend/`의 코드를 불러와 연결만 해요.
- `frontend/`와 `backend/`는 `content/`에만 의존해요. 두 영역은 서로 import하지 않아요.
- `content/`는 `frontend/`와 `backend/`를 import하지 않아요.
- `frontend/`는 `pages`, `features`, `layouts`, `shared`로 역할을 나눠요. 페이지 조립, 코드 배치와 Server·Client Component 기준은 [문서 프론트엔드 지침](docs-frontend.md)에서 관리해요.

## 원문과 검토한 JSON을 함께 관리해요

- 디자이너가 작성한 Markdown을 그대로 받아 원문을 보존해요. 특정 frontmatter·영어 섹션 제목을 요구하지 않아요.
- AI가 문서를 실제 코드와 대조해 JSON 초안을 작성하고 사용자가 검토해요. 미정·구현 차이를 숨기거나 임의 명세를 추가하지 않아요.
- JSON에 전체 Props·기본값·토큰 표를 수동 복제하지 않아요. 원문에 표가 있어도 그대로 보존하고 구현 확인에 사용해요. 해당 기술 정보의 자동 추출은 후속 작업이에요.
- 스키마·템플릿·변환 절차·검토 상태는 [JSON 변환 안내](../handbook/component-guide-json.md)를 따라요. 원문이 바뀌면 JSON과 출처 해시를 함께 검토해요.

JSON의 필드·자료형은 `content/component-guide.schema.json`, 기존 MCP 섹션과의 연결·공통 가이드 주제는 [원격 MCP 규격](mcp-spec.md#콘텐츠)에서 관리해요.

## 조회 계층을 하나로 둬요

페이지, GET API, MCP는 후속 구현할 `content/query.ts`의 같은 함수를 호출해요. 일반 조회에는 `stable`만 제공하고 검토용 초안 조회는 명시적으로 구분해요. MCP는 같은 앱에 있으므로 자기 GET API를 HTTP로 다시 호출하지 않아요. 필터 규칙은 이 계층 한 곳에서 관리해요.

## API와 MCP 도구를 작게 나눠요

도구 설명도 에이전트의 컨텍스트를 차지해요. 그래서 도구 수는 적게 두고 필터는 파라미터로 받아요. 응답에는 요청한 부분만 담아요.

도구 목록·GET API 대응·입력과 응답 형식·오류 응답·도구 설명·구현 순서는 [원격 MCP 규격](mcp-spec.md#도구)에서만 관리해요. 목록이나 개수를 이 문서에 복제하지 않아요.

## 사용 의미와 설치 데이터를 연결해요

사람용 문서와 MCP는 같은 사용 목적·선택 기준·조합 규칙을 읽어요. Props·토큰은 코드에서 추출하고, 설치할 파일은 레지스트리를 기준으로 확인해요. 설치 규격을 문서 원본에 다시 작성하지 않아요.

공개된 소스 설치 방식과 원격 문서를 연결하려면 문서의 컴포넌트와 레지스트리의 항목을 연결해야 해요. 하네스는 문서로 사용할 UI를 선택하고 실제 설치 기록으로 사용 경로를 확인해요. 경계와 기준 정보는 [레지스트리 연동 계약](registry.md#하네스가-소비-방식을-구분하게-해요)을 따라요. 서버는 소비 프로젝트의 파일 위치를 모르는 상태에서 로컬 import 경로를 만들어 주지 않아요. 이 연결은 아직 구현되지 않았어요.

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

현재 MCP 엔드포인트에는 등록된 도구가 없어요. 컴포넌트 가이드의 JSON 틀과 검토용 초안은 준비했지만 조회 계층·GET API·MCP 도구·Props/토큰 추출은 아직 없어요. 구현할 때는 [원격 MCP 규격](mcp-spec.md)을 따라요.

현재 가이드의 검토 상태와 담당자 인계 범위는 [검토 기록](../handbook/component-guide-review.md), [연동 인계](../handbook/component-guide-handoff.md)에서 확인해요. 도구 계약은 원격 MCP 규격에만 정의해요.
