# 문서 웹사이트 프론트엔드

공통 화면 요소·Foundation 상세 페이지·컴포넌트 상세 페이지 25개와 모바일 메뉴·검색·필터 예시를 구현했어요. 홈페이지·데스크톱 검색은 아직 준비 중이며, 실제 공개 배포와 로컬 구현 상태는 구분해요. 구조와 SSR 기준은 [프론트엔드 지침](../../../Agent/docs-frontend.md), 문서 구성과 공통 UI는 [독스 페이지 지침](../../../Agent/docs-pages.md)을 따라요.

디자인 기준은 [Header](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1079-21335), [Footer](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1028-19614), [CodeBlock](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1079-22724), [Table](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1077-52113)이에요. 2026-11-25에 확인했으며 코드 펼침의 10줄 제한은 사용자 요청을 우선해 적용했어요.

## 화면 책임별로 나눠요

```text
frontend/
├── pages/
│   ├── components/
│   │   ├── ComponentPage.tsx   # 문서 화면 조립
│   │   ├── data/              # 웹 문서 조회·가공·파싱
│   │   ├── sections/          # 공통 문서 본문
│   │   └── examples/          # 컴포넌트별 독립 예시
│   │       └── chip/filter/   # 필터 모달·바텀시트 조합
│   └── foundation/
│       ├── color/             # 페이지별 데이터·섹션·스타일
│       ├── typography/
│       ├── layout/
│       └── common/            # 실제 공유하는 제목·섹션·토큰 조회
├── features/
│   ├── code-block/
│   ├── docs-catalog/          # 목록·경로·검색 별칭
│   ├── docs-toc/              # 공통 목차·앵커·활성 상태
│   ├── docs-navigation/
│   └── docs-search/
├── layouts/                  # Header·Footer·DocsLayout
└── shared/
    ├── styles/
    └── ui/                   # 설치 소스와 웹사이트 공통 UI
```

공통 미리보기는 배치만 담당하고 각 컴포넌트의 동작·스타일은 해당 예시에서 관리해요. `content`에는 원본 JSON·생성 데이터·조회 계약을 유지하며 웹 전용 조합은 페이지의 `data`에서 처리해요. 공통 `Overlay`는 포털·포커스·스크롤 잠금·닫힘 완료만 담당하고, 메뉴·검색·필터의 배치와 모션은 사용처에 둬요. CLI 설치 소스와 `.eli` 기록은 일반 폴더 재배치 대상에서 제외해요.

## 설치한 ELI 소스를 사용해요

게시된 CLI `eli-design@0.6.0`으로 초기화하고 UI 콘텐츠 `0.3.0`의 Button을 설치했어요. 기록은 [`../.eli/config.json`](../.eli/config.json)과 [`../.eli/lock.json`](../.eli/lock.json), 설치 위치는 `shared/ui`예요. 아래는 이번에 실행한 명령이며 기존 초기화를 다시 실행하지 않아요.

```bash
npm exec --yes --package=eli-design@0.6.0 -- eli-design init --dir frontend/shared/ui --cwd apps/docs
npm exec --yes --package=eli-design@0.6.0 -- eli-design add button --cwd apps/docs
```

다음 컴포넌트도 같은 문서 앱에서 `add <항목>`으로 추가해요. 공통 파일은 같은 콘텐츠 버전에서 재사용하고, 실제 import 경로는 CLI 출력으로 확인해요. `npm install @eli-design/ui`나 UI 원본의 직접 import는 사용하지 않아요. 기존 설치 소스를 갱신하는 기능과 새 컴포넌트 추가는 구분해요.

Foundation에 이어 컴포넌트 문서의 실제 예시를 위해 같은 콘텐츠 버전의 공개 컴포넌트를 CLI로 추가했어요. Button은 개별 설치로 시작했고 전체 문서 예시를 제작하는 이번 단계에서 명시적으로 `eli-design add --all`을 실행했어요. 하네스는 설치하지 않았어요. 이후 디자이너가 확정한 Neutral 50·75와 `Background/DefaultAlpha`를 미배포 UI 원본에 반영하고 이 소비 앱의 `colors.css`, `semantic-colors.css`에도 의도적으로 적용했어요. 이 두 파일은 게시된 `0.3.0`과 다르며 `.eli` 기록을 수정해 숨기지 않아요. CLI `status`에서는 수정 파일로 표시되고, 새 컴포넌트 추가 시 공유 토큰 충돌로 중단될 수 있어요. 다음 공식 UI 콘텐츠 릴리스 후 별도 소스 이전으로 맞춰야 하며 자동 업데이트가 완료됐다고 안내하지 않아요.

공통 스타일 진입점 `shared/styles/site.ts`는 설치된 Button CSS의 토큰 연결을 재사용해요. Button 자체와 같은 CSS 모듈을 참조하므로 토큰을 별도로 선언하거나 다시 import하지 않아요. Pretendard Variable `1.3.9`와 Geist Mono `5.3.0`은 해당 진입점에서 로드해요. 실제 폰트 파일은 npm 의존성에서 로컬 번들되며 CDN에 요청하지 않아요. Figma 에셋은 `../public/assets`에 원본 그대로 저장해요.

## 준비한 요소를 조립해요

- Header는 `links`로 실제 링크를 받아요. 검색·메뉴는 `searchAction`, `menuAction`에 해당 기능의 Client Component를 전달해요. 기본 아이콘 버튼은 연결 전 UI이며 검색·메뉴를 열지 않아요. `HeaderAction`을 재사용해 기능의 클릭 동작을 연결할 수 있어요.
- Footer는 `children`으로 최종 문구를 받아요. Storybook의 예시 문구는 서비스 기본값이 아니에요.
- CodeBlock은 `code`, `language`, `defaultExpanded`, `label`을 받아요. 6줄 이하 코드는 바로 표시하고, 긴 코드의 기본 6줄 미리보기에서 ‘코드 보기’를 누르면 펼쳐지고 키보드 포커스가 코드 영역으로 이동해요. 펼친 뒤 최대 10줄을 표시하고 내부에서 스크롤해요. 스크롤바 표시는 숨기고 하단 여백을 확보해 마지막 줄이 가려지지 않게 하며 가로·세로·키보드 스크롤은 유지해요. 복사 버튼은 줄 번호를 제외한 원문을 복사하고 실패 메시지를 제공해요. 문법 강조는 기본 TSX이며 CSS·JSON·Bash 등은 `language`로 선택해요. 알 수 없는 언어와 언어가 없는 문서 구조도는 원문으로 표시해요. 전체 코드를 분석한 뒤 React 텍스트로 렌더링하므로 여러 줄 주석·문자열을 유지하고 코드 안의 HTML은 실행하지 않아요. 초기 펼침 prop의 이후 변경은 상태를 초기화하지 않으며 Storybook은 초기 상태 검수를 위해 이 값이 바뀌면 재마운트해요.
- Table은 `caption`, `columns`, `rows`를 받아요. `columns`의 key에 해당하는 `rows[].cells` 값을 표시해요. 표의 기본 최소 너비는 672px이며 좁은 화면에서는 표 전체가 함께 스크롤돼요.

네 요소는 웹사이트 내부용이에요. `packages/ui`의 API·배포 버전·레지스트리에 추가하지 않았어요. Header·Footer·Table은 서버에서 렌더링하고 CodeBlock의 펼침만 클라이언트 상태로 관리해요.

## Foundation 상세 페이지

디자인은 [데스크톱](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1094-52287)과 [모바일](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1094-52289)을 기준으로 만들었어요. 루트의 `pnpm dev:docs`로 문서 앱을 실행한 뒤 다음 경로에서 확인해요. 홈페이지는 이번에 제작하지 않았어요.

| 경로 | 내용 |
| --- | --- |
| `/foundation/color` | Primitive 색상과 Semantic 표 |
| `/foundation/color?tab=semantic` | Semantic을 처음부터 선택한 화면 |
| `/foundation/typography` | Heading·Body·Label 스타일별 미리보기·클래스·사양 |
| `/foundation/layout` | Scale·Padding·Gap·Radius 예시와 토큰 표 |

`app`의 라우트 파일은 입력과 메타데이터만 연결하고 `pages/foundation`의 페이지 파일은 섹션을 조립해요. 색상·크기 값은 MCP도 사용하는 `content/query.ts`에서 읽고, 사용 설명은 Figma 문구를 페이지 가까이에 보존해요. 실제 타이포와 시안 표가 다르던 H2·H3 자간은 사용자 확인에 따라 `-1%`로 표시해요.

데스크톱 왼쪽 메뉴는 설치된 ELI Navigation Drawer·Menu·Category·Divider로 구성해요. Foundation과 컴포넌트 상세 페이지로 이동해요. 시작하기와 Design Token은 준비 중으로 표시해요. 1024px 미만에서는 왼쪽 메뉴를 숨기고 모바일 헤더에서 전체 화면 메뉴를 열어요. Footer 최종 문구는 비워둬요. 헤더는 `DocsLayout`에서 viewport에 고정하고 같은 높이의 본문 공간을 확보해요. 문서 루트의 세로 overscroll을 제한하며 단독 Header Story의 배치는 유지해요.

Color 탭은 설치된 ELI Tab을 사용해요. 두 패널을 서버에서 제공하고 URL·선택·키보드만 클라이언트 Hook에서 처리해요. 방향키·Home·End로 전환하며 이미 선택한 탭을 다시 눌러도 모두 해제되지 않아요. JavaScript를 끈 상태에서도 URL에 해당하는 패널을 읽을 수 있어요. 표와 Heading 미리보기는 각 컨테이너 안에서 가로 스크롤돼요.

Foundation은 웹사이트 화면이므로 공개 UI 레지스트리에 추가하지 않아요. 표와 칩용 임시 모달·바텀시트는 웹사이트 내부용으로 유지해요. 문법 강조는 웹사이트 내부용 `refractor@5.0.0`의 필요한 언어만 등록하고 기존 ELI 팔레트를 참조해요. 공개 UI·CLI의 실행 의존성에는 추가하지 않아요. Pretendard 기본 제공도 [별도 후속 작업](../../../handbook/improvements.md#pretendard-기본-제공을-후속-작업으로-진행해요)이에요.

## 컴포넌트 문서와 모바일 상호작용

[데스크톱](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1094-52288)·[모바일](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1094-52290) 시안 기반 문서와 분리한 조립 부품 문서를 `/components/button`, `/components/chip` 같은 경로에서 확인해요. 목록은 `features/docs-catalog/catalog.ts`에 두고 페이지는 공통 레이아웃·실제 컴포넌트 예시·코드·문서 본문을 조립해요. 예시를 위한 UI 소스는 CLI 설치 기록과 함께 관리하며 서버에서 문서 ID에 해당하는 예시만 선택해요. 각 예시가 필요한 상태·스타일만 소유하며 등록되지 않은 ID는 404로 처리해요.

모든 컴포넌트 상세 문서는 `data/getDocPage.ts`가 같은 승인본·API를 읽고 `ComponentPage`가 공통 블록을 조립해요. 예시의 설명·코드는 `examples/{컴포넌트}/*.docs.ts`, 상태·렌더링은 해당 폴더의 미리보기에서 관리해요. `data/docExamples.ts`와 `examples/docPreviews.ts`는 등록만 담당하며, Client Component는 개별 export로 서버에 연결해요.

기본 UI·핵심 코드·밝은 설치 터미널·목적별 예시·선택 기준·API·접근성과 데스크톱 목차를 제공해요. Divider처럼 추가 예시가 없는 페이지에는 빈 구역을 만들지 않아요. Chip·FAB·Navigation은 조립 부품의 API·가이드를 함께 읽고 별도 소스가 필요한 예시에는 해당 설치 명령만 추가해요. 기본 설치에 관계없는 부품을 묶지 않아요. NavigationDrawer의 기본 조립 예시는 직접 import하는 세 소스를 명시해요.

기존 일곱 구역 Markdown 렌더러는 제거했어요. MCP 응답·승인된 JSON·설치한 UI와 `.eli` 기록은 변경하지 않아요. 표시 이름은 영문이며 검색용 한글 별칭은 유지해요.

- 모바일 메뉴는 오른쪽에서 들어와요. 최신 프로토타입의 400ms·`cubic-bezier(0.6694915294647217, 0.10169491171836853, 0.44915252923965454, 1)`을 사용해요. 앞서 임시 합의했던 200ms보다 이후 전달된 프로토타입을 우선했어요.
- 모바일 검색은 250ms·`cubic-bezier(0.08474576473236084, 0.26271185278892517, 0.5169491767883301, 0.8898305296897888)`로 Dim과 화면이 함께 나타나요. 실제 문서 목록의 영문·한글 이름을 검색하고 결과·빈 결과를 표시해요. 키보드는 실제 입력창을 통해 OS가 제공해요. 데스크톱 검색은 시안 대기 상태로 비활성화해요.
- 필터 칩은 모바일에서 하단 바텀시트를 200ms ease-out으로 열어요. PC에서는 최신 [필터 모달 시안](https://www.figma.com/design/DIjojLTlnfHkamoMAjrGOE/ELI--LDS-?node-id=1094-52285)의 480×360px을 기준으로 작은 화면에 맞춰 줄어드는 중앙 모달로 표시하고 둘 다 전체 화면 Dim을 제공해요. 2026-11-26 사용자 확인에 따라 두 번째 필터는 ‘소재’로 변경했어요. 성별은 라디오 단일 선택, 소재의 여섯 항목은 체크박스 복수 선택이며 적용한 값을 칩에도 표시해요. 공개 Modal의 최대 너비는 변경하지 않아요.
- 닫기·Escape와 포커스 순환·복귀·배경 조작 잠금을 연결해요. 필터의 Dim 바깥 클릭은 프로토타입처럼 자동 닫기로 연결하지 않아요. 종료 전환 중에는 배경 잠금을 유지하고 동작 감소 설정에서는 즉시 전환해요.

오버레이는 Header의 blur·container 경계에 잘리지 않도록 열 때만 포털의 대상을 결정해요. 서버의 문서 본문은 그대로 유지해요. 기본 스타일과 모션 CSS, 상태와 포커스 Hook은 책임별로 나눠요. Storybook의 `문서 웹사이트/Interactions`에서는 가상 모바일 프레임 안으로 포털을 보내 다른 검수 화면을 가리지 않아요.

## 확인해요

`pnpm dev`로 Storybook을 열고 `문서 웹사이트` 그룹에서 확인해요. `한눈에 보기`는 디자인 비교, `직접 바꿔보기`는 Controls와 왼쪽 편집 영역에서 변경해요. 웹 컴포넌트는 가짜 서비스 화면이나 디바이스 프레임으로 감싸지 않아요.

```bash
pnpm typecheck
pnpm --filter @eli/docs exec tsc --noEmit
pnpm lint
pnpm build:docs
pnpm test:docs:frontend
pnpm test:docs:foundation
pnpm test:docs:components
pnpm test:docs:pages
```

공통 컴포넌트 검사는 Storybook을 빌드하고 임시 Next.js 소비 화면으로 SSR·hydration·스크롤·폰트·로컬 에셋을 확인해요. 실제 서비스 경로에는 검수 페이지를 추가하지 않아요. Chrome·Safari 실기기·Edge 앱 검수와 자동 엔진 검수의 범위는 구분해서 기록해요.

`test:docs:frontend`는 공통 컴포넌트와 Storybook을, `test:docs:foundation`은 문서 앱을 빌드한 뒤 실제 Foundation 경로를 확인해요. Foundation 검사는 JavaScript 없는 첫 화면·탭 URL과 키보드·패널별 목차·Drawer 이동·375px 표·사양 표시와 콘솔 오류를 확인하고 결과와 화면을 `.artifacts/foundation`에 저장해요. 기존 비선택 탭·코드 줄 번호의 대비 미달은 별도 검토 항목으로 기록하며 그 밖의 대비 오류와 심각한 접근성 오류는 실패 처리해요.

Figma의 `foreground/subtle`을 사용하는 푸터 문구와 코드 줄 번호는 자동 대비 검사에서 미달로 확인됐어요. 받은 색상은 유지하고 디자이너 검토 항목으로 남겨요. 검사는 이 요소의 대비 결과를 별도로 기록하며 다른 대비 오류와 심각한 접근성 오류는 실패로 처리해요. 자동 검사 통과를 전체 접근성 검수 완료로 표현하지 않아요.

2026-11-25에 타입·린트·Storybook·문서 앱 빌드와 Chromium·WebKit·설치된 Chrome에서 임시 Next.js SSR·hydration, Story 8개와 편집 반영을 확인했어요. 결합된 페이지의 최종 CSS에서 공통 토큰 선언도 한 번만 포함됐어요. Edge 앱은 미설치 상태여서 확인하지 않았고 실제 Safari·Android·iOS 기기 검수도 남아 있어요. 실행 결과와 화면은 Git에서 제외하는 `.artifacts/docs-frontend`에 기록해요.

같은 날 Foundation의 네 화면도 Chromium·WebKit·설치된 Chrome에서 데스크톱과 375px 화면으로 확인했어요. JavaScript 없는 Semantic 초기 화면, 탭 URL·방향키·Home·End, Drawer 이동·열기·닫기, 표 내부 스크롤과 콘솔 오류 검사를 통과했어요. 공개 토큰 변경은 `pnpm check`, `pnpm test:registry`, `pnpm test:docs`로 확인했고, 웹사이트 검사를 npm 게시나 실기기 검수 완료로 취급하지 않아요. 결과와 대비 검토 항목은 `.artifacts/foundation`에 기록해요.

2026-11-25에 추가한 24개 문서의 초기 HTML과 Chromium·WebKit·설치된 Chrome에서 모바일 메뉴·검색·필터 Dim·PC 모달·바텀시트·포커스 복귀·모션 줄이기를 확인했어요. Storybook 10개와 프레임 내부 오버레이도 같은 엔진에서 확인했어요. 결과는 `.artifacts/docs-overlays`와 `.artifacts/docs-frontend`에 남겨요. 실제 Safari·Edge·Android·iOS 기기 검수와 공개 배포는 완료하지 않았어요. Figma 추가 조회 중 요금제 도구 한도에 도달해 일부 큰 프레임의 세부 조회는 완료하지 못했고, 이미 받은 상세 응답과 공통 레이아웃·실제 설치 소스를 기준으로 구현했어요.

오버레이 세 화면의 Chromium axe 검사에서는 시안의 비선택 탭·메뉴 글자 대비 외 심각한 자동 오류가 없었어요. 실제 Chip 페이지에서 로드한 CSS의 공통 토큰 선언도 한 번만 포함됐어요. 이 결과는 `.artifacts/docs-overlays/accessibility.json`에 남겼으며 전체 접근성 검수나 실기기 검수 완료를 뜻하지 않아요.

2026-11-26에는 폴더 책임을 정리한 뒤 타입·린트·문서 앱·Storybook 빌드와 문서 조회 검사 9개를 확인했어요. Chromium·WebKit·설치된 Chrome에서 24개 컴포넌트 경로, Foundation 네 화면, Storybook 10개와 Controls, SSR·hydration, 메뉴·검색·필터의 포커스·모션을 확인했어요. 설치 소스·`.eli` 기록 147개와 Header·Footer·DocsLayout의 내용은 재배치 전과 같고 Foundation·예시 CSS 선언도 유지했어요. 검증 결과와 재배치 전 원본은 `.artifacts/structure-refactor`에 보존해요. 공개 패키지 결과가 바뀌지 않아 용량·패키징 검사는 반복하지 않았어요.


## 공통 문서 UI와 검증

공통 UI의 기준은 [독스 페이지 지침](../../../Agent/docs-pages.md)이에요. 모바일에는 목차를 두지 않고 1280px 이상에서는 Primary 글자색과 왼쪽 표시선으로 현재 구역을 표시해요. 목차의 배경·글자 크기·굵기는 고정해요. 문서 전환은 첫 화면부터 상단에 표시하며 같은 페이지의 목차 이동만 부드럽게 유지해요.

설치 영역은 npm·pnpm·yarn·Bun 탭과 프롬프트 없는 밝은 중립 배경의 명령만 표시해요. 초기 설정·폰트 등 부가 설명은 넣지 않아요. CLI 자체는 아직 `init`과 앱의 폰트 로딩이 필요하며, 자동 초기화·폰트 포함·복사 아이콘은 [별도 후속 작업](../../../handbook/improvements.md)이에요.

선택 기준은 권장·피할 상황을 위아래로 배치하고 각 선택지는 가로 구분선·여백·굵은 제목으로 구분해요. 카드 외곽선은 사용하지 않아요. API는 속성명·타입·기본값·설명을 분리하고 반복되는 상세 펼침 없이 읽을 수 있게 해요. 필수·선택은 pill로 구분하며 필수 항목을 먼저 보여줘요. 문자열 허용 값은 배경 없이 따옴표·구분자와 파란 코드 색상으로 표시해 일반 string 타입 및 상단 pill과 구분해요. 내용·설정·상태·이벤트·접근성·스타일의 표시 순서는 `orderDocProps`에서 관리하고 `className`은 항상 마지막에 둬요. API 원본의 순서는 바꾸지 않아요. 로컬 Props 상속을 읽어 NavigationDrawerMenu의 className 등 누락된 기존 속성도 표시해요. 코드 식별자는 인라인 코드로, 중요한 판단 기준은 굵게 표시해요.

`pnpm test:docs`는 전체 문서 등록·API·하위 부품·설치 명령·앵커와 모든 예시의 실제 설치 소스 타입을 확인해요. `tests/docs/pages.mjs`는 프로덕션 서버에서 전체 경로의 복사·설치 탭·목차·반응형·SSR·접근성과 대표 동작을 확인하며 `tests/docs/components.mjs`는 모바일 메뉴·검색·필터 조합의 동작도 확인해요. 자동 브라우저 검수와 실제 Safari·Edge·모바일 실기기 검수는 구분해요.

2026-11-27에 컴포넌트 문서 24개·하위 부품을 포함한 API 34개·실제 예시 69개에 공통 구성을 적용했어요. 문서 검사 19개(전체 예시 타입과 설치 의존성 포함), 루트·문서 앱 타입, 린트, 문서 앱·Storybook 빌드를 확인했어요. 24개 컴포넌트 경로는 정적으로 사전 렌더링돼요.

Chromium·WebKit·설치된 Chrome에서 전체 문서의 설치/복사·목차·SSR·375px·제어 예시와 Modal을 확인했어요. Chromium·WebKit에서는 모바일 메뉴·검색·필터 모달/바텀시트·포커스·모션도 확인했어요. 이후 하위 제목 계층과 Snackbar 조합의 Button 설치를 보완한 최종 빌드에서 관련 다섯 문서를 세 브라우저로 재검증했어요. 비색상 심각/치명 접근성 오류가 없었으며 색상 대비·실제 Safari·Edge·모바일 실기기 검수 완료를 뜻하지 않아요.

실행 로그는 `.artifacts/docs-all`, 전체 문서 화면은 `.artifacts/docs-pages`, 오버레이 검수는 `.artifacts/docs-overlays`에 남겼어요. UI·CLI 소스·설치 기록·가이드 등 보호 파일 400개는 작업 시작 시 해시를 유지했고 관련 문서 상대 링크·앵커 79개를 확인했어요. 공개 배포 파일·실행 의존성을 변경하지 않아 UI/CLI 패키징·용량·패키지 매니저 행렬은 반복하지 않았어요. 커밋·PR·배포는 이번 작업에 포함하지 않았어요.

헤더 고정 후 Chromium·WebKit의 1440px·375px 컴포넌트/Foundation 화면에서 상단 연속 휠 중 헤더 위치·높이·너비와 본문 시작점을 확인했어요. 검사 스크립트는 `.artifacts/docs-header`에 남겼고 CSS만 바뀌어 전체 빌드는 반복하지 않았어요. 실제 Safari·모바일 기기의 탄성 제스처 검수는 별도예요.

API 순서·pill 변경 후 문서 검사 21개와 문서 앱 타입·관련 린트·프로덕션 빌드를 통과했어요. Chromium·WebKit에서 전체 34개 API의 순서·필수/선택 pill·className 마지막 배치와 375px 넘침을 확인했어요. API 영역의 pill 색상 대비도 확인했고 화면·검사 스크립트는 `.artifacts/docs-api`, 단위 검사 로그는 `.artifacts/docs-api-order-unit.log`에 남겼어요. 로컬 Omit/Pick 상속 추출은 원래 허용된 Props의 문서 누락을 보완하며 UI 소스·API·가이드 JSON은 변경하지 않았어요.

허용 값의 배경을 제거한 표현은 문서 앱 타입·관련 린트와 Chromium에서 따옴표/구분자·일반 타입과의 색상 구분·API 색상 대비·375px 넘침을 확인했어요. 화면은 `.artifacts/docs-api-literals`에 남겼고 고립된 표시 변경이므로 전체 빌드·검사 행렬은 반복하지 않았어요.

### 조립 컴포넌트 안내

Navigation Bar와 Glass는 별도 문서로 안내하고 각 Item은 해당 상위 문서의 API에 포함해요. 상단 관련 링크는 표시하지 않아요. 긴 컴포넌트 이름은 우측 목차에서 한 줄로 표시해요. 목차 열은 가장 긴 항목에 맞춰 너비를 확보하고 글자 크기는 유지해요. 모바일 전용 컴포넌트에만 이름 옆 `Mobile` pill을 표시하고 `Web` 표시나 별도 플랫폼 문장은 넣지 않아요. `items` 필드별 타입·필수 여부 펼침은 유지해요. Drawer 등 구성 요소는 반복되는 사용 권장 대신 역할 요약·API·조립 시 주의사항과 동작으로 설명해요. 선택 기준은 상위 컴포넌트와 독립적으로 고르는 형태에 제공해요. 승인된 가이드 JSON·MCP·공개 API는 유지해요.

Drawer 웹 문서에는 목표 명령인 `add navigation-drawer`만 선반영했어요. 현재 설치기에는 Category·Menu의 별도 설치가 필요하며, 루트 하나로 구성 요소를 받는 개선은 [후속 작업](../../../handbook/improvements.md#조립-컴포넌트의-기본-설치에-구성-요소를-포함해요)에 기록했어요.

통합 후 문서 검사 22개(모든 예시 타입·설치 의존성·구성 요소 분류·조립 제약 보존 포함), 문서 앱 타입·관련 린트를 확인했어요. Chromium·WebKit에서 Navigation·Drawer·FAB의 통합 표시·중복 안내 제거·API 주의사항·375px 화면과 Drawer 펼침, 분리했던 경로의 404를 확인했어요. 결과는 `.artifacts/docs-composition`에 남겼어요. UI 원본·CLI·설치 소스·승인된 가이드 등 400개 보호 파일은 유지했으며 전체 빌드·배포 검사는 반복하지 않았어요.

Bar·Glass를 별도 페이지로 분리한 뒤 문서 검사 22개·문서 앱 타입·관련 린트를 확인했어요. Chromium·WebKit에서 두 페이지의 모바일 안내·각 Item API·선택 동작과 상단 링크 부재를 확인했어요. 1280·1440·1920px에서 목차의 모든 항목이 한 줄로 표시되고 가로 스크롤이 없으며, 375px에서는 목차가 숨겨지는 것도 확인했어요. Drawer 목차는 실제 긴 이름에 맞춰 207px를 확보하고 앵커 이동을 유지해요. 결과는 `.artifacts/docs-bar-glass`에 남겼어요. 이번에는 전체 빌드·배포 검사를 반복하지 않았어요.

### 시각적인 조립 구성도

Drawer·Navigation Bar·Glass·FAB Menu·Select·Modal의 조립 관계를 `구성` 구역에서 확인해요. 공통 `DocComposition`이 부품 카드·역할 미니어처와 선택·반복 표시를 조합해요. 직접 배치하는 Drawer 부품과 목록에서 자동 생성되는 Item을 구분하며, FAB 문서의 구성도는 `FabMenu`라는 이름을 명시해 단독 Fab과 구분해요. Modal의 Dim은 내부 전용으로 표시해요. 실제 DOM·설치 의존 그래프는 아니며 Drawer의 기본 설치 개선은 앞서 기록한 후속 작업으로 유지해요.

구성 메타데이터는 `pages/components/data/docAssemblies.ts`, 표시와 스타일은 `sections/DocComposition`에서 관리해요. 부품 이름은 실제 API에서 조회하며 새 조회 API·실행 의존성·클라이언트 상태는 추가하지 않았어요.

구성도 적용 후 문서 검사 23개(자동 구성 부품의 실제 레지스트리 참조·구성 방식·이름 포함), 문서 앱 타입·관련 린트·프로덕션 빌드를 확인했어요. Chromium·WebKit에서 여섯 구성도의 서버 HTML·목차·375px 재배치·가로 넘침·axe 접근성과 단일 Button 문서에서 구성도 생략을 확인했어요. 결과와 화면은 `.artifacts/docs-assembly`에 남겼어요. 보호 대상 400개 파일은 유지했고 공개 UI·CLI의 전체 배포 검사는 반복하지 않았어요.

### Properties 공통 구성

전체 25개 문서에 Properties·상태와 이벤트·전체 속성의 공통 구성을 적용했어요. 시각적인 선택은 `Properties`, 상태 연결은 `상태와 이벤트`, 소비 앱이 구성하는 화면 패턴은 `조합 예시`에서 확인해요. 내용이 없는 구역은 만들지 않아요. Properties와 상태·이벤트의 소제목·목차는 실제 prop 이름으로 표시하고 소제목은 20px로 맞춰요. 각 비교 UI 아래에 해당 값을 표시하고 이름·기본값·필수 여부는 실제 API 조회 결과에서 연결해요. Button의 비활성화와 클릭 연결은 별도 `상태와 이벤트`에서 확인해요. 같은 예시를 다른 구역에 반복하지 않아요.

하단 `전체 속성`은 접지 않고 내용·설정·상태와 이벤트·스타일별로 정확한 타입·기본값·전체 설명을 바로 표시해요. 개별 속성의 반복된 구분선은 제거하고 그룹 사이 구분선·제목·여백으로 정리해요. `className`은 마지막에 유지하고 기존 `#api` 경로도 유지해요. 하위 구성 요소의 전체 속성도 같은 분류·구분선·필수 표시 기준을 사용해요. 하위 컴포넌트의 props를 설명할 때는 해당 컴포넌트의 이름과 실제 조회 결과를 사용해요. 기존 조회·승인된 JSON·공개 API·버전은 변경하지 않았어요.

시범 적용 후 문서 검사 24개(예시 타입·설치 의존성·Properties 분류·속성 누락 방지 포함), 문서 앱 타입·관련 린트·프로덕션 빌드를 확인했어요. Chromium·WebKit에서 Button·Badge의 기본값·비교 값·코드 복사·전체 속성 키보드 펼침·Button 상태와 클릭 연결·목차·375px 화면을 확인했어요. 새 메타 정보와 속성 참조 영역의 axe 검사, Modal·Drawer의 기존 구성을 확인했고 결과와 화면은 `.artifacts/docs-properties`에 남겼어요. 보호 대상 400개 파일과 공개 계약은 유지했으며 전체 UI·CLI 배포 검사는 반복하지 않았어요.

후속 표시 조정에서는 Properties·상태와 이벤트의 제목·목차를 실제 prop 이름으로 통일하고 소제목을 20px로 조정했어요. 전체 속성을 바로 표시하며 속성별 구분선을 제거하고 그룹 사이 구분선만 유지해요. 문서 검사 24개·문서 앱 타입·관련 린트와 Chromium·WebKit의 제목·글자 크기·속성 표시·구분선·클릭·375px 화면을 확인했어요. 결과는 `.artifacts/docs-properties-visible`에 남겼고 고립된 표시 수정이므로 전체 빌드·배포 검사는 반복하지 않았어요.

FAB 웹 문서에는 목표 명령인 `add fab`만 선반영하고 `items` 안의 추가 설치 코드는 표시하지 않아요. 실제 설치 동작은 아직 FabMenu → Fab·FabMenuSegment 방향이에요. `add fab`만으로 메뉴가 따라오도록 하는 설치 변경은 [후속 작업](../../../handbook/improvements.md#fab-구성의-기본-설치도-함께-정리해요)이에요. Slider는 숫자 표시의 절대 위치가 미리보기 크기에 빠지지 않게 전용 여백을 확보하고 끝 값의 표시 공간까지 포함해 중앙에 배치해요. 실제 Slider 소스는 변경하지 않았어요.

### Properties 전체 적용 검증

전체 25개 문서·34개 속성 참조·70개 예시를 같은 구성으로 정리했어요. 의미 있는 시각 선택을 제공하는 10개 문서에 Properties, 상태를 연결하는 19개 문서에 상태와 이벤트를 제공하며 내용이 없으면 생략해요. 문서 검사 24개에서 실제 props·소유 컴포넌트·기본값·중복·속성 누락·설치 의존성을 확인했고, 문서 앱 타입·관련 린트·프로덕션 빌드를 통과했어요.

Chromium·WebKit·설치된 Chrome에서 25개 경로의 실제 prop 제목·20px 크기·전체 속성 상시 표시·className 마지막 배치·그룹 구분선·설치 명령·복사·목차·상태 연결·SSR·375px 화면을 확인했어요. 전체 검사 결과는 `.artifacts/docs-properties-all-browser.log`와 `.artifacts/docs-pages`에 남겼어요. 이후 변경한 FAB의 한 곳 설치 안내와 Slider의 기본·범위·제어 예시·양 끝 값·중앙 배치는 최신 프로덕션 빌드에서도 같은 세 브라우저로 별도 확인했어요. 마지막 결과는 `.artifacts/docs-properties-all-final`과 `.artifacts/docs-slider-preview`에 있어요.

실제 Safari·Edge·모바일 실기기 검수를 이번 결과에 포함하지 않아요. UI·CLI·설치 소스·기록·승인된 가이드 등 400개 보호 파일은 유지했고 공개 UI·CLI의 전체 배포 검사는 반복하지 않았어요.

### 설치 안내 선반영 상태

사용자 요청에 따라 FAB와 Drawer의 웹 설치 명령을 각각 `add fab`, `add navigation-drawer` 하나로 먼저 맞췄어요. 기본 예시의 `installStatus: planned`와 페이지 데이터의 `installationStatus`에 내부 진행 상태를 남기며 웹 설치 영역에는 기존처럼 명령만 표시해요. 실제 레지스트리·CLI·설치 기록은 변경하지 않았어요.

현재 안내 명령만으로 FAB의 Menu와 Drawer의 Category·Menu가 모두 제공되지는 않아요. 설치 import 검사는 이 두 문서의 알려진 누락을 정확히 확인하고 다른 누락은 계속 실패시키며, 실제 구성 요소 자동 설치 소비 검사는 TODO로 남겨요. 다음 설치 구현에서 의존성을 연결·검증한 뒤 예정 상태·알려진 누락·TODO를 함께 해제해야 해요. 웹 문서 선반영을 실제 설치 지원 완료로 해석하지 않아요.

선반영 검증에서는 문서 검사 24개 통과·실제 자동 설치 소비 검사 TODO 2개를 확인했어요. 문서 앱 타입·관련 린트·문서 형식과 Chromium·WebKit에서 두 페이지의 npm·pnpm·yarn·Bun 명령·복사 결과·설치 구역 단일 표시·375px 넘침을 확인했어요. 결과는 `.artifacts/docs-install-preview`와 `.artifacts/docs-install-preview-unit.log`에 남겼어요. 이번에는 명령·문서 메타데이터만 바꿔 전체 빌드·UI/CLI 배포 검사를 반복하지 않았으며, 400개 보호 파일과 실제 설치 구현은 유지했어요.

### Foundation 가독성 정리

Color·Typography·Layout도 컴포넌트 문서와 같은 본문 너비·제목 위계·데스크톱 목차를 사용해요. `features/docs-toc`는 두 페이지 계열이 공유하고 페이지별 구역 정의·데이터·스타일은 각 Foundation 폴더에서 관리해요. Color의 목차는 Primitive·Semantic 탭과 같은 URL 선택값을 사용하며 이전 패널의 앵커는 탭 전환 시 정리해요.

도입 설명은 역할별로 나누고 CSS 토큰·클래스의 짧은 사용 예시를 추가했어요. Semantic 값은 색상 면 밖에서 읽고, Typography는 긴 사양 표 대신 스타일별 실제 클래스·미리보기·전체 사양을 같은 묶음으로 확인해요. Layout의 실제 스케일·간격·모서리 값은 유지해요. 컴포넌트 문서의 선택 기준은 제목 위의 선만 제거하고 아래 구분선·항목 사이 선과 여백을 유지해요. 토큰·공개 API·CLI·하네스와 승인된 가이드는 변경하지 않았어요.

Foundation 정리 후 문서 검사 24개 통과·기존 설치 소비 TODO 2개 유지, 문서 앱 타입·관련 린트·프로덕션 빌드를 확인했어요. Chromium·WebKit·설치된 Chrome에서 네 Foundation 화면의 SSR·탭 URL/키보드·패널별 목차·이전 해시 정리·Typography 9개 스타일·기존 폰트 크기·모바일 사양·표 스크롤·접근성을 확인했어요. Button의 선택 기준 위 선 제거·아래 선 유지와 기존 Drawer 목차도 회귀 확인했어요. 기존 비선택 탭·코드 줄 번호의 색상 대비는 별도 검토 항목으로 기록하고 실제 Safari·Edge·모바일 실기기 검수와 구분해요. 결과는 `.artifacts/foundation-refresh-browser.log`, `.artifacts/foundation`, `.artifacts/foundation-refresh`에 남겼어요. UI·CLI·토큰·설치 기록·가이드 등 보호 대상 400개 파일은 유지했고 공개 배포 검사는 반복하지 않았어요.

### 홈 확인용 진입점

홈 시안 구현 전 `/`에는 `Foundation 확인하기` 버튼만 표시하고 `/foundation/color`로 이동해요. 화면은 `pages/home`에 두고 라우트는 연결만 담당하며, 설치한 ELI Button을 재사용해요. 홈페이지 디자인 구현 완료를 뜻하지 않아요. 관련 린트·문서 형식과 로컬 브라우저의 실제 이동을 확인했고 전체 빌드는 반복하지 않았어요.


### PR 준비 시 최종 검증

2026-11-27 최종 변경에서 `pnpm check`, `pnpm build:docs`, `pnpm test:registry`와 문서 검사(24개 통과·실제 설치 소비 TODO 2개)를 확인했어요. Chromium·WebKit·설치된 Chrome에서 컴포넌트 25개 문서와 Foundation 네 화면, Chromium·WebKit에서 모바일 메뉴·검색·필터·포커스·모션을 확인했어요. Navigation Bar와 Glass의 검색 결과를 각각 정확한 이름으로 검사해요. 수정 Markdown 상대 링크 226개와 `git diff --check`도 확인했어요. 내부 UI tarball은 압축 142,712 B·해제 533,667 B·327개 파일이며 전체 설치 다운로드량과 구분해요. 실제 Safari·Edge·모바일 실기기, 색상 대비 전체 적합성과 공개 배포는 이번 결과에 포함하지 않아요. FAB·Drawer의 구성 요소 자동 설치는 별도 브랜치 작업이며 이 문서 PR의 TODO는 유지해요.
