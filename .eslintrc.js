module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: '*/tsconfig.json'
    },
    plugins: [
      '@typescript-eslint',
    ],
    env: {
        node: true
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "eol-last": ["error", "always"],
      "@typescript-eslint/ban-ts-comment": "off"
    }
  };
