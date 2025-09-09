/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: {
        jsx: "react-jsx",
      },
    }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@dnd-kit|other-esm-modules)/)"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx}",
    "<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}"
  ],
};