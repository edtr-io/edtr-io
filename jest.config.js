/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-commonjs */
const defaultConfig = require('./jest.base.config')

module.exports = {
  ...defaultConfig,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom-sixteen',
}
