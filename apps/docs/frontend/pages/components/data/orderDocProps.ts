const content = ['children', 'title', 'label', 'message', 'subMessage', 'placeholder', 'action', 'positiveAction', 'secondaryAction', 'removeLabel', 'items', 'options', 'subItems', 'icon', 'leftIcon', 'rightIcon', 'outlinedIcon', 'filledIcon', 'expandedIcon', 'shortcut'];
const configuration = ['color', 'variant', 'size', 'type', 'status', 'name', 'min', 'max', 'step', 'duration', 'progress', 'showLabel', 'showMarker', 'showValueIndicator', 'showLeftValueIndicator', 'showRightValueIndicator', 'expandable'];
const state = ['value', 'defaultValue', 'checked', 'defaultChecked', 'selected', 'selectedValues', 'active', 'defaultActive', 'open', 'defaultOpen', 'expanded', 'defaultExpanded', 'state', 'disabled'];
const customization = ['width', 'height', 'backgroundColor', 'actionColor', 'style'];

function byName(name: string) {
  const groups = [content, configuration, state];
  for (let group = 0; group < groups.length; group++) {
    const index = groups[group]!.indexOf(name);
    if (index >= 0) return group * 100 + index;
  }
  if (/^on[A-Z]/.test(name)) return 400;
  if (name.startsWith('aria-') || name === 'ref') return 500;
  const index = customization.indexOf(name);
  return index >= 0 ? 600 + index : 300;
}

/** 원본 API를 변경하지 않고 문서에 표시하는 순서만 맞춰요. 같은 분류의 미지정 속성은 원래 순서를 유지해요. */
export function orderDocProps<T extends { name: string; required?: unknown }>(props: readonly T[]): T[] {
  const rank = (prop: T) => prop.name === 'className' ? 1000 : byName(prop.name) - (prop.required === true ? 1000 : 0);
  return [...props].sort((a, b) => rank(a) - rank(b));
}

/** 전체 속성을 찾는 목적에 따라 묶되 원본 Props와 상세 설명은 유지해요. */
export function groupDocProps<T extends { name: string; required?: unknown }>(props: readonly T[]) {
  const groups = [
    { id: 'content', title: '내용과 항목' },
    { id: 'configuration', title: '주요 설정' },
    { id: 'interaction', title: '상태와 이벤트' },
    { id: 'other', title: '기타 설정' },
    { id: 'accessibility', title: '접근성' },
    { id: 'style', title: '스타일 변경' },
  ];
  const groupOf = (name: string) => {
    if (name === 'className') return 'style';
    const rank = byName(name);
    if (rank < 100) return 'content';
    if (rank < 200) return 'configuration';
    if (rank < 300 || rank === 400) return 'interaction';
    if (rank === 300) return 'other';
    return rank === 500 ? 'accessibility' : 'style';
  };
  const ordered = orderDocProps(props);
  return groups.flatMap(group => {
    const items = ordered.filter(prop => groupOf(prop.name) === group.id);
    return items.length ? [{ ...group, props: items }] : [];
  });
}
