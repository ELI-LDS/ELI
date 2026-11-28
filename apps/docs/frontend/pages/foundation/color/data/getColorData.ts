import { tokenGroups } from '../../common/tokenGroups';
import type { ColorToken, PaletteGroup, SemanticGroup } from '../color.types';
import { inversePreviewRoles, semanticDescriptions } from './semantic-descriptions';

const kebab = (value: string) => value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const title = (value: string) => value[0]?.toUpperCase() + value.slice(1);

/** CSS가 참조하는 원시 색상과 투명도를 문서에서 읽을 수 있는 값으로 표현해요. */
function colorToken(name: string, raw: string, primitives: Record<string, string>, label: string): ColorToken {
  const referenceName = raw.match(/var\((--[\w-]+)\)/)?.[1];
  const base = referenceName ? primitives[referenceName] : raw;
  if (!base || !/^#[\da-f]{6}$/i.test(base)) throw new Error(`표시할 원시 색상이 없어요: ${name}`);
  const reference = referenceName?.replace('--eli-color-', '').split('-').map(title).join('/') ?? label;
  const opacity = raw.match(/\/\s*([\d.]+%)/)?.[1] ?? null;
  return { name, label, value: base, reference, opacity, light: true };
}

export function getColorData(): { primitive: PaletteGroup[]; semantic: SemanticGroup[] } {
  const groups = tokenGroups('color');
  const primitiveValues = Object.assign({}, ...groups.map(group => group.tokens)) as Record<string, string>;
  const semanticValues = Object.assign({}, ...tokenGroups('semantic-color').map(group => group.tokens)) as Record<string, string>;
  const primitive = ['Blue', 'Neutral', 'Static', 'Red', 'Yellow', 'Green'].map(name => ({
    name,
    tokens: Object.entries(groups.find(group => group.group === name)?.tokens ?? {}).map(([key, value]) => {
      const suffix = key.replace(`--eli-color-${name.toLowerCase()}-`, '');
      const label = name === 'Static' ? title(suffix) : `${name}-${suffix.padStart(3, '0')}`;
      return colorToken(key, value, primitiveValues, label);
    }),
  }));
  const semantic = ['Foreground', 'Background', 'Border'].map(name => ({
    name,
    tokens: Object.entries(semanticDescriptions).filter(([role]) => role.startsWith(`${name}/`)).map(([role, description]) => {
      const key = `--eli-${role.split('/').map(kebab).join('-')}`;
      const raw = semanticValues[key];
      if (!raw) throw new Error(`문서와 일치하는 의미 토큰이 없어요: ${key}`);
      return { ...colorToken(key, raw, primitiveValues, role), description, light: !inversePreviewRoles.has(role) };
    }),
  }));
  return { primitive, semantic };
}

