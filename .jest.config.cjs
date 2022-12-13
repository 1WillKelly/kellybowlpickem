/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts-esm",
  moduleDirectories: ["src", "node_modules"],
  testEnvironment: "node",
};
