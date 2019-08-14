module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react-hooks'],
  rules: {
    // eslint
    'no-duplicate-imports': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // @typescript-eslint/eslint-plugin
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-this-alias': 'warning',
    '@typescript-eslint/no-unnecessary-type-assertion:': 'warning',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        typedefs: false
      }
    ],
    '@typescript-eslint/no-useless-constructor': 'error',

    // eslint-plugin-import
    'import/export': 'error',
    'import/no-commonjs': 'error',
    'import/no-deprecated': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'packages/bundle-size/webpack.config.js',
          'packages/demo/{__stories__,src}/**/*',
          'scripts/**/*'
        ],
        optionalDependencies: false
      }
    ],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          'katex/dist/katex.css',
          'react-dom/server',
          'react-dom/test-utils',
          'redux-saga/effects'
        ]
      }
    ],
    'import/no-mutable-exports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['parent', 'sibling', 'index', 'unknown']
        ],
        'newlines-between': 'always'
      }
    ],

    // eslint-plugin-react
    'react/prop-types': 'off',

    // eslint-plugin-react-hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
