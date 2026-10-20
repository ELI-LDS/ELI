# @eli/ui

ELI의 React 디자인 컴포넌트 패키지예요. 아직 npm에 게시하지 않았어요. 색상·타이포그래피·레이아웃 토큰과 Alert·Badge·Button·IconButton·Chip·Checkbox·Divider·MenuItem·SnackBar·Modal·Select·Toggle·TextField·TextArea를 구현했어요.

이 패키지는 Pretendard 폰트 파일이나 폰트 패키지를 포함하지 않아요. 초기 설정 도구가 구현되기 전까지 소비 프로젝트에서 Pretendard를 직접 불러와야 해요.

모든 공개 컴포넌트는 서버에서 초기 HTML을 만들 수 있도록 검증해요. 클릭·입력·선택 이벤트를 제공하는 컴포넌트는 배포 파일에 `'use client'` 경계를 유지하고, 표시 전용 Alert·Badge·Divider는 서버 컴포넌트에서도 사용할 수 있어요. 브라우저 API는 사용자 상호작용이 일어날 때만 사용해요. 프레임워크별 RSC·라우팅·hydration 지원 범위는 해당 소비 예제를 추가하면서 별도로 검증해요.

React는 사용자 앱과 공유하는 peer dependency예요. 개발용 Storybook과 검증 예제는 배포하지 않아요. 라이선스와 npm scope 소유권을 확정하기 전에는 공개 게시하지 않아요.

Badge는 텍스트를 표시하고 `size`로 크기를 정해요.

```tsx
import { Badge } from '@eli/ui/badge';

export function Label() {
  return <Badge size="medium">ELI 라이브러리</Badge>;
}
```

Alert는 `status`에 맞는 색상과 아이콘으로 제목과 본문을 표시해요. 화면에 띄우는 Toast 동작은 포함하지 않아요.

```tsx
import { Alert } from '@eli/ui/alert';

export function DeleteResult() {
  return <Alert message="삭제된 파일은 30일 동안 휴지통에 보관돼요." status="success" title="파일을 삭제했어요." />;
}
```

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from '@eli/ui/button';

export function Example() {
  return <Button>버튼</Button>;
}
```

IconButton은 텍스트 없이 아이콘만 표시하므로 `aria-label`을 반드시 전달해요. `icon`을 생략하면 Plus 아이콘을 표시해요.

```tsx
import { IconButton } from '@eli/ui/button';

export function AddButton() {
  return <IconButton aria-label="추가" variant="outline" />;
}
```

Chip은 `selected`로 선택 상태를 표시하고, 닫기 버튼을 누르면 `onRemove`를 호출해요.

```tsx
import { Chip } from '@eli/ui/chip';

export function Tag() {
  return <Chip onRemove={() => {}} selected>ELI 라이브러리</Chip>;
}
```

Checkbox는 네이티브 체크박스예요. 라벨 텍스트가 없으므로 `aria-label`이나 연결된 `label`로 이름을 전달해요.

```tsx
import { Checkbox } from '@eli/ui/checkbox';

export function Agreement() {
  return <Checkbox aria-label="약관 동의" defaultChecked />;
}
```

Divider는 부모 영역의 너비에 맞춰 표시돼요.

```tsx
import { Divider } from '@eli/ui/divider';

export function SectionDivider() {
  return <Divider />;
}
```

MenuItem은 텍스트와 선택적인 좌우 아이콘·단축키를 받아요.

```tsx
import { MenuItem } from '@eli/ui/menu';

export function Menu() {
  return <MenuItem shortcut="⇧⌘P">선택</MenuItem>;
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
