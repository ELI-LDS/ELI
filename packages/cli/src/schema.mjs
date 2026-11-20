import { ensure } from './errors.mjs';

/** 레지스트리 v1이 사용하는 JSON Schema 제약만 처리해요. 새 키워드는 조용히 무시하지 않아요. */
export function matches(value, rule, schema) {
  const supported = new Set(['$schema', 'title', '$defs', '$ref', 'oneOf', 'const', 'enum', 'type', 'pattern', 'minLength', 'minItems', 'uniqueItems', 'items', 'required', 'properties', 'additionalProperties']);
  ensure(Object.keys(rule).every(key => supported.has(key)), 'SCHEMA_UNSUPPORTED', '설치 도구가 지원하지 않는 규격이에요.');
  if (rule.$ref) {
    ensure(/^#\/\$defs\/[a-zA-Z]+$/.test(rule.$ref), 'SCHEMA_UNSUPPORTED', '지원하지 않는 규격 참조예요.');
    const target = schema.$defs[rule.$ref.split('/').at(-1)];
    ensure(target, 'SCHEMA_UNSUPPORTED', '규격 참조가 없어요.');
    return matches(value, target, schema);
  }
  if (rule.oneOf) return rule.oneOf.filter(option => matches(value, option, schema)).length === 1;
  if ('const' in rule && JSON.stringify(value) !== JSON.stringify(rule.const)) return false;
  if (rule.enum && !rule.enum.includes(value)) return false;
  if (rule.type === 'null' && value !== null) return false;
  if (rule.type === 'string' && (typeof value !== 'string' || value.length < (rule.minLength ?? 0) || (rule.pattern && !new RegExp(rule.pattern).test(value)))) return false;
  if (rule.type === 'array') {
    if (!Array.isArray(value) || value.length < (rule.minItems ?? 0)) return false;
    if (rule.uniqueItems && new Set(value.map(child => JSON.stringify(child))).size !== value.length) return false;
    if (rule.items && !value.every(child => matches(child, rule.items, schema))) return false;
  }
  if (rule.type === 'object') {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    if (rule.required?.some(key => !Object.hasOwn(value, key))) return false;
    for (const [key, child] of Object.entries(value)) {
      if (Object.hasOwn(rule.properties ?? {}, key)) {
        if (!matches(child, rule.properties[key], schema)) return false;
      } else if (rule.additionalProperties === false) return false;
      else if (typeof rule.additionalProperties === 'object' && !matches(child, rule.additionalProperties, schema)) return false;
    }
  }
  return true;
}
