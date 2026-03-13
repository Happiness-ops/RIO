/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project:     'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType:  'module',
    ecmaVersion: 2021,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    // ── TypeScript ──────────────────────────────────────────────────────────
    '@typescript-eslint/no-explicit-any':            'warn',
    '@typescript-eslint/no-unused-vars':             ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises':       'error',   // Must await promises
    '@typescript-eslint/no-misused-promises':        'error',
    '@typescript-eslint/require-await':              'warn',
    '@typescript-eslint/no-unsafe-assignment':       'warn',
    '@typescript-eslint/no-unsafe-call':             'warn',
    '@typescript-eslint/no-unsafe-member-access':    'warn',

    // ── General ─────────────────────────────────────────────────────────────
    'no-console':     'warn', // Use Logger instead
    'no-debugger':    'error',
    'eqeqeq':         ['error', 'always'],
    'prefer-const':   'error',
    'no-var':         'error',

    // ── NestJS conventions ───────────────────────────────────────────────────
    // Allow empty constructors for NestJS dependency injection
    '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',     // Ignore compiled JS output
    '*.d.ts',
    'coverage/',
  ],
  overrides: [
    // Looser rules for test files
    {
      files: ['**/*.spec.ts', '**/*.e2e.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any':         'off',
        '@typescript-eslint/no-unsafe-assignment':    'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
};