# @eli-design/ui

ELI의 React 디자인 컴포넌트 패키지예요. 아직 npm에 게시하지 않았어요. 현재 공개 경로는 `package.json`의 `exports`, 구현된 컴포넌트와 사용 예시는 아래 문서에서 확인할 수 있어요.

이 패키지는 Pretendard 폰트 파일이나 폰트 패키지를 포함하지 않아요. 소비 프로젝트에서 [Pretendard 공식 안내](https://github.com/orioncactus/pretendard)의 가변 다이나믹 서브셋을 전역 진입점에서 한 번 불러와요. `npm i pretendard`로 설치하고 `import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'`를 추가해요. `next/font/local`은 글꼴을 다른 이름으로 등록해서 ELI 컴포넌트에 적용되지 않아요.

모든 공개 컴포넌트는 서버에서 초기 HTML을 만들 수 있도록 검증해요. 클릭·입력·선택 이벤트를 제공하는 컴포넌트는 배포 파일에 `'use client'` 경계를 유지하고, 표시 전용 Alert·Badge·Divider·LoadingIndicator·ProgressIndicator·Tooltip은 서버 컴포넌트에서도 사용할 수 있어요. 브라우저 API는 사용자 상호작용이 일어날 때만 사용해요. Next.js App Router는 실제 tarball 소비 앱의 프로덕션 빌드·서버 렌더링·hydration·상호작용을 별도로 검증해요.

React는 사용자 앱과 공유하는 peer dependency예요. 개발용 Storybook과 검증 예제는 배포하지 않아요. 라이선스는 MIT예요.

같은 tarball을 npm 11.19.0, pnpm 12.8.1, Yarn Classic 1.22.22, Yarn Modern 4.18.1의 `node-modules`·strict PnP, Bun 1.4.4에서 설치해 타입 검사와 Vite 빌드를 자동 검증해요. 저장소 개발과 lockfile 관리는 pnpm만 사용해요.

## 엘리의 스킬과 훅이 함께 들어 있어요

이 패키지의 `harness/` 폴더에는 AI 에이전트(Claude Code, Codex)가 ELI의 디자인 기준을 지키며 일하게 하는 스킬과 훅이 들어 있어요. 컴포넌트와 항상 같은 버전이에요.

쓰고 있는 에이전트에게 이렇게 말하면 설치해요.

```text
node_modules/@eli-design/ui/harness/INSTALL.md를 읽고 엘리를 설치해줘
```

`harness/`의 파일은 컴포넌트 코드가 불러오지 않아요. 앱의 번들에 들어가지 않아요.

## 컴포넌트 스타일을 바꿔요

ELI 컴포넌트는 토큰을 몰라도 `className`으로 기본 스타일을 덮어쓸 수 있어요. 일반 CSS, CSS Modules, Tailwind CSS, Emotion과 vanilla-extract처럼 최종적으로 클래스 이름을 만드는 방식이라면 같은 API를 사용해요. 별도 ELI 플러그인이나 스타일 도구 의존성은 필요하지 않아요.

`className`이 적용되는 요소는 컴포넌트마다 달라요. Button은 루트 `button`에, TextField와 TextArea는 바깥 `label`에 적용돼요. 에디터에서 컴포넌트나 해당 prop에 커서를 올리면 빠른 사용법, 허용 값, 기본값과 정확한 적용 대상을 확인할 수 있어요.

Tailwind CSS에서는 평소 사용하는 utility class를 그대로 입력해요. 배경처럼 상태가 있는 스타일을 바꿀 때는 Hover·Pressed·Disabled도 함께 지정해요.

```tsx
import { Button } from '@eli-design/ui/button';

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
import { Badge } from '@eli-design/ui/badge';

export function Label() {
  return <Badge size="medium" type="success">완료</Badge>;
}
```

Tooltip은 요소를 이해하는 데 필요한 짧은 설명을 표시해요. 최대 너비는 200px이며, 위치 계산과 열고 닫는 동작은 Tooltip을 사용하는 화면에서 연결해요.

```tsx
import { Tooltip } from '@eli-design/ui/tooltip';

export function SaveDescription() {
  return <Tooltip>버튼을 누르면 파일을 저장해요.</Tooltip>;
}
```

LoadingIndicator와 ProgressIndicator는 작업의 완료 비율을 알면 `progress`를 표시하고, 알 수 없으면 값을 생략해 반복 애니메이션으로 진행 중임을 알려요.
LoadingIndicator의 `continuous`는 일정하게 회전하고, `cycle`은 Figma의 2초 가감속 모션을 반복해요.

```tsx
import { LoadingIndicator, ProgressIndicator } from '@eli-design/ui/loading';

<LoadingIndicator aria-label="프로필 불러오는 중" />
<LoadingIndicator aria-label="동기화하는 중" variant="cycle" />
<ProgressIndicator aria-label="파일 업로드" progress={80} />
```

Alert는 `status`에 맞는 색상과 아이콘으로 제목과 본문을 표시해요. 화면에 띄우는 Toast 동작은 포함하지 않아요.

```tsx
import { Alert } from '@eli-design/ui/alert';

export function DeleteResult() {
  return <Alert message="삭제된 파일은 30일 동안 휴지통에 보관돼요." status="success" title="파일을 삭제했어요." />;
}
```

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from '@eli-design/ui/button';

export function Example() {
  return <Button>버튼</Button>;
}
```

IconButton은 텍스트 없이 아이콘만 표시하므로 `aria-label`을 반드시 전달해요. `icon`을 생략하면 Plus 아이콘을 표시해요.

```tsx
import { IconButton } from '@eli-design/ui/button';

export function AddButton() {
  return <IconButton aria-label="추가" variant="outline" />;
}
```

Fab은 하나의 주요 액션을 실행하고, FabMenu는 관련된 여러 액션을 펼쳐요. FabMenu의 개별 액션을 누르면 해당 동작을 실행한 뒤 메뉴가 닫혀요.

```tsx
import { Fab, FabMenu } from '@eli-design/ui/fab';

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
import { Chip, FilterChip, RemovableChip } from '@eli-design/ui/chip';

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
import { Checkbox } from '@eli-design/ui/checkbox';

export function Agreement() {
  return <Checkbox aria-label="약관 동의" defaultChecked />;
}
```

Radio는 여러 선택지 중 하나만 고를 때 사용해요. 같은 선택 묶음은 동일한 `name`을 전달해요.

```tsx
import { Radio } from '@eli-design/ui/radio';

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
import { Divider } from '@eli-design/ui/divider';

export function SectionDivider() {
  return <Divider />;
}
```

MenuItem은 텍스트와 선택적인 좌우 아이콘·단축키 안내를 받아요. `shortcut`은 안내를
표시하며 실제 키보드 동작은 별도로 연결해야 해요.

```tsx
import { MenuItem } from '@eli-design/ui/menu';

export function Menu() {
  return <MenuItem shortcut="⇧⌘P">명령 팔레트 열기</MenuItem>;
}
```

NavigationBar는 3개부터 5개의 주요 화면 이동 항목을 표시해요. 기본 상태에는 outlined 아이콘을 사용하고, 활성 탭에만 filled 아이콘을 사용해요.

```tsx
import { NavigationBar } from '@eli-design/ui/navigation';
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
import { NavigationBarGlass } from '@eli-design/ui/navigation';

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
import {
  NavigationDrawer,
  NavigationDrawerCategory,
  NavigationDrawerMenu,
} from '@eli-design/ui/navigation';
import { Divider } from '@eli-design/ui/divider';
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

Modal은 제목과 최대 두 개의 본문 문장을 각각 전달해요.

```tsx
import { Modal } from '@eli-design/ui/modal';

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

Select는 라벨, Placeholder 문구와 고유한 value를 가진 옵션 목록을 전달해요. 옵션 행은
MenuItem을 사용하지만 좌우 아이콘과 단축키 안내는 표시하지 않아요.

```tsx
import { Select } from '@eli-design/ui/select';

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
import { SegmentControl } from '@eli-design/ui/segment-control';

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
import { Slider } from '@eli-design/ui/slider';

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
import { Tab } from '@eli-design/ui/tab';

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
import { TextField } from '@eli-design/ui/text';

export function SignUpField() {
  return <TextField label="이메일" placeholder="이메일을 입력하세요" state="default" />;
}
```

TextArea도 같은 그룹 경로에서 가져와요. 라벨과 Placeholder 문구를 바꿀 수 있고 Hover·Focus·입력 완료·Disabled 상태는 네이티브 입력 동작에 따라 적용돼요.

```tsx
import { TextArea } from '@eli-design/ui/text';

export function IntroductionField() {
  return <TextArea label="소개" placeholder="소개를 입력하세요" />;
}
```

SnackBar는 아래 경로에서 가져와요. 메시지, 버튼명과 버튼 색상을 바꿀 수 있어요.

```tsx
import { SnackBar } from '@eli-design/ui/snackbar';

export function Example() {
  return (
    <SnackBar action="닫기" actionColor="#3584fb">
      저장했어요.
    </SnackBar>
  );
}
```
