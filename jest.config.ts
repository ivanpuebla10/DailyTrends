import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
