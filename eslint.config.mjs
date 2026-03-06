import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.aws-sam/**', 'aws/leaderboard/dist/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.es2022
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off'
    }
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs.recommended.rules
    }
  },
  {
    files: ['aws/leaderboard/**/*.ts', 'vite.config.ts', 'scripts/**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      }
    }
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2022
      }
    }
  }
];
