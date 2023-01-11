import defaultConfig from './jest.base.config'

export default {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
}
