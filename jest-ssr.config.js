import defaultConfig from './jest.base.config'

/* eslint import/no-default-export: 0 */
export default {
  ...defaultConfig,
  testRegex: '/__tests-ssr__/.*\\.[jt]sx?$',
}
