/** 실제 소비 앱에서 Modal의 상태·콜백을 제어하는 검증용 화면이에요. */
export const modalFixture = `
function ModalFixture() {
  const [open, setOpen] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(0);
  const [fixedOpen, setFixedOpen] = useState(false);
  const [preventPositive, setPreventPositive] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [preventClose, setPreventClose] = useState(false);
  const [positive, setPositive] = useState(0);
  const [secondary, setSecondary] = useState(0);
  return <>
    <button onClick={() => setOpen(true)}>모달 열기</button>
    <button onClick={() => setUncontrolled(value => value + 1)}>비제어 모달 열기</button>
    <button onClick={() => setFixedOpen(true)}>외부값 유지 모달</button>
    <label><input type="checkbox" checked={preventClose} onChange={event => setPreventClose(event.target.checked)} />취소 유지</label>
    <label><input type="checkbox" checked={preventPositive} onChange={event => setPreventPositive(event.target.checked)} />확인 유지</label>
    <output data-testid="modal-sequence">{sequence.join(",")}</output>
    <output data-testid="positive-count">{positive}</output>
    <output data-testid="secondary-count">{secondary}</output>
    <Modal open={open} onOpenChange={next => { setSequence(value => [...value, "close"]); setOpen(next); }} title="동작 검증" message="첫 문장" subMessage="둘째 문장" positiveAction="확인" secondaryAction="취소" onPositiveAction={event => { setSequence(value => [...value, "positive"]); setPositive(value => value + 1); if (preventPositive) event.preventDefault(); }} onSecondaryAction={event => { setSecondary(value => value + 1); if (preventClose) event.preventDefault(); }} />
    {uncontrolled > 0 && <Modal key={uncontrolled} title="비제어 검증" positiveAction="확인" secondaryAction="취소" />}
    {fixedOpen && <Modal open title="외부값 검증" positiveAction="제거" secondaryAction="취소" onOpenChange={() => undefined} onPositiveAction={() => setFixedOpen(false)} />}
    <Modal defaultOpen={false} title="처음 닫힌 모달" />
  </>;
}
`;
