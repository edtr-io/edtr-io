module.exports = {
  extends: [
    './.eslintrc.js',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
  },
  rules: {
    // eslint-plugin-import
    'import/export': 'error',
    'import/extensions': ['error', 'never'],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-commonjs': 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-deprecated': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'packages/*/*/{__helpers__,__stories__,__tests__,__tests-ssr__}/**/*',
          'packages/private/bundle-size/webpack.config.js',
          'packages/private/demo/{scripts,src}/**/*',
          'scripts/**/*',
        ],
        optionalDependencies: false,
      },
    ],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          '@edtr-io/*/{beta,internal}',
          'katex/dist/katex.css',
          'react-dom/server',
          'react-dom/test-utils',
          'react-syntax-highlighter/dist/cjs/styles/*/*',
          'redux-saga/effects',
        ],
      },
    ],
    'import/no-mutable-exports': 'error',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true,
      },
    ],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index', 'unknown'],
        ],
        'newlines-between': 'always',
      },
    ],
  },
}
