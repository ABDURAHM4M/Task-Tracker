// .eslintrc.cjs
module.exports = {
    env: {
      node: true,
      jest: true,
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      // any custom rules you like, e.g.:
      // 'no-console': 'warn',
    },
  };
  