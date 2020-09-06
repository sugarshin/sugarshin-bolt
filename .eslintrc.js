module.exports = {
  root: true,
  ignorePatterns: [
    'dist',
    '*.js'
  ],
  parserOptions: {
    jsx: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/camelcase': 'off',
  },
  overrides: [
    {
      files: [
        '**/*.tsx',
        // Express middlewares must define the last argument, even if not used(e.g., error handler)
        'src/controller/**/*.ts',
        'src/middleware/**/*.ts',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
};
