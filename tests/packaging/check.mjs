import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';
import { packInfo, validatePackage } from '../../scripts/check-package.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const work = join(root, '.artifacts/packaging');
await rm(work, { recursive: true, force: true });
await mkdir(work, { recursive: true });

// 실제 배포 대상의 tarball과 파일 목록을 먼저 확인해요.
const info = packInfo(join(root, 'packages/ui'), work);
await validatePackage(join(root, 'packages/ui'), info);
assert.equal((await stat(join(work, info.filename))).size, info.size);

// 실제 tarball을 비공개 소비 앱에 설치해 공개 API와 CSS 연결을 확인해요.
const consumer = join(work, 'consumer');
await mkdir(consumer);
await writeFile(join(consumer, 'package.json'), JSON.stringify({ name: 'eli-private-consumer', private: true, type: 'module' }));
execFileSync('npm', ['install', '--offline', '--ignore-scripts', '--legacy-peer-deps', '--no-audit', '--no-fund', '--package-lock=false', join(work, info.filename)], { cwd: consumer, stdio: 'inherit' });
await writeFile(join(consumer, 'index.html'), '<html><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
await writeFile(join(consumer, 'custom.css'), `.consumer-button {
  width: 100%;
  color: #fff;
  background: #7c3aed;
}

.consumer-button:hover:not(:disabled) {
  background: #6d28d9;
}

.consumer-button:active:not(:disabled) {
  background: #5b21b6;
}

.consumer-button:disabled {
  color: #fff;
  background: #c4b5fd;
}
`);
await writeFile(join(consumer, 'main.tsx'), `import { createRoot } from 'react-dom/client';
import { Alert } from '@eli/ui/alert';
import { Badge } from '@eli/ui/badge';
import { Button, IconButton } from '@eli/ui/button';
import { Checkbox } from '@eli/ui/checkbox';
import { Chip, FilterChip, RemovableChip } from '@eli/ui/chip';
import { Divider } from '@eli/ui/divider';
import { Fab, FabMenu, FabMenuSegment } from '@eli/ui/fab';
import { LoadingIndicator, ProgressIndicator } from '@eli/ui/loading';
import { MenuItem } from '@eli/ui/menu';
import { Modal } from '@eli/ui/modal';
import { NavigationBar, NavigationBarItem, NavigationDrawer, NavigationDrawerCategory, NavigationDrawerMenu } from '@eli/ui/navigation';
import { Select } from '@eli/ui/select';
import { SegmentControl } from '@eli/ui/segment-control';
import { SnackBar } from '@eli/ui/snackbar';
import { Slider } from '@eli/ui/slider';
import { Tab } from '@eli/ui/tab';
import { TextArea, TextField } from '@eli/ui/text';
import { Toggle } from '@eli/ui/toggle';
import { Tooltip } from '@eli/ui/tooltip';
import './custom.css';
const chipOptions = [{ label: '블랙', value: 'black' }, { label: '화이트', value: 'white' }];
const navigationItems = [{ value: 'home', label: '탐색 홈', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }, { value: 'search', label: '탐색 검색', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }, { value: 'profile', label: '탐색 내 정보', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }] as const;
createRoot(document.getElementById('root')!).render(<><Button color="brand" size="large">버튼</Button><Button className="consumer-button" color="neutral" icon={null}>커스텀 버튼</Button><IconButton aria-label="항목 추가" color="neutral" size="medium" variant="outline" /><Chip selected>선택 칩</Chip><RemovableChip onRemove={() => undefined} removeLabel="태그 삭제">삭제 칩</RemovableChip><FilterChip label="컬러" options={chipOptions} selectedValues={['black', 'white']} /><Badge size="medium" type="success">배지 라벨</Badge><Checkbox aria-label="약관 동의" defaultChecked /><Alert message="알림 본문" status="success" title="알림 제목" /><Divider /><LoadingIndicator aria-label="소비자 원형 진행" progress={50} /><ProgressIndicator aria-label="소비자 막대 진행" /><Fab label="소비자 FAB" /><FabMenu defaultExpanded items={[{ id: 'first', label: '소비자 FAB 메뉴' }]} label="소비자 메뉴" /><FabMenuSegment label="소비자 Segment" /><MenuItem shortcut="⇧⌘P">메뉴</MenuItem><NavigationBar aria-label="주요 탐색" items={navigationItems} /><NavigationBarItem active filledIcon={<span>●</span>} label="탐색 항목" outlinedIcon={<span>○</span>} /><NavigationDrawer aria-label="서비스 탐색" defaultValue="drawer-sub"><NavigationDrawerCategory label="Drawer 카테고리" /><NavigationDrawerMenu defaultExpanded filledIcon={<span>●</span>} label="Drawer 홈" outlinedIcon={<span>○</span>} subItems={[{ label: 'Drawer 하위 메뉴', value: 'drawer-sub' }]} value="drawer-home" /></NavigationDrawer><Modal height={320} message="첫 번째 안내" positiveAction="확인" secondaryAction="취소" subMessage="두 번째 안내" width={480} /><Select label="분류" options={[{ label: '옵션 1', value: 'option-1' }, { label: '옵션 2', value: 'option-2' }]} placeholder="분류를 선택하세요" /><SegmentControl aria-label="보기 방식" options={[{ label: '목록', value: 'list' }, { label: '격자', value: 'grid' }]} /><Slider aria-label="소비자 값" defaultValue={60} /><Slider aria-label="소비자 범위" defaultValue={[27, 60]} variant="range" /><SnackBar actionColor="#153464" /><div aria-label="콘텐츠 탭" role="tablist"><Tab defaultActive={false} label="소비자 탭" onActiveChange={() => undefined} /></div><TextField label="이메일" placeholder="이메일을 입력하세요" state="success" /><TextArea label="소개" placeholder="소개를 입력하세요" /><Toggle aria-label="알림 설정" defaultChecked /><Tooltip>소비자 도움말</Tooltip></>);
`);
await writeFile(join(consumer, 'tsconfig.json'), JSON.stringify({ extends: join(root, 'tsconfig.base.json'), compilerOptions: { noEmit: true }, include: ['main.tsx'] }));
execFileSync(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(consumer, 'tsconfig.json')], { stdio: 'inherit' });
await build({ root: consumer, configFile: false, logLevel: 'warn', build: { minify: true } });

// 실제 배포 패키지를 서버용으로 번들하고 브라우저 전역 없이 렌더링해요.
await writeFile(join(consumer, 'server.tsx'), `import { renderToString } from 'react-dom/server';
import { Alert } from '@eli/ui/alert';
import { Badge } from '@eli/ui/badge';
import { Button, IconButton } from '@eli/ui/button';
import { Checkbox } from '@eli/ui/checkbox';
import { Chip, FilterChip, RemovableChip } from '@eli/ui/chip';
import { Divider } from '@eli/ui/divider';
import { Fab, FabMenu, FabMenuSegment } from '@eli/ui/fab';
import { LoadingIndicator, ProgressIndicator } from '@eli/ui/loading';
import { MenuItem } from '@eli/ui/menu';
import { Modal } from '@eli/ui/modal';
import { NavigationBar, NavigationBarItem, NavigationDrawer, NavigationDrawerCategory, NavigationDrawerMenu } from '@eli/ui/navigation';
import { Select } from '@eli/ui/select';
import { SegmentControl } from '@eli/ui/segment-control';
import { SnackBar } from '@eli/ui/snackbar';
import { Slider } from '@eli/ui/slider';
import { Tab } from '@eli/ui/tab';
import { TextArea, TextField } from '@eli/ui/text';
import { Toggle } from '@eli/ui/toggle';
import { Tooltip } from '@eli/ui/tooltip';

const serverNavigationItems = [{ value: 'server-home', label: '서버 홈', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }, { value: 'server-search', label: '서버 검색', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }, { value: 'server-profile', label: '서버 내 정보', outlinedIcon: <span>○</span>, filledIcon: <span>●</span> }] as const;
const markup = renderToString(<main><Alert status="info" title="서버 알림" /><Badge>서버 배지</Badge><Button>서버 버튼</Button><IconButton aria-label="서버 아이콘 버튼" /><Checkbox aria-label="서버 체크박스" /><Chip>서버 선택 칩</Chip><RemovableChip onRemove={() => undefined}>서버 삭제 칩</RemovableChip><FilterChip label="서버 필터" options={[{ label: '서버 옵션 1', value: 'server-1' }, { label: '서버 옵션 2', value: 'server-2' }]} selectedValues={['server-1', 'server-2']} /><Divider /><LoadingIndicator aria-label="서버 원형 진행" progress={80} /><ProgressIndicator aria-label="서버 막대 진행" progress={30} /><Fab label="서버 FAB" /><FabMenu defaultExpanded items={[{ id: 'server-action', label: '서버 FAB 메뉴' }]} label="서버 메뉴 FAB" /><FabMenuSegment label="서버 Segment" /><MenuItem>서버 메뉴</MenuItem><NavigationBar aria-label="서버 주요 탐색" items={serverNavigationItems} /><NavigationBarItem filledIcon={<span>●</span>} label="서버 탐색 항목" outlinedIcon={<span>○</span>} /><NavigationDrawer aria-label="서버 서비스 탐색" defaultValue="server-drawer-sub"><NavigationDrawerCategory label="서버 Drawer 카테고리" /><NavigationDrawerMenu defaultExpanded filledIcon={<span>●</span>} label="서버 Drawer 홈" outlinedIcon={<span>○</span>} subItems={[{ label: '서버 Drawer 하위 메뉴', value: 'server-drawer-sub' }]} value="server-drawer-home" /></NavigationDrawer><Modal message="서버 첫 문장" subMessage="서버 둘째 문장" /><Select defaultValue="server" label="서버 선택" options={[{ label: '서버 옵션', value: 'server' }]} /><SegmentControl aria-label="서버 보기 방식" options={[{ label: '서버 목록', value: 'list' }, { label: '서버 격자', value: 'grid' }]} /><Slider aria-label="서버 값" defaultValue={60} /><Slider aria-label="서버 범위" defaultValue={[27, 60]} variant="range" /><SnackBar>서버 메시지</SnackBar><div aria-label="서버 콘텐츠 탭" role="tablist"><Tab label="서버 탭" /></div><TextField label="서버 입력" /><TextArea label="서버 여러 줄 입력" /><Toggle aria-label="서버 토글" /><Tooltip>서버 도움말</Tooltip></main>);
export default markup;
`);
await build({
  root: consumer,
  configFile: false,
  logLevel: 'warn',
  ssr: { noExternal: ['@eli/ui'] },
  build: { emptyOutDir: true, minify: true, outDir: 'dist-ssr', ssr: 'server.tsx' },
});
const serverBundle = await import(pathToFileURL(join(consumer, 'dist-ssr/server.js')).href);
assert.match(serverBundle.default, /서버 알림/);
assert.match(serverBundle.default, /서버 옵션/);
assert.match(serverBundle.default, /서버 Drawer 홈/);
assert.match(serverBundle.default, /서버 Drawer 카테고리/);
assert.match(serverBundle.default, /서버 탭/);
assert.match(serverBundle.default, /서버 범위 시작 값/);
assert.match(serverBundle.default, /aria-label="서버 서비스 탐색"/);
assert.match(serverBundle.default, /외 (?:<!-- -->)?1/);
assert.match(serverBundle.default, /role="radiogroup"/);
assert.match(serverBundle.default, /role="switch"/);

const clientComponents = [
  'dist/button/Button/Button.js',
  'dist/button/IconButton/IconButton.js',
  'dist/checkbox/Checkbox/Checkbox.js',
  'dist/chip/FilterChip/FilterChip.js',
  'dist/chip/RemovableChip/RemovableChip.js',
  'dist/chip/Chip/Chip.js',
  'dist/fab/Fab/Fab.js',
  'dist/fab/FabMenu/FabMenu.js',
  'dist/fab/FabMenuSegment/FabMenuSegment.js',
  'dist/menu/MenuItem/MenuItem.js',
  'dist/modal/Modal/Modal.js',
  'dist/navigation/NavigationBar/NavigationBar.js',
  'dist/navigation/NavigationBarItem/NavigationBarItem.js',
  'dist/navigation/NavigationDrawer/NavigationDrawer.js',
  'dist/navigation/NavigationDrawerItem/NavigationDrawerItem.js',
  'dist/navigation/NavigationDrawerMenu/NavigationDrawerMenu.js',
  'dist/select/Select/Select.js',
  'dist/segment-control/SegmentControl/SegmentControl.js',
  'dist/snackbar/SnackBar/SnackBar.js',
  'dist/slider/Slider/Slider.js',
  'dist/tab/Tab/Tab.js',
  'dist/text/TextArea/TextArea.js',
  'dist/text/TextField/TextField.js',
  'dist/toggle/Toggle/Toggle.js',
];
for (const componentPath of clientComponents) {
  assert.match(
    await readFile(join(consumer, 'node_modules/@eli/ui', componentPath), 'utf8'),
    /^['"]use client['"];?/,
  );
}

const assets = join(consumer, 'dist/assets');
const files = await readdir(assets);
const css = (await Promise.all(files.filter(x => x.endsWith('.css')).map(x => readFile(join(assets, x), 'utf8')))).join('\n');
const js = (await Promise.all(files.filter(x => x.endsWith('.js')).map(x => readFile(join(assets, x), 'utf8')))).join('\n');
const installedPackage = join(consumer, 'node_modules/@eli/ui');
const documentedComponents = [
  'dist/alert/Alert/Alert.d.ts',
  'dist/badge/Badge/Badge.d.ts',
  'dist/button/Button/Button.d.ts',
  'dist/button/IconButton/IconButton.d.ts',
  'dist/checkbox/Checkbox/Checkbox.d.ts',
  'dist/chip/FilterChip/FilterChip.d.ts',
  'dist/chip/RemovableChip/RemovableChip.d.ts',
  'dist/chip/Chip/Chip.d.ts',
  'dist/divider/Divider/Divider.d.ts',
  'dist/fab/Fab/Fab.d.ts',
  'dist/fab/FabMenu/FabMenu.d.ts',
  'dist/fab/FabMenuSegment/FabMenuSegment.d.ts',
  'dist/loading/LoadingIndicator/LoadingIndicator.d.ts',
  'dist/loading/ProgressIndicator/ProgressIndicator.d.ts',
  'dist/menu/MenuItem/MenuItem.d.ts',
  'dist/modal/Modal/Modal.d.ts',
  'dist/navigation/NavigationBar/NavigationBar.d.ts',
  'dist/navigation/NavigationBarItem/NavigationBarItem.d.ts',
  'dist/navigation/NavigationDrawer/NavigationDrawer.d.ts',
  'dist/navigation/NavigationDrawerCategory/NavigationDrawerCategory.d.ts',
  'dist/navigation/NavigationDrawerItem/NavigationDrawerItem.d.ts',
  'dist/navigation/NavigationDrawerMenu/NavigationDrawerMenu.d.ts',
  'dist/select/Select/Select.d.ts',
  'dist/segment-control/SegmentControl/SegmentControl.d.ts',
  'dist/snackbar/SnackBar/SnackBar.d.ts',
  'dist/slider/Slider/Slider.d.ts',
  'dist/tab/Tab/Tab.d.ts',
  'dist/text/TextArea/TextArea.d.ts',
  'dist/text/TextField/TextField.d.ts',
  'dist/toggle/Toggle/Toggle.d.ts',
  'dist/tooltip/Tooltip/Tooltip.d.ts',
];
for (const componentPath of documentedComponents) {
  const declaration = await readFile(join(installedPackage, componentPath), 'utf8');
  assert.match(declaration, /@example 빠른 사용/);
  assert.match(declaration, /### 스타일 변경/);
}

const layeredStyleSheets = [
  'dist/alert/Alert/Alert.css',
  'dist/badge/Badge/Badge.css',
  'dist/button/Button/Button.css',
  'dist/button/IconButton/IconButton.css',
  'dist/checkbox/Checkbox/Checkbox.css',
  'dist/chip/Chip.css',
  'dist/dim/Dim/Dim.css',
  'dist/divider/Divider/Divider.css',
  'dist/fab/Fab/Fab.css',
  'dist/fab/FabMenu/FabMenu.css',
  'dist/fab/FabMenuSegment/FabMenuSegment.css',
  'dist/loading/LoadingIndicator/LoadingIndicator.css',
  'dist/loading/ProgressIndicator/ProgressIndicator.css',
  'dist/menu/MenuItem/MenuItem.css',
  'dist/menu/MenuItem/MenuItem.interaction.css',
  'dist/modal/Modal/Modal.css',
  'dist/navigation/NavigationBar/NavigationBar.css',
  'dist/navigation/NavigationBarItem/NavigationBarItem.css',
  'dist/navigation/NavigationDrawer/NavigationDrawer.css',
  'dist/navigation/NavigationDrawerCategory/NavigationDrawerCategory.css',
  'dist/navigation/NavigationDrawerItem/NavigationDrawerItem.css',
  'dist/select/Select/Select.css',
  'dist/segment-control/SegmentControl/SegmentControl.css',
  'dist/snackbar/SnackBar/SnackBar.css',
  'dist/slider/Slider/Slider.css',
  'dist/tab/Tab/Tab.css',
  'dist/text/TextArea/TextArea.css',
  'dist/text/TextField/TextField.css',
  'dist/toggle/Toggle/Toggle.css',
  'dist/toggle/Toggle/Toggle.interaction.css',
  'dist/tooltip/Tooltip/Tooltip.css',
  'dist/tokens/typography.css',
];
for (const styleSheetPath of layeredStyleSheets) {
  assert.match(await readFile(join(installedPackage, styleSheetPath), 'utf8'), /@layer components/);
}

assert.match(
  await readFile(join(installedPackage, 'dist/button/Button/Button.types.d.ts'), 'utf8'),
  /Tailwind CSS/,
);
assert.match(
  await readFile(join(installedPackage, 'dist/button/Button/Button.d.ts'), 'utf8'),
  /@example 빠른 사용/,
);
assert.match(
  await readFile(join(installedPackage, 'dist/button/Button/Button.d.ts'), 'utf8'),
  /### 주요 설정/,
);
assert.match(await readFile(join(installedPackage, 'README.md'), 'utf8'), /컴포넌트 스타일을 바꿔요/);
assert.match(css, /\.eli-button/);
assert.match(css, /@layer components/);
assert.match(css, /\.consumer-button\{/);
assert.match(css, /\.consumer-button:hover:not\(:disabled\)/);
assert.match(css, /\.consumer-button:active:not\(:disabled\)/);
assert.match(css, /\.consumer-button:disabled/);
assert.match(css, /#7c3aed/);
assert.match(css, /#6d28d9/);
assert.match(css, /#5b21b6/);
assert.match(css, /#c4b5fd/);
assert.match(css, /data-color=['"]?brand/);
assert.match(css, /data-color=['"]?neutral/);
assert.match(css, /\.eli-icon-button/);
assert.match(css, /\.eli-chip/);
assert.match(css, /\.eli-chip--filter/);
assert.match(css, /\.eli-badge/);
assert.match(css, /\.eli-tooltip/);
assert.match(css, /\.eli-checkbox/);
assert.match(css, /\.eli-alert/);
assert.match(css, /--eli-background-success:/);
assert.match(css, /\.eli-divider/);
assert.match(css, /\.eli-fab/);
assert.match(css, /\.eli-fab-menu/);
assert.match(css, /\.eli-fab-menu-segment/);
assert.match(css, /\.eli-loading-indicator/);
assert.match(css, /\.eli-progress-indicator/);
assert.match(css, /--eli-border-divider:/);
assert.match(css, /--eli-effect-dim:/);
assert.match(css, /--eli-effect-shadow:/);
assert.match(css, /--eli-effect-fab:/);
assert.match(css, /\.eli-menu-item/);
assert.match(css, /\.eli-menu-item__shortcut/);
assert.match(css, /\.eli-dim/);
assert.match(css, /\.eli-navigation-bar/);
assert.match(css, /\.eli-navigation-bar-item/);
assert.match(css, /\.eli-navigation-drawer/);
assert.match(css, /\.eli-navigation-drawer-category/);
assert.match(css, /\.eli-navigation-drawer-item/);
assert.match(css, /\.eli-typo-heading-h1/);
assert.match(css, /\.eli-typo-heading-h2/);
assert.match(css, /\.eli-typo-heading-h3/);
assert.match(css, /\.eli-typo-heading-h4/);
assert.match(css, /\.eli-select/);
assert.match(css, /\.eli-segment-control/);
assert.match(css, /\.eli-snackbar/);
assert.match(css, /\.eli-slider/);
assert.match(css, /\.eli-tab/);
assert.match(css, /\.eli-text-field/);
assert.match(css, /\.eli-text-area/);
assert.match(css, /\.eli-toggle/);
assert.match(css, /\.eli-typo-body-medium/);
assert.match(css, /\.eli-typo-body-small/);
assert.match(css, /\.eli-typo-label-large/);
assert.match(css, /\.eli-typo-label-medium/);
assert.match(css, /\.eli-typo-label-small/);
assert.match(css, /--eli-color-blue-500:/);
assert.match(css, /--eli-color-static-white:/);
assert.match(css, /--eli-font-family-sans:/);
assert.match(js, /커스텀 버튼/);
assert.match(js, /consumer-button/);
assert.match(js, /항목 추가/);
assert.match(js, /선택 칩/);
assert.match(js, /삭제 칩/);
assert.match(js, /컬러/);
assert.match(js, /태그 삭제/);
assert.match(js, /배지 라벨/);
assert.match(js, /약관 동의/);
assert.match(js, /알림 제목/);
assert.match(js, /알림 본문/);
assert.match(js, /⇧⌘P/);
assert.match(js, /메뉴/);
assert.match(js, /탐색 홈/);
assert.match(js, /탐색 항목/);
assert.match(js, /Drawer 홈/);
assert.match(js, /Drawer 카테고리/);
assert.match(js, /Drawer 하위 메뉴/);
assert.match(js, /첫 번째 안내/);
assert.match(js, /두 번째 안내/);
assert.match(js, /분류를 선택하세요/);
assert.match(js, /옵션 2/);
assert.match(js, /보기 방식/);
assert.match(js, /격자/);
assert.match(js, /제목/);
assert.match(js, /메세지를 작성합니다\./);
assert.match(js, /액션/);
assert.match(js, /소비자 범위/);
assert.match(js, /시작 값/);
assert.match(js, /소비자 탭/);
assert.match(js, /이메일을 입력하세요/);
assert.match(js, /이메일/);
assert.match(js, /소개를 입력하세요/);
assert.match(js, /소비자 FAB/);
assert.match(js, /소비자 FAB 메뉴/);
assert.match(js, /소비자 Segment/);
assert.match(js, /소비자 원형 진행/);
assert.match(js, /소비자 막대 진행/);
assert.match(await readFile(join(consumer, 'dist/index.html'), 'utf8'), /rel="stylesheet"/);
const sliderArrow = join(installedPackage, 'dist/slider/Slider/indicator-arrow.svg');
assert.ok((await stat(sliderArrow)).size > 0, 'Slider 값 표시 화살표 SVG가 배포 파일에 있어야 해요.');
assert.match(await readFile(sliderArrow, 'utf8'), /width="10\.001" height="8"/);
for (const assetName of [
  'indeterminate-active.svg',
  'indeterminate-track.svg',
  'progress-0.svg',
  'progress-10.svg',
  'progress-30.svg',
  'progress-50.svg',
  'progress-80.svg',
  'progress-100.svg',
]) {
  const loadingAsset = join(
    installedPackage,
    'dist/loading/LoadingIndicator',
    assetName,
  );
  assert.ok((await stat(loadingAsset)).size > 0, `${assetName}이 배포 파일에 있어야 해요.`);
}
for (const assetPath of [
  'dist/fab/Fab/fab-add.svg',
  'dist/fab/Fab/fab-close.svg',
  'dist/fab/FabMenuSegment/fab-menu-add.svg',
]) {
  assert.ok((await stat(join(installedPackage, assetPath))).size > 0, `${assetPath}이 배포 파일에 있어야 해요.`);
}
const bundle = { jsBytes: Buffer.byteLength(js), cssBytes: Buffer.byteLength(css), note: '개발 검증 예제와 React DOM을 포함한 Vite 번들이에요. ELI 단독 다운로드 크기가 아니에요.' };
await writeFile(join(work, 'consumer-bundle.json'), JSON.stringify(bundle, null, 2));
console.log('패키지 파일·실제 tarball·소비자 타입·SSR 렌더링·외부 className 스타일 덮어쓰기·Alert·Badge·Button·IconButton·Chip·RemovableChip·FilterChip·Checkbox·Divider·Fab·FabMenu·FabMenuSegment·LoadingIndicator·ProgressIndicator·MenuItem·NavigationBar·NavigationBarItem·NavigationDrawer·NavigationDrawerCategory·NavigationDrawerMenu·NavigationDrawerItem·Modal·Select·SegmentControl·Slider·SnackBar·Tab·TextField·TextArea·Toggle·Tooltip CSS와 토큰 자동 연결 검증을 통과했어요.');
console.log('브라우저 확인 대상: .artifacts/packaging/consumer');
