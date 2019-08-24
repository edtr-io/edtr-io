module.exports = {
  extends: ['./.eslint-ci.config.js'],
  plugins: ['import-order-alphabetical'],
  rules: {
    // eslint-plugin-import-order-alphabetical
    'import-order-alphabetical/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index']
        ]
      }
    ]
  }
}
