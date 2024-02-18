/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-undef
module.exports = {
    env: {
      browser: true,
      es2024: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'warn',
    },
    globals: {
      L: true,
    },
  };
  