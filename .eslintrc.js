module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'vue/no-unused-vars': ['error', {
      ignorePattern: '^_'
    }],
    'vue/no-use-v-if-with-v-for': 'warn'
  }
}
