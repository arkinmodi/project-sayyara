const nextJest = require("next/jest");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/test/**/*.test.ts", "**/test/**/*.test.tsx"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  setupFilesAfterEnv: ["<rootDir>/test/mocks/prismaMock.ts"],
  verbose: true,
  collectCoverage: true,
  clearMocks: true,
  runner: "groups",
  coveragePathIgnorePatterns: ["<rootDir>/test/mocks/"],
  coverageDirectory: "coverage-unit",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
