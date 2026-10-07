# @eli/ui

ELI의 React 디자인 컴포넌트 패키지예요. 아직 npm에 게시하지 않았어요. 색상·타이포그래피·레이아웃 토큰과 Button·SnackBar를 구현했어요.

이 패키지는 Pretendard 폰트 파일이나 폰트 패키지를 포함하지 않아요. 초기 설정 도구가 구현되기 전까지 소비 프로젝트에서 Pretendard를 직접 불러와야 해요.

React는 사용자 앱과 공유하는 peer dependency예요. 개발용 Storybook과 검증 예제는 배포하지 않아요. 라이선스와 npm scope 소유권을 확정하기 전에는 공개 게시하지 않아요.

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from '@eli/ui/button';

export function Example() {
  return <Button>버튼</Button>;
}
```

SnackBar는 아래 경로에서 가져와요. 메시지, 버튼명과 버튼 색상을 바꿀 수 있어요.

```tsx
import { SnackBar } from '@eli/ui/snackbar';

export function Example() {
  return (
    <SnackBar action="닫기" actionColor="#3584fb">
      저장했어요.
    </SnackBar>
  );
}
```
