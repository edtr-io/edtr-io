import defaultConfig from './jest.base.config'

// eslint-disable-next-line import/no-default-export
export default {
  ...defaultConfig,
  testRegex: '/__tests-ssr__/.*\\.[jt]sx?$',
}
