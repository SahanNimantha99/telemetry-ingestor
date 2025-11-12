// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Ignore unnecessary paths
    ignores: ['eslint.config.mjs', 'dist', 'node_modules'],
  },
  // Base ESLint recommended rules
  eslint.configs.recommended,
  // TypeScript recommended rules (with type checking)
  ...tseslint.configs.recommendedTypeChecked,
  // Prettier integration
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true, // Enable TypeScript project service for type-aware linting
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'module',
    },
  },
  {
    rules: {
      // ✅ TypeScript relaxed rules (for flexibility)
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // ✅ Prettier settings for consistent formatting
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: true,
          printWidth: 100,
          trailingComma: 'es5',
        },
      ],
      // ✅ Relax unbound-method globally
      '@typescript-eslint/unbound-method': 'warn',
    },
  },
);
