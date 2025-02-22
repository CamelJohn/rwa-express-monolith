import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';
import env from './src/services/env';

const presetConfig = createDefaultPreset({
    tsconfig: 'tsconfig.json'
});

const [, test_type] = env.NODE_ENV.split(':');

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: [`**/tests/${test_type}/**/*.spec.ts`],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    maxWorkers: 1,
    verbose: true,
};

export default jestConfig;
