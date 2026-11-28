// npm의 검증 구현을 그대로 사용하되, 이 세 함수만 빌드에 포함해 별도 설치를 줄여요.
import valid from 'semver/functions/valid.js';
import validRange from 'semver/ranges/valid.js';
import satisfies from 'semver/functions/satisfies.js';

export { valid, validRange, satisfies };
