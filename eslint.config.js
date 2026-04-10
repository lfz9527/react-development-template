import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const ignore = ['dist', 'node_modules', 'public', 'pnpm-lock.yaml', 'README.md']

export default defineConfig([
  globalIgnores(ignore),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 禁止在同一个文件中重复导入相同的模块。
      'no-duplicate-imports': 'error',
      // 允许写any
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许未使用的变量
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/preserve-manual-memoization': 'warn',
      'no-empty': 'off',
      // '@typescript-eslint/indent': 'off',
      // 'no-mixed-spaces-and-tabs': 'off',
      // indent: 'off',
    },
  },
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    },
  },
  prettier,
])
