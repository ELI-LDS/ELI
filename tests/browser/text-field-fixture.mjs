/** 입력 지우기가 실제 폼 이벤트·제어 상태와 연결되는지 확인하는 소비 화면이에요. */
export const textFieldFixture = `
function TextFieldFixture() {
  const [value, setValue] = useState('처음 입력');
  const [changes, setChanges] = useState(0);
  const [submits, setSubmits] = useState(0);
  return <form onSubmit={event => { event.preventDefault(); setSubmits(count => count + 1); }}>
    <TextField id="clear-controlled" label="제어 입력" value={value} onChange={event => { setValue(event.currentTarget.value); setChanges(count => count + 1); }} />
    <TextField label="비제어 입력" defaultValue="기본 입력" />
    <TextField label="숫자 입력" type="number" defaultValue={12} />
    <TextField label="읽기 전용 입력" readOnly defaultValue="보존" />
    <TextField label="비활성 입력" state="disabled" defaultValue="보존" />
    <output data-testid="field-value">{value || '빈 값'}</output>
    <output data-testid="field-changes">{changes}</output>
    <output data-testid="form-submits">{submits}</output>
    <button type="reset">초기화</button>
  </form>;
}
`;
