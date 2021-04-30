import type { Config } from "@jest/types"

import { resolve } from "path"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  setupFiles: ["dotenv-flow/config"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: [
    "node_modules",
    "src/database",
    "src/test",
    "src/types",
  ],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  transform: {},
  moduleNameMapper: {
    "^@root/(.*)$": resolve(__dirname, "./$1"),
    "^@src/(.*)$": resolve(__dirname, "./src/$1"),
    "^@config/(.*)$": resolve(__dirname, "./src/config/$1"),
    "^@constants/(.*)$": resolve(__dirname, "./src/constants/$1"),
    "^@controllers/(.*)$": resolve(__dirname, "./src/controllers/$1"),
    "^@database/(.*)$": resolve(__dirname, "./src/database/$1"),
    "^@middleware/(.*)$": resolve(__dirname, "./src/middleware/$1"),
    "^@mocks/(.*)$": resolve(__dirname, "./src/mocks/$1"),
    "^@models/(.*)$": resolve(__dirname, "./src/models/$1"),
    "^@routes/(.*)$": resolve(__dirname, "./src/routes/$1"),
    "^@schemas/(.*)$": resolve(__dirname, "./src/schemas/$1"),
    "^@ts/(.*)$": resolve(__dirname, "./src/types/$1"),
    "^@utils/(.*)$": resolve(__dirname, "./src/utils/$1"),
  },
}

export default config
