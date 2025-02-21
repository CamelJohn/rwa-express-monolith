import { createDefaultPreset, type JestConfigWithTsJest } from 'ts-jest';

const presetConfig = createDefaultPreset({
    tsconfig: 'tsconfig.json'
});

const jestConfig: JestConfigWithTsJest = {
    ...presetConfig,
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    extensionsToTreatAsEsm: ['.ts'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    setupFiles: ['<rootDir>/tests/setupEnvVars.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
};

export default jestConfig;
