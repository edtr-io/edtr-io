// eslint-disable-next-line import/no-commonjs
module.exports = {
  mode: 'modules',
  name: 'Edtr.io',
  exclude: [
    '**/__helpers__/**',
    '**/__stories__/**',
    '**/__tests__/**',
    '**/__tests-ssr__/**',
    '**/dist/**',
    'packages/bundle-size/**',
    'packages/demo/**',
    'packages/fixtures/**',
    'packages/plugin-*/**',
    'packages/store-devtools/**'
  ],
  excludeNotExported: true,
  hideBreadcrumbs: true,
  hideGenerator: true,
  readme: 'none'
}
