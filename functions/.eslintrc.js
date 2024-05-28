module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/generated/**/*", // Ignore generated files.
  ],
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    quotes: "off", // Use config from prettier
    "max-len": "off",
    "require-jsdoc": "off",
    "import/no-unresolved": 0,
    indent: ["error", 2, {SwitchCase: 1}],
    "operator-linebreak": ["error", "before"],
    "prettier/prettier": "error",
  },
};
