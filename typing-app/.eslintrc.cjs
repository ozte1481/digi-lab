module.exports = {
  root: true,
  ignorePatterns: ["node_modules/", ".next/", "out/", "build/"],
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "react/prop-types": "off",
  },
};
