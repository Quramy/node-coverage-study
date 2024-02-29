export default {
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        diagnostics: false,
      },
    ],
  },
  testRegex: "(src/.*\\.test)\\.ts$",
  testPathIgnorePatterns: ["/node_modules/", "\\.d\\.ts$", "lib/.*"],
  coverageReporters: ["text", "lcov", "json", "cobertura"],
  collectCoverageFrom: ["src/**/*.ts"],
  moduleFileExtensions: ["js", "ts", "json"],
};
