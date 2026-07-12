import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import parserVue from 'vue-eslint-parser';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: ['public', '**/dist', 'node_modules', '*.d.ts', 'docs/.vitepress/cache'],
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser,
      },
    },
  },
  {
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        CustomEvent: 'readonly',
        MutationObserver: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        AbortController: 'readonly',
        AbortSignal: 'readonly',
        Worker: 'readonly',
        MessageChannel: 'readonly',
        performance: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/member-delimiter-style': ['error', {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      }],
      '@stylistic/type-annotation-spacing': ['error', {
        before: false,
        after: true,
        overrides: {
          arrow: {
            before: true,
            after: true,
          },
        },
      }],
      '@stylistic/max-len': [
        'error',
        {
          code: 140,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
        },
      ],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',
      'no-param-reassign': 'off',
      'no-unused-expressions': 'off',
      'no-lonely-if': 'off',
      'no-use-before-define': 'off',
      'prefer-promise-reject-errors': 'off',
      'symbol-description': 'off',
      'prefer-destructuring': 'off',
      camelcase: 'off',
      'no-redeclare': 'off',
      'no-nested-ternary': 'off',
      'class-methods-use-this': ['error', { enforceForClassFields: false }],
      'vue/html-indent': ['error', 2],
    },
  },
);
