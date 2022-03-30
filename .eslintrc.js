/* eslint-disable import/no-commonjs */
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest-dom/recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'jest-dom',
    'jsdoc',
    'react-hooks',
    'testing-library',
  ],
  rules: {
    // eslint
    'no-unused-vars': 'off',

    // @typescript-eslint/eslint-plugin
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-duplicate-imports': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        typedefs: false,
      },
    ],
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',

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
          'jest*.[jt]s',
        ],
        optionalDependencies: false,
      },
    ],
    'import/no-internal-modules': [
      'error',
      {
        allow: [
          '@edtr-io/*/{beta,internal}',
          '@fortawesome/free-solid-svg-icons/*',
          'katex/dist/katex.css',
          'react-dom/client',
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

    // eslint-plugin-jsdoc
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-tag-names': [
      'warn',
      {
        definedTags: [
          'beta',
          'internal',
          'packageDocumentation',
          'remarks',
          'typeParam',
        ],
      },
    ],
    'jsdoc/check-types': 'off',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/require-returns-type': 'off',

    // eslint-plugin-react
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/prop-types': 'off',

    // eslint-plugin-react-hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',

    // eslint-plugin-testing-library
    'testing-library/no-debugging-utils': 'error',
    'testing-library/no-dom-import': ['error', 'react'],
    'testing-library/no-manual-cleanup': 'error',
    'testing-library/no-wait-for-empty-callback': 'error',
    'testing-library/prefer-explicit-assert': 'error',
    'testing-library/prefer-screen-queries': 'error',
    'testing-library/prefer-wait-for': 'error',
  },
  settings: {
    jsdoc: {
      ignorePrivate: true,
      tagNamePreference: {
        hidden: 'ignore',
      },
    },
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
    {
      files: [
        '**/__tests__/**/*.js',
        '**/__tests__/**/*.tsx',
        '**/__tests-ssr__/**/*.js',
        '**/__tests-ssr__/**/*.js',
      ],
      extends: ['plugin:testing-library/dom', 'plugin:testing-library/react'],
    },
  ],
}
