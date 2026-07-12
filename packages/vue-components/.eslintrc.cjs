module.exports = {
  root: true,
  extends: [
    '../../.eslintrc.cjs',
  ],
  plugins: ['vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'vue/html-indent': ['error', 2],
  },
};
