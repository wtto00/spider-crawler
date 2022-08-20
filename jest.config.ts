import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  testTimeout: 10000,

  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1',
  },
};

export default config;
