module.exports = {
  env: {
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
  rules: {
    // eslint
    'no-duplicate-imports': 'error',

    // @typescript-eslint/eslint-plugin
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-this-alias': 'warning',
    '@typescript-eslint/no-unnecessary-type-assertion:': 'warning',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        typedefs: false
      }
    ],
    '@typescript-eslint/no-useless-constructor': 'error',

    // eslint-plugin-react
    'react/prop-types': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
