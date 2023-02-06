import defaultConfig from './jest.base.config'

/* eslint import/no-default-export: 0 */
export default {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
}
