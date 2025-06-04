module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['./jest.setup.js'], // Aquí tu polyfill
};
