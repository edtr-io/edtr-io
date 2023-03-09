const defaultConfig = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|eot|svg|ttf|woff|woff2)$': '<rootDir>/jest.styleMock.js',
    '^@edtr-io/([^/]+)(/__fixtures__)(.*)$': '@edtr-io/$1$2$3',
    '^@edtr-io/([^/]+)(/__helpers__)(.*)$': '@edtr-io/$1$2$3',
    '^@edtr-io/([^/]+)(/beta)(.*)$': '@edtr-io/$1/src$3',
    '^@edtr-io/([^/]+)(/internal)(.*)$': '@edtr-io/$1/src$3',
    '^@edtr-io/([^/]+)(.*)$': '@edtr-io/$1/src$2',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-syntax-highlighter)/)'],
}

// eslint-disable-next-line import/no-default-export
export default defaultConfig
