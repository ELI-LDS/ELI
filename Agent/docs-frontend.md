# 문서 프론트엔드 구조

`apps/docs/frontend`는 ELI 문서 웹페이지의 화면과 사용자 동작을 관리해요. Next.js 라우팅은 `apps/docs/app`에 두고, 라우트 파일은 `frontend/pages`의 페이지 컴포넌트를 연결하는 역할만 맡아요.

이 문서의 `pages`는 Next.js의 Pages Router가 아니에요. 실제 URL과 레이아웃 경계는 App Router의 `app` 폴더가 관리해요.

## 페이지는 조립만 해요

페이지 컴포넌트는 여러 Section, Feature와 Layout을 조립해 최종 화면을 만들어요. 데이터 가공, 복잡한 상태 관리와 세부 UI를 페이지 파일 안에 길게 작성하지 않아요.

```tsx
export function ComponentDetailPage() {
  return (
    <DocsLayout>
      <ComponentHeader />
      <ComponentPreview />
      <UsageSection />
      <PropsSection />
    </DocsLayout>
  );
}
```

`apps/docs/app/**/page.tsx`에서는 URL 파라미터와 Next.js 입력을 받은 뒤 대응하는 페이지 컴포넌트를 연결해요. 페이지 전용 화면 요소는 같은 페이지 폴더의 `sections`에 둬요.

## 프론트엔드 폴더의 역할을 구분해요

```text
apps/docs/frontend/
├── pages/       # URL 단위의 최종 화면 조립과 페이지 전용 코드
├── features/    # 검색·코드 복사처럼 여러 페이지에서 재사용하는 사용자 기능
├── layouts/     # Header·Sidebar처럼 여러 페이지가 공유하는 화면 틀
└── shared/      # 특정 페이지나 기능을 모르는 공통 UI·Hook·유틸리티·스타일
```

- `pages/{페이지}/`에는 `{이름}Page.tsx`와 필요한 `sections`, `api`, `data`, `hooks`, `types.ts`를 함께 둬요.
- `features/{기능}/`에는 기능의 UI, API, Hook, 타입과 스타일을 함께 둬요.
- `layouts/{레이아웃}/`에는 공통 배치와 그 배치를 구성하는 UI를 둬요.
- `shared/`에는 문서 도메인과 무관하게 사용할 수 있는 코드만 둬요.
- 폴더 형식을 맞추려고 빈 `api`, `data`, `hooks`, `types` 폴더를 미리 만들지 않아요. 실제 코드가 생길 때 추가해요.

컴포넌트와 파일 이름은 [공통 컨벤션](conventions.md#이름을-맞춰요)을 따라요. 구조 폴더는 소문자, React 컴포넌트 폴더와 파일은 PascalCase, Hook과 유틸리티는 camelCase로 작성해요.

## 사용하는 곳 가까이에 둬요

처음부터 재사용을 예상해 코드를 공통 폴더에 두지 않아요.

1. 한 페이지에서만 사용하면 해당 `pages` 폴더에 둬요.
2. 둘 이상의 페이지에서 같은 사용자 기능을 사용하면 `features`로 옮겨요.
3. 특정 기능과 문서 도메인을 몰라도 되는 코드가 되면 `shared`로 옮겨요.

다른 페이지의 `sections`를 직접 가져오지 않아요. 재사용이 확인되면 역할에 따라 `features`, `layouts` 또는 `shared`로 이동해요.

## API와 Hook도 기능 가까이에 둬요

모든 요청 함수나 Hook을 전역 폴더 하나에 모으지 않아요.

- 특정 페이지에서만 쓰는 요청과 Hook은 해당 페이지의 `api`와 `hooks`에 둬요.
- 여러 페이지가 공유하는 요청과 Hook은 관련 `features` 폴더에 둬요.
- 실제 HTTP 요청은 `api`, 같은 Next.js 서버의 `content/query.ts`를 직접 사용하는 조회는 `data`에 둬요.
- 인증 헤더나 응답 파싱처럼 모든 요청이 공유하는 낮은 수준의 HTTP 도구만 `shared/lib`에 둘 수 있어요.
- 화면 구조만 다시 반환하거나 값을 전달하기만 하는 Hook은 만들지 않아요.

같은 Next.js 앱의 Server Component가 문서 데이터를 읽을 때 자기 GET API를 HTTP로 다시 호출하지 않아요. `content/query.ts`를 사용하는 서버 조회 함수를 페이지나 기능의 `data`에 두고 직접 호출해요. 브라우저에서 사용자 입력에 따라 서버 응답이 필요할 때만 대응하는 API를 호출해요.

## 의존 방향을 지켜요

```text
app → pages → features → shared
       ├────→ layouts ──→ shared
       └────→ content
              ▲
features ─────┘
```

- `shared`는 `features`, `layouts`, `pages`를 import하지 않아요.
- `features`는 `pages`를 import하지 않아요.
- `layouts`는 `pages`나 특정 Feature의 동작을 소유하지 않아요.
- `frontend`는 `backend` 구현을 직접 import하지 않아요.
- 페이지와 Feature는 공용 문서 조회가 필요할 때 `content`의 공개 조회 함수만 사용해요.

순환 참조가 생기면 공통 폴더로 바로 이동하지 않고 책임이 잘못 나뉘었는지 먼저 확인해요.

## 서버 렌더링을 기본으로 사용해요

모든 문서 페이지는 첫 응답 HTML에 제목, 본문과 주요 탐색 콘텐츠를 포함해야 해요. 브라우저가 JavaScript를 실행한 뒤에야 핵심 문서가 나타나는 CSR 전용 페이지를 만들지 않아요.

페이지, Section과 Layout은 기본적으로 Server Component로 작성해요. 상태, Effect, 이벤트 처리 또는 브라우저 API가 필요한 가장 작은 컴포넌트에만 `'use client';`를 붙여요. Client Component도 서버가 만든 초기 HTML과 hydration을 지원해야 해요.

- Hook을 사용한다는 이유로 페이지 전체를 Client Component로 바꾸지 않아요.
- 핵심 문서 데이터를 `useEffect`에서 처음 불러와 빈 화면을 채우지 않아요. 서버에서 먼저 조회해 Page나 Section에 전달해요.
- 서버 전용 조회와 비밀 값은 Client Component가 import할 수 있는 파일에 두지 않아요.
- Client Component에 전달하는 props는 직렬화할 수 있는 값으로 구성해요.
- URL로 표현할 수 있는 검색어·필터·선택 상태는 필요한 경우 `searchParams`와 경로를 먼저 검토해요.
- `window`, `document`, `localStorage` 같은 브라우저 API를 렌더링 중에 사용하지 않아요. 이벤트나 Effect 안에서 사용하고 서버와 브라우저의 첫 마크업을 같게 유지해요.
- 제목과 설명 같은 검색·공유 메타데이터는 서버에서 생성해 초기 응답에 포함해요.

정적 문서는 Next.js가 빌드할 때 미리 서버 렌더링할 수 있어요. SSR을 지원한다는 이유로 모든 경로에 요청 시점 동적 렌더링을 강제하지 않아요. 사용자별 데이터나 요청마다 달라지는 값이 있을 때만 동적 렌더링을 사용해요.

## ELI 컴포넌트를 우선 사용해요

문서 웹페이지에서도 `@eli-design/ui`의 공개 경로를 사용해요. 패키지 내부 구현 파일을 직접 가져오지 않아요. 문서 사이트에만 필요한 조합은 `frontend`에서 만들고, 문서 사이트의 요구만으로 라이브러리의 공개 API를 임의로 넓히지 않아요.

스타일은 페이지 전역 reset을 최소화하고 컴포넌트 가까이에 둬요. 공통 디자인 토큰과 ELI 컴포넌트의 기본 상태를 그대로 활용하고, 문서 사이트에서 덮어쓴 상태는 Hover·Pressed·Disabled와 모바일 환경까지 함께 확인해요.

## 완료 전에 확인해요

- `app`의 라우트 파일이 화면 구현을 직접 소유하지 않는지 확인해요.
- 페이지가 Section과 Feature를 조립하는 역할에 집중하는지 확인해요.
- API, 데이터 조회와 Hook이 실제 사용 위치 가까이에 있는지 확인해요.
- 재사용되지 않는 코드가 `shared`나 `features`로 먼저 올라가지 않았는지 확인해요.
- Server Component와 Client Component 경계가 필요한 만큼만 설정됐는지 확인해요.
- JavaScript 실행 전의 초기 HTML에도 주요 문서 콘텐츠가 있는지 확인해요.
- hydration 오류와 서버·브라우저 첫 화면 차이가 없는지 확인해요.
- 키보드, 터치, 좁은 화면과 다양한 브라우저에서 같은 작업을 완료할 수 있는지 확인해요.
- 실행 검증은 [검증 기준](testing.md)에 따라 변경 위험도에 맞게 진행해요.

현재는 폴더 경계와 구현 원칙만 정했어요. 실제 페이지, API 호출 함수, Hook과 공통 UI는 요구사항이 확정될 때 추가해요.
