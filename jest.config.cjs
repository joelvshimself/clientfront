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
  setupFiles: ['./jest.setup.js'],               // ⬅️ antes del entorno
  setupFilesAfterEnv: ['./jest.setupAfterEnv.js'] // ⬅️ después del entorno (donde sí existe `expect`)
};
