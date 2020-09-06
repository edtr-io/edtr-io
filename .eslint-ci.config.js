const fs = require('fs')
const path = require('path')

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
          'jest*.[jt]s',
          'packages/*/*/{__helpers__,__stories__,__tests__,__tests-ssr__}/**/*',
          'packages/private/bundle-size/webpack.config.js',
          'packages/private/demo/{scripts,src}/**/*',
          'scripts/**/*',
        ],
        optionalDependencies: false,
        packageDir: [__dirname, ...getPackageDirectories()],
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

function getPackageDirectories() {
  const dirs = getDirectories(path.join(__dirname, 'packages'))
  const dirsOfDirs = dirs.map((dir) => getDirectories(dir))

  return [].concat(...dirsOfDirs)
}

function getDirectories(source) {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((child) => child.isDirectory())
    .map((dir) => path.join(source, dir.name))
}
