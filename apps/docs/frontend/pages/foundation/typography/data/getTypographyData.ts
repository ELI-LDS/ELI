import { tokenGroups } from '../../common/tokenGroups';

const title = (value: string) => value[0]?.toUpperCase() + value.slice(1);

/** 모바일·데스크톱 의미 토큰을 따로 읽어 같은 키의 모바일 값이 기본값을 덮어쓰지 않게 해요. */
export function getTypographyData() {
  const groups = tokenGroups('typography');
  const base = Object.assign({}, ...groups.filter(group => group.group !== 'Typography / Heading / Mobile').map(group => group.tokens)) as Record<string, string>;
  const mobile = groups.find(group => group.group === 'Typography / Heading / Mobile')?.tokens ?? {};
  const resolveSize = (value: string | undefined): number => {
    if (!value) throw new Error('타이포그래피 크기 토큰이 없어요.');
    const alias = value.match(/^var\((--[\w-]+)\)$/)?.[1];
    if (alias) return resolveSize(base[alias]);
    return Number.parseFloat(value) * (value.endsWith('rem') ? 16 : 1);
  };
  const definitions = [
    { name: 'H1', key: 'heading-h1', className: 'heading-h1', group: 'heading', weight: 'bold', spacing: '-2%' },
    { name: 'H2', key: 'heading-h2', className: 'heading-h2', group: 'heading', weight: 'bold', spacing: '-1%' },
    { name: 'H3', key: 'heading-h3', className: 'heading-h3', group: 'heading', weight: 'bold', spacing: '-1%' },
    { name: 'H4', key: 'heading-h4', className: 'heading-h4', group: 'heading', weight: 'bold', spacing: '-1%' },
    { name: 'Body Medium', key: 'body-01', className: 'body-medium', group: 'body', weight: 'regular', spacing: '0%' },
    { name: 'Body Small', key: 'body-02', className: 'body-small', group: 'body', weight: 'regular', spacing: '0%' },
    { name: 'Label Large', key: 'label-01', className: 'label-large', group: 'label', weight: 'semibold', spacing: '0%' },
    { name: 'Label Medium', key: 'label-02', className: 'label-medium', group: 'label', weight: 'medium', spacing: '0%' },
    { name: 'Label Small', key: 'label-03', className: 'label-small', group: 'label', weight: 'medium', spacing: '0%' },
  ];
  return definitions.map(definition => {
    const key = `--eli-font-size-${definition.key}`;
    const desktopSize = resolveSize(base[key]);
    const mobileSize = resolveSize(mobile[key] ?? base[key]);
    const sizeLabel = (size: number) => `${size}px (${size / 16}rem)`;
    return {
      ...definition, className: `eli-typo-${definition.className}`, weightLabel: title(definition.weight),
      weightValue: base[`--eli-font-weight-${definition.weight}`],
      lineHeight: definition.group === 'body' ? '150%' : '120%',
      size: mobileSize === desktopSize ? sizeLabel(desktopSize) : `${sizeLabel(mobileSize)} / ${sizeLabel(desktopSize)}`,
    };
  });
}

export type TypographyStyle = ReturnType<typeof getTypographyData>[number];
