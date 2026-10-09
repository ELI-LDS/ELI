# @eli/ui

ELI의 React 디자인 컴포넌트 패키지예요. 아직 npm에 게시하지 않았어요. 색상·타이포그래피·레이아웃 토큰과 Button·SnackBar·Modal·Select·Toggle·TextField·TextArea를 구현했어요.

이 패키지는 Pretendard 폰트 파일이나 폰트 패키지를 포함하지 않아요. 초기 설정 도구가 구현되기 전까지 소비 프로젝트에서 Pretendard를 직접 불러와야 해요.

React는 사용자 앱과 공유하는 peer dependency예요. 개발용 Storybook과 검증 예제는 배포하지 않아요. 라이선스와 npm scope 소유권을 확정하기 전에는 공개 게시하지 않아요.

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from '@eli/ui/button';

export function Example() {
  return <Button>버튼</Button>;
}
```

Modal은 제목과 최대 두 개의 본문 문장을 각각 전달해요.

```tsx
import { Modal } from '@eli/ui/modal';

export function ConfirmModal() {
  return (
    <Modal
      title="제목"
      message="첫 번째 내용을 작성합니다"
      subMessage="두 번째 내용을 작성합니다"
      secondaryAction="취소"
      positiveAction="확인"
    />
  );
}
```

Select는 라벨, Placeholder 문구와 고유한 value를 가진 옵션 목록을 전달해요.

```tsx
import { Select } from '@eli/ui/select';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

export function CategorySelect() {
  return <Select label="분류" options={options} placeholder="분류를 선택하세요" />;
}
```

TextField는 아래 경로에서 가져와요. 라벨과 Placeholder 문구를 바꾸고 하나의 상태를 선택할 수 있어요.

```tsx
import { TextField } from '@eli/ui/text';

export function SignUpField() {
  return <TextField label="이메일" placeholder="이메일을 입력하세요" state="default" />;
}
```

TextArea도 같은 그룹 경로에서 가져와요. 라벨과 Placeholder 문구를 바꿀 수 있고 Hover·Focus·입력 완료·Disabled 상태는 네이티브 입력 동작에 따라 적용돼요.

```tsx
import { TextArea } from '@eli/ui/text';

export function IntroductionField() {
  return <TextArea label="소개" placeholder="소개를 입력하세요" />;
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
