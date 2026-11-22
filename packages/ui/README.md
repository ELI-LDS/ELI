# ELI 컴포넌트 사용 예시

`@eli-design/ui` 전체 npm 패키지는 종료 예정이에요. 새 프로젝트는 [`eli-design`](https://www.npmjs.com/package/eli-design)으로 필요한 컴포넌트 소스만 추가해요. 이 폴더는 선택 설치 콘텐츠를 생성하는 UI 원본이며, 원본 폴더를 없앤다는 뜻은 아니에요.

## 필요한 소스 추가하기

```bash
npx eli-design@latest init
npx eli-design@latest add button
```

여러 개는 `add button modal`, 전체는 명시적으로 `add --all`을 사용해요. 예시의 컴포넌트 ID는 `list`에서 확인하고 필요한 컴포넌트를 먼저 추가해요. [CLI 사용법](https://github.com/ELI-LDS/ELI/blob/main/packages/cli/README.md)에 지원 환경·경로 설정·하네스 선택 설치를 안내해요.

아래 import는 기본 경로로 설치한 뒤 `src/App.tsx`에서 사용하는 예시예요. 실제 설치 경로나 사용하는 파일 위치가 다르면 설치 결과의 로컬 진입 경로에 맞춰요. 전체 UI 패키지를 추가로 설치하거나 기존 그룹 경로에서 가져오지 않아요.

기본 CSS·공통 토큰은 컴포넌트와 함께 연결돼요. Pretendard 폰트는 소비 앱에서 직접 불러와요. 이벤트를 연결하는 Next.js 화면에는 Client Component 경계가 필요해요. UI만 추가하면 하네스를 받지 않으며, 하네스는 별도 `harness --agent` 명령으로 선택해요.

## 컴포넌트 스타일을 바꿔요

ELI 컴포넌트는 토큰을 몰라도 `className`으로 기본 스타일을 덮어쓸 수 있어요. 일반 CSS, CSS Modules, Tailwind CSS, Emotion과 vanilla-extract처럼 최종적으로 클래스 이름을 만드는 방식이라면 같은 API를 사용해요. 별도 ELI 플러그인이나 스타일 도구 의존성은 필요하지 않아요.

`className`이 적용되는 요소는 컴포넌트마다 달라요. Button은 루트 `button`에, TextField와 TextArea는 바깥 `label`에 적용돼요. 에디터에서 컴포넌트나 해당 prop에 커서를 올리면 빠른 사용법, 허용 값, 기본값과 정확한 적용 대상을 확인할 수 있어요.

Tailwind CSS에서는 평소 사용하는 utility class를 그대로 입력해요. 배경처럼 상태가 있는 스타일을 바꿀 때는 Hover·Pressed·Disabled도 함께 지정해요.

```tsx
import { Button } from './components/eli/button/Button/Button';

export function PurpleButton() {
  return (
    <Button className="w-full rounded-xl bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 disabled:bg-violet-300">
      저장하기
    </Button>
  );
}
```

Emotion과 vanilla-extract도 생성한 클래스 이름을 같은 방식으로 전달해요.

```tsx
// Emotion
import { css } from '@emotion/css';

const customButton = css`
  width: 100%;
  background: #7c3aed;

  &:hover {
    background: #6d28d9;
  }
`;

<Button className={customButton}>저장하기</Button>;
```

```ts
// vanilla-extract
import { style } from '@vanilla-extract/css';

export const customButton = style({
  width: '100%',
  background: '#7c3aed',
  selectors: {
    '&:hover': { background: '#6d28d9' },
  },
});
```

`style`과 Button의 `backgroundColor`, `width`, `height`도 계속 사용할 수 있어요. `className`은 반응형이나 상태별 스타일처럼 클래스 기반 커스터마이즈가 필요할 때 사용해요. 복합 컴포넌트의 내부 요소는 현재 공개된 prop으로 바꿀 수 있는 범위만 지원해요.

Badge는 짧은 상태나 분류를 표시해요. `type`으로 의미 색상을, `size`로 크기를 정해요.

```tsx
import { Badge } from './components/eli/badge/Badge/Badge';

export function Label() {
  return <Badge size="medium" type="success">완료</Badge>;
}
```

Tooltip은 요소를 이해하는 데 필요한 짧은 설명을 표시해요. 최대 너비는 200px이며, 위치 계산과 열고 닫는 동작은 Tooltip을 사용하는 화면에서 연결해요.

```tsx
import { Tooltip } from './components/eli/tooltip/Tooltip/Tooltip';

export function SaveDescription() {
  return <Tooltip>버튼을 누르면 파일을 저장해요.</Tooltip>;
}
```

LoadingIndicator와 ProgressIndicator는 작업의 완료 비율을 알면 `progress`를 표시하고, 알 수 없으면 값을 생략해 반복 애니메이션으로 진행 중임을 알려요.
LoadingIndicator의 `continuous`는 일정하게 회전하고, `cycle`은 Figma의 2초 가감속 모션을 반복해요.

```tsx
import { LoadingIndicator } from './components/eli/loading/LoadingIndicator/LoadingIndicator';
import { ProgressIndicator } from './components/eli/loading/ProgressIndicator/ProgressIndicator';

<LoadingIndicator aria-label="프로필 불러오는 중" />
<LoadingIndicator aria-label="동기화하는 중" variant="cycle" />
<ProgressIndicator aria-label="파일 업로드" progress={80} />
```

Alert는 `status`에 맞는 색상과 아이콘으로 제목과 본문을 표시해요. 화면에 띄우는 Toast 동작은 포함하지 않아요.

```tsx
import { Alert } from './components/eli/alert/Alert/Alert';

export function DeleteResult() {
  return <Alert message="삭제된 파일은 30일 동안 휴지통에 보관돼요." status="success" title="파일을 삭제했어요." />;
}
```

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from './components/eli/button/Button/Button';

export function Example() {
  return <Button>버튼</Button>;
}
```

IconButton은 텍스트 없이 아이콘만 표시하므로 `aria-label`을 반드시 전달해요. `icon`을 생략하면 Plus 아이콘을 표시해요.

```tsx
import { IconButton } from './components/eli/button/IconButton/IconButton';

export function AddButton() {
  return <IconButton aria-label="추가" variant="outline" />;
}
```

Fab은 하나의 주요 액션을 실행하고, FabMenu는 관련된 여러 액션을 펼쳐요. FabMenu의 개별 액션을 누르면 해당 동작을 실행한 뒤 메뉴가 닫혀요.

```tsx
import { Fab } from './components/eli/fab/Fab/Fab';
import { FabMenu } from './components/eli/fab/FabMenu/FabMenu';

export function FloatingActions() {
  return (
    <>
      <Fab aria-label="게시물 작성" onClick={() => {}} showLabel={false} />
      <FabMenu
        items={[
          { id: 'photo', label: '사진 추가', onClick: () => {} },
          { id: 'post', label: '게시물 작성', onClick: () => {} },
        ]}
        label="추가"
        showLabel={false}
      />
    </>
  );
}
```

Chip은 선택, 삭제, 필터 진입 목적에 맞는 독립 컴포넌트를 사용해요. 상태와 목록 데이터는 부모에서 관리해요.

```tsx
import { Chip } from './components/eli/chip/Chip/Chip';
import { FilterChip } from './components/eli/chip/FilterChip/FilterChip';
import { RemovableChip } from './components/eli/chip/RemovableChip/RemovableChip';

const colorOptions = [
  { label: '블랙', value: 'black' },
  { label: '화이트', value: 'white' },
];

export function Chips() {
  return (
    <>
      <Chip selected onSelectedChange={() => {}}>장르</Chip>
      <RemovableChip onRemove={() => {}}>프론트엔드</RemovableChip>
      <FilterChip
        label="컬러"
        options={colorOptions}
        selectedValues={['black', 'white']}
        onClick={() => {}}
      />
    </>
  );
}
```

Checkbox는 네이티브 체크박스예요. 라벨 텍스트가 없으면 `aria-label`로 용도를 설명하거나 별도의 `label`을 연결해요.

```tsx
import { Checkbox } from './components/eli/checkbox/Checkbox/Checkbox';

export function Agreement() {
  return <Checkbox aria-label="약관 동의" defaultChecked />;
}
```

Radio는 여러 선택지 중 하나만 고를 때 사용해요. 같은 선택 묶음은 동일한 `name`을 전달해요.

```tsx
import { Radio } from './components/eli/radio/Radio/Radio';

export function CourseType() {
  return (
    <fieldset>
      <legend>과정 선택</legend>
      <label><Radio name="course" value="frontend" /> 프론트엔드</label>
      <label><Radio name="course" value="backend" /> 백엔드</label>
    </fieldset>
  );
}
```

Divider는 부모 영역의 너비에 맞춰 표시돼요.

```tsx
import { Divider } from './components/eli/divider/Divider/Divider';

export function SectionDivider() {
  return <Divider />;
}
```

MenuItem은 텍스트와 선택적인 좌우 아이콘·단축키 안내를 받아요. `shortcut`은 안내를
표시하며 실제 키보드 동작은 별도로 연결해야 해요.

```tsx
import { MenuItem } from './components/eli/menu/MenuItem/MenuItem';

export function Menu() {
  return <MenuItem shortcut="⇧⌘P">명령 팔레트 열기</MenuItem>;
}
```

NavigationBar는 3개부터 5개의 주요 화면 이동 항목을 표시해요. 기본 상태에는 outlined 아이콘을 사용하고, 활성 탭에만 filled 아이콘을 사용해요.

```tsx
import { NavigationBar } from './components/eli/navigation/NavigationBar/NavigationBar';
import {
  HomeFilledIcon,
  HomeOutlinedIcon,
  ProfileFilledIcon,
  ProfileOutlinedIcon,
  SearchFilledIcon,
  SearchOutlinedIcon,
} from './icons';

const items = [
  {
    value: 'home',
    label: '홈',
    outlinedIcon: <HomeOutlinedIcon />,
    filledIcon: <HomeFilledIcon />,
  },
  {
    value: 'search',
    label: '검색',
    outlinedIcon: <SearchOutlinedIcon />,
    filledIcon: <SearchFilledIcon />,
  },
  {
    value: 'profile',
    label: '내 정보',
    outlinedIcon: <ProfileOutlinedIcon />,
    filledIcon: <ProfileFilledIcon />,
  },
] as const;

export function Example() {
  return <NavigationBar aria-label="주요 메뉴" items={items} />;
}
```

NavigationBarGlass는 아이콘만 표시하는 유리 효과의 모바일 탐색 영역이에요. 3개부터 5개 항목을 균등하게 배치하고, 탭·키보드·포인터 드래그로 활성 항목을 바꿔요. `label`은 화면에는 표시되지 않으며 화면 낭독기가 각 항목을 구분할 때 사용해요.

```tsx
import { NavigationBarGlass } from './components/eli/navigation/NavigationBarGlass/NavigationBarGlass';

export function GlassNavigation() {
  return (
    <NavigationBarGlass
      aria-label="주요 메뉴"
      items={items}
      onValueChange={value => console.log(value)}
    />
  );
}
```

화면 하단 고정 위치와 Safe Area 여백은 사용하는 앱에서 정해요. 외부 스타일에서는 `--eli-navigation-bar-glass-gutter`, `--eli-navigation-bar-glass-max-width`, `--eli-navigation-bar-glass-item-height`로 크기를 조절하고, `--eli-navigation-bar-glass-frost`, `--eli-navigation-bar-glass-depth`, `--eli-navigation-bar-glass-light-angle`, `--eli-navigation-bar-glass-light-intensity`로 유리 효과를 조절할 수 있어요. 특별한 조립이 필요할 때만 저수준 항목인 `NavigationBarGlassItem`을 직접 사용해요.

NavigationDrawer는 카테고리, 주 메뉴와 하위 메뉴를 세로로 구성해요. `NavigationDrawerCategory`는 클릭 동작 없이 메뉴 묶음의 이름을 표시하며, `label`로 카테고리명을 바꿀 수 있어요. `NavigationDrawerMenu`가 하나의 주 메뉴와 연결된 하위 메뉴를 묶고, `NavigationDrawer`가 전체 선택값을 관리해요. 하위 메뉴가 없는 Main Menu는 선택·이동 대상으로 동작하고, 하위 메뉴가 있는 Main Menu는 전체 영역을 눌러 열고 닫아요. NavigationBar와 마찬가지로 Main Menu의 기본 상태에는 outlined 아이콘을 사용하고, 활성 메뉴에만 filled 아이콘을 사용해요.

```tsx
import { NavigationDrawer } from './components/eli/navigation/NavigationDrawer/NavigationDrawer';
import { NavigationDrawerCategory } from './components/eli/navigation/NavigationDrawerCategory/NavigationDrawerCategory';
import { NavigationDrawerMenu } from './components/eli/navigation/NavigationDrawerMenu/NavigationDrawerMenu';
import { Divider } from './components/eli/divider/Divider/Divider';
import { HomeFilledIcon, HomeOutlinedIcon } from './icons';

export function SideMenu() {
  return (
    <NavigationDrawer aria-label="서비스 메뉴" defaultValue="my-course">
      <NavigationDrawerCategory label="학습" />
      <NavigationDrawerMenu
        filledIcon={<HomeFilledIcon />}
        label="학습"
        outlinedIcon={<HomeOutlinedIcon />}
        subItems={[
          { label: '내 강의', value: 'my-course' },
          { label: '최근 본 강의', value: 'recent-course' },
        ]}
        value="learning"
      />
      <Divider />
    </NavigationDrawer>
  );
}
```

직접 선택값을 제어하려면 `value`와 `onValueChange`를 함께 사용해요. 특별한 조립이 필요할 때만 저수준 행 컴포넌트인 `NavigationDrawerItem`을 사용해요.

Modal은 제목과 최대 두 개의 본문 문장을 각각 전달해요. Dim·Secondary·Esc로 닫고 Positive는 연결한 동작만 실행해요. 열리면 Secondary로 포커스를 이동하고 닫으면 이전 요소로 돌아가요. 중첩 Modal은 지원하지 않아요.

```tsx
import { useState } from 'react';
import { Modal } from './components/eli/modal/Modal/Modal';

export function ConfirmModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>모달 열기</button>
    <Modal
      open={open}
      onOpenChange={setOpen}
      onPositiveAction={() => { console.log('확인 동작'); setOpen(false); }}
      title="제목"
      message="첫 번째 내용을 작성합니다"
      subMessage="두 번째 내용을 작성합니다"
      secondaryAction="취소"
      positiveAction="확인"
    />
    </>
  );
}
```

`open`을 생략하면 내부 상태로 열고 닫으며 `defaultOpen`은 `true`예요. Secondary 콜백에서 `event.preventDefault()`를 호출하면 자동 닫기를 취소할 수 있어요. 외부 제어에서는 `onOpenChange`에서 `open` 값을 갱신해요. `aria-label`·`aria-labelledby`·`aria-describedby`는 dialog 콘텐츠에 연결되고, `className`·`style`은 기존처럼 바깥 루트에 적용돼요.

Select는 라벨, Placeholder 문구와 고유한 value를 가진 옵션 목록을 전달해요. 옵션 행은
MenuItem을 사용하지만 좌우 아이콘과 단축키 안내는 표시하지 않아요.

```tsx
import { Select } from './components/eli/select/Select/Select';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

export function CategorySelect() {
  return <Select label="분류" options={options} placeholder="분류를 선택하세요" />;
}
```

SegmentControl은 2개부터 4개의 옵션 중 하나를 선택해요. 값은 부모에서 제어하거나 `defaultValue`로 초기화할 수 있어요.

```tsx
import { SegmentControl } from './components/eli/segment-control/SegmentControl/SegmentControl';

const viewOptions = [
  { label: '목록', value: 'list' },
  { label: '격자', value: 'grid' },
] as const;

export function ViewControl() {
  return <SegmentControl aria-label="보기 방식" options={viewOptions} />;
}
```

Slider는 하나의 값이나 시작·끝 범위를 선택할 때 사용해요. `aria-label`에는 사용자가 무엇을 조절하는지 짧게 적어요.

```tsx
import { Slider } from './components/eli/slider/Slider/Slider';

<Slider aria-label="볼륨" defaultValue={60} />

<Slider
  aria-label="가격 범위"
  defaultValue={[27, 60]}
  variant="range"
/>
```

Tab은 같은 화면 안의 콘텐츠를 전환하는 한 개의 선택 항목이에요. 여러 Tab은 `role="tablist"`인 부모 안에 배치하고, `active`로 현재 선택 항목을 표시해요.

```tsx
import { useState } from 'react';
import { Tab } from './components/eli/tab/Tab/Tab';

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');

  return (
    <div aria-label="프로필 정보" role="tablist">
      <Tab
        active={activeTab === 'posts'}
        label="게시글"
        onActiveChange={active => active && setActiveTab('posts')}
      />
      <Tab
        active={activeTab === 'likes'}
        label="좋아요"
        onActiveChange={active => active && setActiveTab('likes')}
      />
    </div>
  );
}
```

TextField는 아래 경로에서 가져와요. 라벨과 Placeholder 문구를 바꾸고 하나의 상태를 선택할 수 있어요.

```tsx
import { TextField } from './components/eli/text/TextField/TextField';

export function SignUpField() {
  return <TextField label="이메일" placeholder="이메일을 입력하세요" state="default" />;
}
```

TextArea도 같은 그룹 경로에서 가져와요. 라벨과 Placeholder 문구를 바꿀 수 있고 Hover·Focus·입력 완료·Disabled 상태는 네이티브 입력 동작에 따라 적용돼요.

```tsx
import { TextArea } from './components/eli/text/TextArea/TextArea';

export function IntroductionField() {
  return <TextArea label="소개" placeholder="소개를 입력하세요" />;
}
```

SnackBar는 아래 경로에서 가져와요. 메시지, 버튼명과 버튼 색상을 바꿀 수 있어요.

```tsx
import { SnackBar } from './components/eli/snackbar/SnackBar/SnackBar';

export function Example() {
  return (
    <SnackBar action="닫기" actionColor="#3584fb">
      저장했어요.
    </SnackBar>
  );
}
```
