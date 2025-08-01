const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');
const _import = require('eslint-plugin-import');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-multi-spaces': ['error'],
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  },
];
