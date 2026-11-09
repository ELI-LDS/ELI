import tseslint from 'typescript-eslint';

export default [
  { ignores: ['**/dist/**', '**/storybook-static/**', '**/.next/**', '**/next-env.d.ts', '.artifacts/**', '**/node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['packages/ui/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/*'],
          message: '배포 JS에 별칭이 남지 않도록 packages/ui에서는 상대 경로를 사용해요.',
        }],
      }],
    },
  },
];
