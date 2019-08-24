module.exports = {
  extends: [
    './.eslintrc.js',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.eslint.json']
  }
}
