/** 조회된 평탄한 객체 배열만 필드별로 나누고 복잡한 타입은 원문을 유지해요. */
export function parseObjectListType(type: string) {
  const match = /^(readonly\s+)?\{\s*([^{}]+)\s*\}\[\]$/.exec(type);
  if (!match) return null;
  const fields = match[2]!.split(';').map(value => value.trim()).filter(Boolean).map(value => {
    const field = /^(\w+)(\?)?:\s*(.+)$/.exec(value);
    return field && /^(?:string|number|boolean|ReactNode)(?:\[\])?$/.test(field[3]!)
      ? { name: field[1]!, optional: Boolean(field[2]), type: field[3]! } : null;
  });
  if (!fields.length || fields.some(field => !field)) return null;
  return { label: `${match[1] ?? ''}{ … }[]`, fields: fields.filter(field => field !== null) };
}
