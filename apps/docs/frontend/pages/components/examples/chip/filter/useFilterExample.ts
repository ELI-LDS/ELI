import { useId, useState } from 'react';

export const filterGroups = [
  { id: 'gender', label: '성별', selection: 'single', options: [{ value: 'all', label: '전체' }, { value: 'female', label: '여성' }, { value: 'male', label: '남성' }] },
  { id: 'material', label: '소재', selection: 'multiple', options: [
    { value: 'nylon', label: '나일론' },
    { value: 'polyester', label: '폴리에스터' },
    { value: 'synthetic-leather', label: '인조가죽' },
    { value: 'wool', label: '울/모' },
    { value: 'cotton', label: '면(코튼)' },
    { value: 'other', label: '기타' },
  ] },
] as const;

type FilterGroupId = typeof filterGroups[number]['id'];

/** 칩과 설정 화면이 같은 선택값을 공유하며, 닫고 다시 열어도 선택을 유지해요. */
export function useFilterExample() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [values, setValues] = useState<Record<FilterGroupId, string[]>>({ gender: [], material: [] });
  const id = useId();
  const show = (index: number) => { setTab(index); setOpen(true); };
  // 성별은 하나로 교체하고 소재는 다른 선택을 유지한 채 추가·해제해요.
  const select = (group: FilterGroupId, value: string, checked: boolean) => setValues(previous => ({
    ...previous,
    [group]: group === 'gender' ? [value]
      : checked ? [...previous[group].filter(item => item !== value), value]
        : previous[group].filter(item => item !== value),
  }));
  return { open, setOpen, tab, setTab, values, select, id, show };
}
