# ELI 컴포넌트 사용 예시

`@eli-design/ui` 전체 npm 패키지는 삭제됐어요. 새 프로젝트는 [`eli-design`](https://www.npmjs.com/package/eli-design)으로 필요한 컴포넌트 소스만 추가해요. 이 폴더는 선택 설치 콘텐츠를 생성하는 UI 원본이며, 원본 폴더를 없앤다는 뜻은 아니에요.

## 필요한 소스 추가하기

```bash
npx eli-design@latest init
npx eli-design@latest add button
```

여러 개는 `add button modal`, 전체는 명시적으로 `add --all`을 사용해요. 예시의 컴포넌트 ID는 `list`에서 확인하고 필요한 컴포넌트를 먼저 추가해요. [CLI 사용법](https://github.com/ELI-team/ELI/blob/main/packages/cli/README.md)에 지원 환경·경로 설정·하네스 선택 설치를 안내해요.

아래 import는 준비 중인 CLI 0.3.1과 공개된 UI 콘텐츠 0.2.0을 기본 경로로 설치한 뒤 `src/App.tsx`에서 사용하는 예시예요. 기존 설치 소스는 자동으로 이동하지 않으며 실제 설치 기록의 경로를 사용해요. 전체 UI 패키지를 추가로 설치하거나 기존 그룹 경로에서 가져오지 않아요.

아래 API 보완 중 진행률의 일반 숫자·옵션별 비활성화·입력 ref 계약은 다음 UI 콘텐츠 릴리스에 포함할 미배포 변경이에요. 기존 0.2.0 소스가 자동으로 바뀌지는 않아요.

기본 CSS·공통 토큰은 컴포넌트와 함께 연결돼요. Pretendard 폰트는 소비 앱에서 직접 불러와요. 이벤트를 연결하는 Next.js 화면에는 Client Component 경계가 필요해요. UI만 추가하면 하네스를 받지 않으며, 하네스는 별도 `harness --agent` 명령으로 선택해요.

## 컴포넌트 스타일을 바꿔요

기본 크기·형태·색상 조합으로 원하는 결과를 만들 수 있으면 해당 props를 먼저 골라요. 제품에 맞는 다른 스타일이 필요하면 ELI 토큰을 몰라도 외부 클래스나 설치한 소스를 수정할 수 있어요. 일반 CSS·CSS Modules·Tailwind CSS·Emotion·vanilla-extract를 그대로 사용하며 별도 ELI 플러그인은 필요하지 않아요.

```tsx
<Button size="medium" className="w-full">버튼</Button>
```

위 예시는 Tailwind CSS가 설정된 앱에서 기본 Medium 크기에 너비만 추가한 경우예요. `className`이 적용되는 요소는 컴포넌트마다 달라요.

| 컴포넌트 | 적용 위치 | 루트 클래스만으로 바뀌지 않는 부분 |
| --- | --- | --- |
| Button | 루트 `button` | 내부 텍스트에 직접 지정한 타이포그래피 크기 |
| TextField | 바깥 `div` | 내부 입력 영역의 테두리·배경·타이포그래피 |
| TextArea | 바깥 `label` | 내부 입력 영역의 배경·테두리·글자 크기·높이 |
| Select | 바깥 `div` | 내부 선택 버튼·목록의 배경·테두리·글자 크기·높이 |
| Modal | 화면 전체를 덮는 루트 | 내부 대화상자의 배경·크기 |

예를 들어 Button의 `text-xl`은 내부 텍스트의 별도 글자 크기를 덮어쓰지 않아요. TextField의 `w-full`은 전체 너비를 바꾸지만 `border-red-500`이 입력 영역의 테두리를 바꾸지는 않아요. 에디터에서 컴포넌트나 해당 prop에 커서를 올려 적용 대상을 확인해요.

Select는 바깥 너비를 바꾸면 선택 버튼과 목록도 그 너비를 따라가요. 바깥 높이만 바꿔 선택 버튼이나 TextArea 내부 입력 영역의 높이를 지정할 수는 없어요. Modal은 `width`·`height`로 내부 대화상자의 크기를 정하며, 루트에 적용하는 `style.width`·`style.height`와는 대상이 달라요.

**같은 속성을 중복 지정하지 않아요.** 일반 CSS 선언 기준으로 Button의 `backgroundColor`·`width`·`height`는 같은 속성의 `style`보다 우선하고, 이 인라인 지정은 일반 외부 클래스보다 우선해요. TextField의 `style`은 바깥 `div`에만 적용돼요. CSS 레이어는 루트에 적용한 스타일을 자식에게 강제로 적용하는 기능은 아니에요.

**상태별 색상은 클래스로 지정해요.** Button에 `backgroundColor`를 직접 주면 Hover·Pressed·Disabled의 일반 CSS 배경색도 그 색상으로 표시돼요. 다음처럼 상태별 색상을 정할 때는 `backgroundColor`나 `style.backgroundColor`를 함께 주지 않아요. 반응형 너비·높이를 클래스로 정할 때도 같은 속성의 전용 props와 인라인 지정은 생략해요.

```tsx
import { Button } from './components/ui/button';

export function PurpleButton() {
  return (
    <Button className="w-full rounded-xl bg-violet-600 text-white hover:enabled:bg-violet-700 active:enabled:bg-violet-800 disabled:bg-violet-300 disabled:text-violet-900">
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

  &:hover:not(:disabled) {
    background: #6d28d9;
  }

  &:active:not(:disabled) {
    background: #5b21b6;
  }

  &:disabled {
    background: #c4b5fd;
    color: #4c1d95;
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
    '&:hover:not(:disabled)': { background: '#6d28d9' },
    '&:active:not(:disabled)': { background: '#5b21b6' },
    '&:disabled': { background: '#c4b5fd', color: '#4c1d95' },
  },
});
```

색상과 크기는 위 예시 앱의 사용자 스타일이며 ELI의 새 공식 조합이 아니에요. 외형을 바꾼 뒤에는 Disabled 구분·키보드 포커스·글자 가독성·좁은 화면 배치를 함께 확인해요.

내부 영역까지 바꾸려면 해당 영역의 공개 prop을 먼저 확인하고, 필요한 경우 설치한 소스를 직접 수정해요. 문서에 없는 자식 순서나 내부 선택자가 이후 버전에서도 유지된다고 가정하지 않아요. 여러 화면에서 같은 변경을 쓴다면 앱의 공통 컴포넌트나 설치한 소스에서 관리해요. 소스 수정은 허용되며 `status`의 수정 감지는 디자인 위반 판정이 아니에요.

Badge는 짧은 상태나 분류를 표시해요. `type`으로 의미 색상을, `size`로 크기를 정해요.

```tsx
import { Badge } from './components/ui/badge';

export function Label() {
  return <Badge size="medium" type="success">완료</Badge>;
}
```

Tooltip은 요소를 이해하는 데 필요한 짧은 설명을 표시해요. 최대 너비는 200px이며, 위치 계산과 열고 닫는 동작은 Tooltip을 사용하는 화면에서 연결해요.

```tsx
import { Tooltip } from './components/ui/tooltip';

export function SaveDescription() {
  return <Tooltip>버튼을 누르면 파일을 저장해요.</Tooltip>;
}
```

LoadingIndicator와 ProgressIndicator는 작업의 완료 비율을 알면 `progress`를 표시하고, 알 수 없으면 값을 생략해 반복 애니메이션으로 진행 중임을 알려요.
`progress`는 0~100 사이의 일반 숫자를 받아요. 범위 밖 값은 0 또는 100으로 제한하고, 값을 생략하거나 NaN·Infinity를 전달하면 진행률을 모르는 상태로 표시해요.
LoadingIndicator의 `continuous`는 일정하게 회전하고, `cycle`은 Figma의 2초 가감속 모션을 반복해요.

```tsx
import { LoadingIndicator } from './components/ui/spinner';
import { ProgressIndicator } from './components/ui/indicator';

<LoadingIndicator aria-label="프로필 불러오는 중" />
<LoadingIndicator aria-label="동기화하는 중" variant="cycle" />
<ProgressIndicator aria-label="파일 업로드" progress={37} />
```

Alert는 `status`에 맞는 색상과 아이콘으로 제목과 본문을 표시해요. 화면에 띄우는 Toast 동작은 포함하지 않아요.

```tsx
import { Alert } from './components/ui/alert';

export function DeleteResult() {
  return <Alert message="삭제된 파일은 30일 동안 휴지통에 보관돼요." status="success" title="파일을 삭제했어요." />;
}
```

Button은 아래 경로에서 가져와요.

```tsx
import { Button } from './components/ui/button';

export function Example() {
  return <Button>버튼</Button>;
}
```

IconButton은 텍스트 없이 아이콘만 표시하므로 `aria-label`을 반드시 전달해요. `icon`을 생략하면 Plus 아이콘을 표시해요.

```tsx
import { IconButton } from './components/ui/icon-button';

export function AddButton() {
  return <IconButton aria-label="추가" variant="outline" />;
}
```

Fab은 하나의 주요 액션을 실행하고, FabMenu는 관련된 여러 액션을 펼쳐요. FabMenu의 개별 액션을 누르면 해당 동작을 실행한 뒤 메뉴가 닫혀요. 항목에 `disabled: true`를 지정하면 그 액션은 실행할 수 없어요.

```tsx
import { Fab } from './components/ui/fab';
import { FabMenu } from './components/ui/fab-menu';

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

Chip은 `variant="selectable" | "filter" | "removable"`로 선택·필터 설정·삭제 역할을 골라요. 생략하면 `selectable`이에요. `add chip` 한 번으로 세 역할을 모두 설치해요. 상태와 목록 데이터는 부모에서 관리해요.

```tsx
import { Chip } from './components/ui/chip';

const colorOptions = [
  { label: '블랙', value: 'black' },
  { label: '화이트', value: 'white' },
];

export function Chips() {
  return (
    <>
      <Chip selected onSelectedChange={() => {}}>장르</Chip>
      <Chip variant="removable" onRemove={() => {}}>프론트엔드</Chip>
      <Chip variant="filter"
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
import { Checkbox } from './components/ui/checkbox';

export function Agreement() {
  return <Checkbox aria-label="약관 동의" defaultChecked />;
}
```

Radio는 여러 선택지 중 하나만 고를 때 사용해요. 같은 선택 묶음은 동일한 `name`을 전달해요.

```tsx
import { Radio } from './components/ui/radio';

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
import { Divider } from './components/ui/divider';

export function SectionDivider() {
  return <Divider />;
}
```

MenuItem은 텍스트와 선택적인 좌우 아이콘·단축키 안내를 받아요. `shortcut`은 안내를
표시하며 실제 키보드 동작은 별도로 연결해야 해요.

```tsx
import { MenuItem } from './components/ui/menu-item';

export function Menu() {
  return <MenuItem shortcut="⇧⌘P">명령 팔레트 열기</MenuItem>;
}
```

NavigationBar는 3개부터 5개의 주요 화면 이동 항목을 표시해요. 기본 상태에는 outlined 아이콘을 사용하고, 활성 탭에만 filled 아이콘을 사용해요.

```tsx
import { NavigationBar } from './components/ui/navigation-bar';
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
import { NavigationBarGlass } from './components/ui/navigation-bar-glass';

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
import { NavigationDrawer } from './components/ui/drawer';
import { NavigationDrawerCategory } from './components/ui/navigation-drawer-category';
import { NavigationDrawerMenu } from './components/ui/navigation-drawer-menu';
import { Divider } from './components/ui/divider';
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
import { Modal } from './components/ui/modal';

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
MenuItem을 사용하지만 좌우 아이콘과 단축키 안내는 표시하지 않아요. 전체를 막으려면 `disabled`, 특정 옵션만 막으려면 옵션의 `disabled: true`를 사용해요. 방향키는 비활성 옵션을 건너뛰어요.

```tsx
import { Select } from './components/ui/select';

const options = [
  { label: '옵션 1', value: 'option-1' },
  { label: '옵션 2', value: 'option-2' },
];

export function CategorySelect() {
  return <Select label="분류" options={options} placeholder="분류를 선택하세요" />;
}
```

SegmentControl은 같은 맥락의 옵션 중 하나를 선택하며 2~4개를 권장해요. 값은 부모에서 제어하거나 `defaultValue`로 초기화할 수 있어요. 전체 `disabled`와 옵션별 `disabled`를 지원하고 방향키는 사용 가능한 옵션만 이동해요.

```tsx
import { SegmentControl } from './components/ui/segment-control';

const viewOptions = [
  { label: '목록', value: 'list' },
  { label: '격자', value: 'grid' },
] as const;

export function ViewControl() {
  return <SegmentControl aria-label="보기 방식" options={viewOptions} />;
}
```

NavigationBar·NavigationBarGlass의 `items`와 SegmentControl의 `options`는 `.map()`·권한 필터로 만든 일반 배열도 받아요. 권장 항목 수는 각각 3~5개와 2~4개이며, 배열을 자동으로 자르지 않아요. 빈 목록은 선택 없이 표시해요. NavigationBar·NavigationBarGlass는 항목별 disabled를 제공하지 않아요. 선택되지 않은 항목도 이동할 수 있어요.

세 컴포넌트에서 선택 항목이 목록에서 사라지면 비제어 방식은 첫 번째 사용 가능한 항목으로 보정해요. 제어 방식은 부모의 값을 유지하고 선택 표시를 숨겨요. 목록 변경만으로 `onValueChange`를 실행하지 않아요. SegmentControl에서 이미 선택된 옵션이 비활성화되면 선택은 유지하고 추가 조작을 막아요.

Slider는 하나의 값이나 시작·끝 범위를 선택할 때 사용해요. `aria-label`에는 사용자가 무엇을 조절하는지 짧게 적어요. 초기값·제어값·변경값을 `min` 기준의 `step` 간격에 맞춰 표시해요. 예를 들어 `min={0} max={10} step={3} defaultValue={5}`는 6으로 표시하며 마지막 유효 값은 9예요. step은 양수여야 하며 유효하지 않으면 기본값 1을 사용해요.

```tsx
import { Slider } from './components/ui/slider';

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
import { Tab } from './components/ui/tab';

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

X 버튼은 입력을 지우고 기존 `onChange`에 빈 값을 전달한 뒤 입력창에 포커스를 돌려줘요. `value`로 제어하면 받은 값을 상태에 반영해요. `state="disabled"`·`readOnly`에서는 지울 수 없어요. 라벨은 `htmlFor`·`id`로 연결하며 `className`·`style`은 바깥 `div`에 적용해요.

```tsx
import { TextField } from './components/ui/text-field';

export function SignUpField() {
  return <TextField label="이메일" placeholder="이메일을 입력하세요" state="default" />;
}
```

TextField·TextArea·Checkbox·Radio의 `ref`는 바깥 래퍼가 아닌 실제 입력 요소를 가리켜요. TextField의 입력 지우기와 외부 객체·콜백 ref를 함께 사용할 수 있어요.

TextArea는 아래 로컬 경로에서 가져와요. 라벨과 Placeholder 문구를 바꿀 수 있고 Hover·Focus·입력 완료·Disabled 상태는 네이티브 입력 동작에 따라 적용돼요.

```tsx
import { TextArea } from './components/ui/textarea';

export function IntroductionField() {
  return <TextArea label="소개" placeholder="소개를 입력하세요" />;
}
```

SnackBar는 짧은 작업 결과를 표시하고 기본 5초 후 닫혀요. `duration`은 밀리초이며 `duration={0}`이면 자동으로 닫히지 않아요. 유효하지 않거나 브라우저 타이머 한도를 넘는 값은 기본값으로 처리해요. 마우스를 올리거나 내부에 포커스가 있거나 창이 비활성화되면 남은 시간을 보존해요.

```tsx
import { useState } from 'react';
import { SnackBar } from './components/ui/snackbar';

export function SaveFeedback() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>결과 보기</button>
      <SnackBar open={open} onOpenChange={setOpen} duration={5000}
        action="닫기" onAction={() => setOpen(false)}>
        저장했어요.
      </SnackBar>
    </>
  );
}
```

`open`을 지정하면 부모가 표시 상태를 관리해요. 비제어 방식은 `defaultOpen`으로 초기화하며 기본값은 `true`예요. 닫힌 뒤 다시 열거나 `duration`을 바꾸면 시간을 새로 계산해요. 액션은 `onAction`만 실행하므로 즉시 닫으려면 예시처럼 상태를 바꿔요. 액션이 필요하지 않다면 `action={null}`을 전달해요. Next.js에서 위처럼 상태를 사용하는 예시는 Client Component 안에 작성해요.

## 다음 콘텐츠 릴리스의 설치 이름 변경

현재 작업 중인 소스의 이름이며 npm·GitHub 콘텐츠 게시 완료를 뜻하지 않아요. 이미 설치한 파일과 기록은 자동으로 이동하지 않아요.

| 이전 설치 이름 | 새 설치 이름 | React 이름 |
| --- | --- | --- |
| text-area | textarea | TextArea |
| snack-bar | snackbar | SnackBar |
| progress-indicator | indicator | ProgressIndicator |
| loading-indicator | spinner | LoadingIndicator |
| navigation-drawer | drawer | NavigationDrawer |

`FilterChip`은 `<Chip variant="filter" ... />`, `RemovableChip`은 `<Chip variant="removable" ... />`로 옮겨요. 필터 옵션 타입은 `ChipOption`을 사용해요. `filter-chip`·`removable-chip` 별도 설치 항목은 제거해요. 기존 파일을 먼저 삭제하거나 설치 기록의 해시를 직접 고치지 말고, 다른 버전의 공통 파일을 섞지 않은 별도 환경에서 새 소스를 검토한 뒤 이전해요.
