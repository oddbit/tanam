module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },

  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@next/next/recommended",
    "google",
  ],

  plugins: ["react", "@typescript-eslint", "prettier"],

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, {extensions: [".js", ".jsx", ".ts", ".tsx"]}],
    "react/jsx-props-no-spreading": "off",
    "react/prop-types": "off",
    "max-len": "off",
    "require-jsdoc": "off",
    "prettier/prettier": "error",
    indent: ["error", 2, {SwitchCase: 1}],
    "operator-linebreak": ["error", "before"],
    quotes: "off", // Use config quotes from prettier, so we turn off this rules to avoiding conflict between eslint and prettier
  },

  ignorePatterns: ["**/src/assets/js/*"],
};
