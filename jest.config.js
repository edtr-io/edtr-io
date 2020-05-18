/* eslint-disable import/no-commonjs */
module.exports = {
  moduleNameMapper: {
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
    '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
    '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
    '\\.(css|less|eot|svg|ttf|woff|woff2)$': '<rootDir>/jest.styleMock.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react-syntax-highlighter)/)'],
}
