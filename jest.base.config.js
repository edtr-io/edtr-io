const defaultConfig = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': { useESM: true, diagnostics: false },
  },
  moduleNameMapper: {
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
    '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
    '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
    '\\.(css|less|eot|svg|ttf|woff|woff2)$': '<rootDir>/jest.styleMock.js',
    '^@edtr-io/([^/]+)(/__fixtures__)(.*)$': '@edtr-io/$1$2$3',
    '^@edtr-io/([^/]+)(/__helpers__)(.*)$': '@edtr-io/$1$2$3',
    '^@edtr-io/([^/]+)(/beta)(.*)$': '@edtr-io/$1/src$3',
    '^@edtr-io/([^/]+)(/internal)(.*)$': '@edtr-io/$1/src$3',
    '^@edtr-io/([^/]+)(.*)$': '@edtr-io/$1/src$2',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-syntax-highlighter)/)'],
}

export default defaultConfig
