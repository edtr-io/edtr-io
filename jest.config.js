import defaultConfig from './jest.base.config'

// eslint-disable-next-line import/no-default-export
export default {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
}
