/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "prettier/prettier": ["error"],
    "@typescript-eslint/ban-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-explicit-any": "off"
  },
}