import { getTokens } from '../../../../content/query';
import type { TokenCategory } from '../../../../content/schema';

export function tokenGroups(category: TokenCategory) {
  const result = getTokens({ category });
  if ('error' in result) throw new Error(result.error.message);
  if (!('groups' in result)) throw new Error('토큰 분류를 지정해야 해요.');
  return result.groups;
}
