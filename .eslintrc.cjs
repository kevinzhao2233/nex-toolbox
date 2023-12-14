module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: {
        arrow: {
          before: true,
          after: true,
        },
      },
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-restricted-syntax': 'off',
    // TS 项目中关闭此配置，但是打开 @typescript-eslint/no-unused-vars
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'no-lonely-if': 'off',
    'no-use-before-define': ['off'],
    'prefer-promise-reject-errors': 'off',
    'symbol-description': 'off',
    'max-len': [
      'error',
      {
        code: 140,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'prefer-destructuring': 'off',
    camelcase: 'off',
    'no-redeclare': 'off',
    'no-nested-ternary': 'off',
  },
};
