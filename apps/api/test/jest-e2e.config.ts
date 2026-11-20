import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import ts from 'typescript';

const { config: tsconfig } = ts.readConfigFile('./tsconfig.json', (filePath) =>
  ts.sys.readFile(filePath),
);
const paths = tsconfig?.compilerOptions?.paths ?? {};

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  roots: ['<rootDir>/test'],
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  testTimeout: 30000,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
};

export default config;
