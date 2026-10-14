import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  { ignores: ['**/dist', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*'] },
  { linterOptions: { reportUnusedDisableDirectives: 'error', reportUnusedInlineConfigs: 'error' } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: ['scope:shared'] },
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['scope:shared', 'type:modules'] },
            { sourceTag: 'scope:modules', onlyDependOnLibsWithTags: ['scope:core'] },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'PropertyDefinition[accessibility="private"]',
          message: 'Используй нативное приватное поле (#field) вместо модификатора private.',
        },
        {
          selector: 'MethodDefinition[accessibility="private"]',
          message: 'Используй нативный приватный метод (#method) вместо модификатора private.',
        },
        {
          selector: 'PropertyDefinition[readonly=false] > CallExpression[callee.name="inject"]',
          message: 'Все зависимости, полученные через inject(...), должны быть readonly.',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
  { files: ['**/*.html'], rules: { '@angular-eslint/template/prefer-self-closing-tags': 'error' } },
];
