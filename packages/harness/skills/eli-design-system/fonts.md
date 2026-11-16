# 글꼴은 Pretendard로 고정해요

프로젝트의 글꼴을 연결하거나 글꼴에 대한 요청을 받았을 때 읽어요.

## 원칙

- **전역 글꼴은 Pretendard예요.** 다른 글꼴로 바꾸지 않아요. 제목용 글꼴이나 영문용 글꼴도 따로 넣지 않아요.
- **`--eli-font-family-sans`를 다시 정하지 않아요.** ELI의 컴포넌트와 타이포그래피 토큰은 이 변수로 글꼴을 읽어요.
- **브라우저 기본 글꼴이나 시스템 글꼴로 보이게 두지 않아요.** Pretendard를 불러오지 않으면 대체 글꼴로 보이고, 그러면 자간이 맞지 않아요.

### 왜 고정하나요

ELI의 타이포그래피 토큰은 글자 크기, 굵기, 줄 높이, 자간이 한 묶음이에요. 이 값들은 Pretendard의 글자 폭과 모양에 맞춰 정해져 있어요. 글꼴만 바꾸면 자간이 벌어지거나 붙고, 줄바꿈 위치와 버튼·입력창 안의 글자 정렬이 함께 어긋나요. 컴포넌트마다 따로 고칠 수 없는 문제라서 글꼴을 고정해요.

## 사용자가 다른 글꼴을 원하면

- 글꼴이 Pretendard로 고정되어 있고, 바꾸면 자간과 정렬이 깨진다는 점을 알려요.
- 그래도 바꾸지 않아요. 인상을 다르게 하고 싶은 것이면 글꼴 대신 굵기, 크기, 색, 여백으로 조절하자고 제안해요.
- 로고나 큰 그림 안의 글자처럼 이미지로 들어가는 글자는 이 규칙의 대상이 아니에요.

## 연결하는 방법

[Pretendard 공식 저장소](https://github.com/orioncactus/pretendard)의 안내를 따라요. 공식 안내의 여러 방식 중 **가변 다이나믹 서브셋**을 써요. 글꼴 이름이 `"Pretendard Variable"`로 등록되고, 화면에 쓰인 글자의 조각만 받아요. `get_guide`의 `font` 가이드에 다른 안내가 있으면 그 안내를 따라요.

아래는 `1.3.9` 기준이에요. 설치하기 전에 공식 저장소에서 최신 버전을 확인하고, 버전을 고정해서 써요.

### 번들러를 쓰는 프로젝트 (Next.js, Vite 등)

1. 프로젝트의 패키지 매니저로 `pretendard`를 설치해요.

```bash
npm i pretendard
```

2. 전역 진입점에서 가변 다이나믹 서브셋 CSS를 한 번 import해요.

```ts
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
```

| 프레임워크 | 전역 진입점 |
| --- | --- |
| Next.js App Router | 루트 `app/layout.tsx` |
| Vite | `src/main.tsx` 같은 진입 파일 |
| 그 밖 | 전역 스타일을 불러오는 파일. 프로젝트의 구조를 따라요 |

### 프레임워크가 정해지지 않은 HTML

`<head>`에 공식 CDN 링크를 넣어요.

```html
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

### Next.js에서 `next/font/local`을 쓰지 않아요

공식 저장소는 Next.js에서 `next/font/local`로 불러오는 방법도 안내해요. ELI와 함께 쓸 때는 이 방법을 쓰지 않아요. `next/font`는 글꼴을 자동으로 만든 다른 이름으로 등록해요. ELI는 `"Pretendard Variable"`이라는 이름으로 글꼴을 찾기 때문에, 이름이 달라지면 ELI 컴포넌트가 대체 글꼴로 보여요.

### 지켜요

- 전역 스타일의 `body`에 한 번만 글꼴을 지정해요. ELI 컴포넌트는 스스로 Pretendard를 쓰지만, 프로젝트가 직접 쓴 글자는 `body`에 지정해야 Pretendard로 보여요.

```css
body {
  font-family: var(--eli-font-family-sans);
}
```

- 글꼴 목록을 직접 적지 않아요. `--eli-font-family-sans`가 공식 안내의 글꼴 목록(`"Pretendard Variable", Pretendard, ...`)을 이미 갖고 있어요.
- 전역 진입점에서 한 번만 불러와요. 이미 불러오고 있으면 다시 추가하지 않아요.
- 가변이 아닌 Pretendard나 다이나믹 서브셋이 아닌 CSS가 이미 연결되어 있으면 사용자에게 알리고, 가변 다이나믹 서브셋으로 바꿀지 물어요.
- 화면이 실제로 Pretendard로 보이는지 확인해요. 브라우저 도구가 있으면 계산된 글꼴을 봐요. 불러오기에 실패하면 조용히 대체 글꼴로 보여요.
- Pretendard는 SIL OFL 1.1이에요. 상업적 사용과 웹 글꼴로 올리기가 허용돼요.

## 코드에서 지켜요

- 전역 스타일의 `body` 밖에서는 `font-family`를 직접 쓰지 않아요. `body`의 글꼴이 그대로 내려오게 둬요.
- 입력창과 버튼처럼 브라우저가 글꼴을 따로 주는 요소에는 `font: inherit`를 줘요. ELI 컴포넌트에는 이미 적용되어 있어요.
- 글자 크기, 굵기, 줄 높이, 자간은 ELI의 타이포그래피 토큰을 한 묶음으로 써요. `get_tokens`의 `typography`에서 확인해요.
- 자간(`letter-spacing`)만 따로 바꾸지 않아요. 글자 크기를 바꾸면 그 크기에 맞는 토큰 묶음으로 바꿔요.
- 프로젝트에 이미 다른 글꼴이 연결되어 있으면 사용자에게 알리고, Pretendard로 바꿀지 확인받은 뒤 지워요.

## DESIGN.md에 적어요

`DESIGN.md`의 `## 글꼴`에 Pretendard를 쓴다는 것, 불러오는 방법, 불러오는 파일의 위치를 적어요.
