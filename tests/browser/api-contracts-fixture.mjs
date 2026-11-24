/** 입력·선택·진행률의 공개 계약을 패키지와 소스 설치 양쪽에서 확인해요. */
export const apiContractsFixture = `
function SnackBarFixture() {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(true);
  return <section aria-label="자동 닫힘 검증">
    <button onClick={() => setOpen(true)}>알림 열기</button>
    <button onClick={() => setOpen(false)}>알림 닫기</button>
    <button onClick={() => setDuration(0)}>알림 유지</button>
    <button onClick={() => setDuration(1000)}>알림 1초</button>
    <button onClick={() => setMounted(false)}>알림 제거</button>
    {mounted && <SnackBar data-testid="timed-snackbar" open={open} duration={duration} onOpenChange={next => setOpen(next)} action="실행" onAction={() => setCount(value => value + 1)}>시간 알림</SnackBar>}
    <SnackBar data-testid="uncontrolled-snackbar" action={null}>기본 시간 알림</SnackBar>
    <output data-testid="snackbar-actions">{count}</output>
  </section>;
}
function ApiContractsFixture() {
  const [options, setOptions] = useState(['a', 'b', 'c']);
  const [disabled, setDisabled] = useState(false);
  const [changes, setChanges] = useState('없음');
  const [sliderValue, setSliderValue] = useState(5);
  const [mounted, setMounted] = useState(true);
  const [alternate, setAlternate] = useState(false);
  const [refReport, setRefReport] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const radioRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const refCounts = useRef({ attached: 0, cleaned: 0 });
  const firstRef = useCallback((node: HTMLInputElement | null) => {
    if (node) refCounts.current.attached++;
    return () => { refCounts.current.cleaned++; };
  }, []);
  const secondRef = useCallback((node: HTMLInputElement | null) => {
    if (node) refCounts.current.attached++;
    return () => { refCounts.current.cleaned++; };
  }, []);
  const items = options.map(value => ({ value, label: value, outlinedIcon: <span aria-hidden="true">○</span>, filledIcon: <span aria-hidden="true">●</span> }));
  const stableItems = ['a', 'b', 'c'].map(value => ({ value, label: value, outlinedIcon: <span aria-hidden="true">○</span>, filledIcon: <span aria-hidden="true">●</span> }));
  const withDisabled = ['a', 'b', 'c'].map(value => ({ value, label: value, disabled: value === 'b', outlinedIcon: <span aria-hidden="true">○</span>, filledIcon: <span aria-hidden="true">●</span> }));
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', minWidth: 0, overflowWrap: 'anywhere' }}>
    <SnackBarFixture />
    <section aria-label="간격 검증">
      <Slider aria-label="간격 값" min={0} max={10} step={3} defaultValue={5} onValueChange={value => setChanges(String(value))} />
      <Slider aria-label="제어 간격" min={0} max={10} step={3} value={sliderValue} onValueChange={setSliderValue} />
      <output data-testid="slider-value">{sliderValue}</output>
      <Slider aria-label="소수 간격" min={0.1} max={1} step={0.2} defaultValue={0.4} />
      <Slider aria-label="소수 중간값" min={0} max={1} step={0.1} defaultValue={0.15} />
      <Slider aria-label="끝 간격" min={0} max={10} step={3} defaultValue={10} />
      <Slider aria-label="동일 경계" min={3} max={3} defaultValue={4} />
      <Slider aria-label="큰 간격" min={2} max={4} step={5} defaultValue={4} />
      <Slider aria-label="범위 간격" min={0} max={10} step={3} variant="range" defaultValue={[2.7, 6]} onValueChange={value => setChanges(value.join(','))} />
    </section>
    <section aria-label="참조 검증">
      {mounted && <><TextField ref={inputRef} label="객체 참조" defaultValue="입력" /><TextField ref={alternate ? secondRef : firstRef} label="콜백 참조" /></>}
      <Checkbox ref={checkboxRef} aria-label="참조 체크" />
      <Radio ref={radioRef} aria-label="참조 라디오" value="ref" />
      <TextArea ref={areaRef} label="참조 여러 줄" />
      <button onClick={() => inputRef.current?.focus()}>참조 포커스</button>
      <button onClick={() => setAlternate(current => !current)}>참조 교체</button>
      <button onClick={() => setMounted(false)}>입력 제거</button>
      <button onClick={() => setRefReport(JSON.stringify({ field: inputRef.current?.tagName ?? null, checkbox: checkboxRef.current?.tagName, radio: radioRef.current?.tagName, area: areaRef.current?.tagName, ...refCounts.current }))}>참조 확인</button>
      <output data-testid="ref-report">{refReport}</output>
    </section>
    <button onClick={() => setOptions(['b', 'c'])}>첫 항목 제거</button>
    <button onClick={() => setOptions(['c', 'a', 'b'])}>항목 재추가</button>
    <button onClick={() => setOptions([])}>전체 항목 제거</button>
    <section data-testid="segment-dynamic"><SegmentControl aria-label="동적 세그먼트" options={items} onValueChange={setChanges} /></section>
    <section data-testid="segment-controlled"><SegmentControl aria-label="제어 세그먼트" value="a" options={items} onValueChange={setChanges} /></section>
    <section data-testid="nav-dynamic"><NavigationBar aria-label="동적 탐색" items={items} onValueChange={setChanges} /></section>
    <section data-testid="glass-dynamic"><NavigationBarGlass aria-label="동적 글래스" items={items} onValueChange={setChanges} /></section>
    <section data-testid="glass-controlled"><NavigationBarGlass aria-label="제어 글래스" value="a" items={items} onValueChange={setChanges} /></section>
    <button onClick={() => setDisabled(current => !current)}>전체 비활성화 전환</button>
    <Select label="옵션 비활성화" disabled={disabled} options={withDisabled} onValueChange={setChanges} />
    <SegmentControl aria-label="세그먼트 비활성화" disabled={disabled} options={withDisabled} onValueChange={setChanges} />
    <NavigationBar aria-label="탐색 이동" items={stableItems} onValueChange={setChanges} />
    <NavigationBarGlass aria-label="글래스 이동" items={stableItems} onValueChange={setChanges} />
    <section aria-label="FAB 검증" style={{ position: 'relative', height: 240, flexShrink: 0 }}><FabMenu style={{ position: 'absolute', right: 0, bottom: 0 }} label="비활성 메뉴" defaultExpanded items={[{ id: 'disabled', label: '차단 액션', disabled: true, onClick: () => setChanges('차단 실패') }, { id: 'enabled', label: '허용 액션', onClick: () => setChanges('허용') }]} /></section>
    <output data-testid="api-changes">{changes}</output>
    <section aria-label="진행률 검증">
      {[37, -5, 130, NaN, Infinity, undefined].map((progress, index) => <div key={index} style={{ width: 200 }}><ProgressIndicator aria-label={'막대 ' + index} progress={progress} /><LoadingIndicator aria-label={'원형 ' + index} progress={progress} /></div>)}
    </section>
  </div>;
}
`;

/** 실제 소비 앱의 TypeScript가 허용·거부해야 하는 사용법을 함께 검사해요. */
export const apiContractsTypes = `
function checkPublicInputTypes() {
  const ref = { current: null as HTMLInputElement | null };
  <TextField ref={ref} onChange={event => event.currentTarget.value} />;
  <Checkbox ref={ref} onChange={event => event.currentTarget.checked} />;
  <Radio ref={ref} value="a" onChange={event => event.currentTarget.value} />;
  <TextArea ref={{ current: null as HTMLTextAreaElement | null }} />;
  // @ts-expect-error 탐색 항목은 모두 이동할 수 있어요.
  const navigation: import('react').ComponentProps<typeof NavigationBar>['items'][number] = { value: 'a', label: 'a', outlinedIcon: null, filledIcon: null, disabled: true };
  void navigation;
  // @ts-expect-error 단독 탐색 항목도 disabled를 지원하지 않아요.
  const glass: import('react').ComponentProps<typeof NavigationBarGlass>['items'][number] = { value: 'a', label: 'a', outlinedIcon: null, filledIcon: null, disabled: true };
  void glass;
  // @ts-expect-error input에는 자식을 전달할 수 없어요.
  <Checkbox>자식</Checkbox>;
  // @ts-expect-error input에는 자식을 전달할 수 없어요.
  <Radio value="a">자식</Radio>;
  // @ts-expect-error hr에는 자식을 전달할 수 없어요.
  <Divider>자식</Divider>;
  // @ts-expect-error 내부 슬롯과 직접 HTML 주입을 동시에 지원하지 않아요.
  <Button dangerouslySetInnerHTML={{ __html: '내용' }} />;
}
void checkPublicInputTypes;
`;

/** 새 공개 컴포넌트가 늘어도 상속된 HTML 주입 속성을 함께 점검해요. */
export function publicApiTypeAssertions(names) {
  return `
type PublicProps = ${names.map(name => `import('react').ComponentProps<typeof ${name}>`).join(' | ')};
type HasRawHTML<T> = T extends unknown ? ('dangerouslySetInnerHTML' extends keyof T ? true : false) : never;
const publicHtmlContract: HasRawHTML<PublicProps> extends false ? true : never = true;
void publicHtmlContract;
`;
}
