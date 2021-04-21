export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/database',
    'src/test',
    'src/types'
  ],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {},
};
