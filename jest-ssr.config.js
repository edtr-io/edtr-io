import defaultConfig from './jest.base.config'

export default {
  ...defaultConfig,
  testRegex: '/__tests-ssr__/.*\\.[jt]sx?$',
}
