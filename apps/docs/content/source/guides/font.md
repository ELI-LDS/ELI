---
title: 글꼴 연결
description: Pretendard Variable 가변 다이나믹 서브셋을 전역에 한 번 연결하고 실제 로딩을 확인해요.
---

# Pretendard Variable을 연결해요

ELI 하네스의 기본 글꼴은 Pretendard Variable이에요. 컴포넌트 소스는 글꼴 파일이나 CDN을 자동으로 불러오지 않아요. 기본 CSS·토큰 연결과 실제 글꼴 다운로드를 구분해요.

ELI에서는 공식 배포 방식 중 가변 다이나믹 서브셋을 사용해요. font-family는 `"Pretendard Variable"`이며 브라우저가 필요한 문자 구간의 글꼴 파일을 받아요. 아래 예시는 2026-11-25에 확인한 공식 패키지 1.3.9로 고정했어요. 글꼴 버전은 CLI·UI 콘텐츠·하네스 버전과 독립적이에요.

## 기존 연결부터 확인해요

package.json·lockfile, 전역 진입점, CSS의 @import·@font-face와 HTML의 stylesheet 링크를 찾아요. 이미 가변 다이나믹 서브셋이 정상 연결되어 있으면 설치하거나 import를 반복하지 않아요. 다른 글꼴이나 정적 Pretendard를 지우거나 바꾸기 전에는 사용자와 기존 용도를 확인해요.

## 번들러가 있는 앱

프로젝트의 패키지 매니저로 한 번만 추가해요. 기존 lockfile을 유지하며 아래 중 하나를 선택해요.

| 패키지 매니저 | 명령 |
| --- | --- |
| npm | `npm install pretendard@1.3.9` |
| pnpm | `pnpm add pretendard@1.3.9` |
| Yarn | `yarn add pretendard@1.3.9` |
| Bun | `bun add pretendard@1.3.9` |

전역 진입점에 다음 import를 한 번만 추가해요.

```ts
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
```

| 앱 | 연결 위치 |
| --- | --- |
| Next.js App Router | 루트 app/layout.tsx 또는 src/app/layout.tsx |
| Next.js Pages Router | pages/_app.tsx 또는 src/pages/_app.tsx |
| Vite React | src/main.tsx 같은 실제 앱 진입 파일 |
| 그 밖의 번들러 | 프로젝트가 사용하는 전역 스타일 진입점 |

이 import는 폰트를 위한 것이며 별도 ELI CSS import가 필요하다는 뜻은 아니에요. 설치된 컴포넌트는 자신의 CSS와 토큰을 자동 연결해요. Next.js의 루트 layout을 폰트 import 때문에 Client Component로 바꾸지 않아요.

## HTML에서 연결해요

번들러가 없는 HTML은 head에 공식 CDN stylesheet를 한 번 연결해요. npm import와 동시에 추가하지 않아요.

```html
<link rel="stylesheet" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

외부 CDN을 사용할 수 없는 앱은 프로젝트의 자산 배포 방식으로 파일을 제공해요. CSS만 복사하고 상대 경로의 woff2·서브셋 파일을 누락하지 않아요. 배포 위치·CSP·CORS 때문에 로딩이 막히지 않는지 확인해요.

## 전역 글꼴과 토큰을 연결해요

ELI 토큰이 연결된 앱에서는 기존 전역 스타일에 한 번 적용해요.

```css
body {
  font-family: var(--eli-font-family-sans);
}
```

ELI 컴포넌트는 해당 토큰을 사용해요. 프로젝트가 직접 만든 네이티브 입력·버튼은 필요하면 font: inherit로 연결해요. --eli-font-family-sans를 다른 글꼴로 다시 정의하거나 구성 요소마다 font-family를 중복 선언하지 않아요. 토큰 값과 타이포그래피 묶음은 get_tokens에서 확인해요.

## Next.js에서 CSS 연결을 기본으로 해요

Pretendard 자체는 공식 안내처럼 next/font/local로 사용할 수도 있어요. 그러나 ELI 하네스의 기본 연결 방식은 위 패키지 CSS import예요. next/font가 생성한 글꼴 클래스만 body에 지정하면, `"Pretendard Variable"`을 명시한 ELI 토큰과 다른 글꼴 이름을 참조할 수 있어요. 추가 연결 설정 없이 두 방식을 섞지 않으며 기본 안내에서는 next/font/local을 사용하지 않아요.

## 브라우저에서 확인해요

- 개발자 도구에서 글꼴 CSS와 실제 woff2 요청의 성공·렌더링된 글꼴을 확인해요. 계산된 font-family 목록에 이름이 있다는 것만으로 실제 다운로드 성공을 판단하지 않아요.
- 대표 한글·영문과 사용하는 굵기를 표시해요. 가변 서브셋의 일부 문자만 확인하고 모든 언어·브라우저 검수가 끝났다고 기록하지 않아요.
- 브라우저 콘솔에서 아래처럼 명시적으로 글꼴을 로딩할 수 있어요. 반환 배열이 비어 있으면 해당 font-face가 등록됐는지 먼저 확인해요.

```js
await document.fonts.load('400 16px "Pretendard Variable"', '가나다 ABC');
```

- 실패를 시스템 글꼴로 조용히 대체해 완료했다고 보고하지 않아요. 중복 연결과 네트워크 오류를 확인해요.
- DESIGN.md에 사용한 글꼴 버전·연결 방법·진입 파일과 확인 날짜를 기록해요. CLI가 폰트 설치·연결을 자동 처리했다고 안내하지 않아요.

## 근거

- [Pretendard 공식 안내](https://github.com/orioncactus/pretendard#가변-다이나믹-서브셋)
- [Next.js 전역·외부 CSS](https://nextjs.org/docs/app/getting-started/css)
- [Next.js font 모듈](https://nextjs.org/docs/app/api-reference/components/font)
