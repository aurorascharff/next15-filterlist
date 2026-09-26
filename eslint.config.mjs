import { fixupConfigRules } from '@eslint/compat';
import autofix from 'eslint-plugin-autofix';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import reactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: ['**/next-env.d.ts'],
  },
  ...fixupConfigRules(compat.extends('eslint:recommended', 'eslint-config-prettier', 'prettier')),
  ...nextCoreWebVitals,
  {
    languageOptions: {
      ecmaVersion: 12,
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: 'module',
    },
    plugins: {
      autofix,
      'react-compiler': reactCompiler,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  {
    files: ['**/*.ts?(x)'],
    rules: {
      // TypeScript already checks these more accurately; mirrors @typescript-eslint's eslint-recommended override.
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],
      'arrow-body-style': ['warn', 'always'],
      'autofix/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'constructor-super': 'off',
      'getter-return': 'off',
      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
          },
          groups: ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              group: 'parent',
              pattern: '@/**/**',
              position: 'before',
            },
          ],
        },
      ],
      'no-class-assign': 'off',
      'no-console': 'warn',
      'no-const-assign': 'off',
      'no-dupe-args': 'off',
      'no-dupe-class-members': 'off',
      'no-dupe-keys': 'off',
      'no-func-assign': 'off',
      'no-import-assign': 'off',
      'no-new-native-nonconstructor': 'off',
      'no-new-symbol': 'off',
      'no-obj-calls': 'off',
      'no-redeclare': 'warn',
      'no-setter-return': 'off',
      'no-this-before-super': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-unsafe-negation': 'off',
      'no-var': 'error',
      'no-with': 'off',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      quotes: ['warn', 'single'],
      'react/display-name': 'error',
      'react/jsx-key': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'spaced-comment': 'warn',
    },
  },
];

export default eslintConfig;
