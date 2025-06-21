// eslint.config.js
import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier'
import jest from 'eslint-plugin-jest'

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier,
      jest,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/return-await': 'off',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          printWidth: 140,
          tabWidth: 2,
          singleQuote: true,
          bracketSpacing: true,
          trailingComma: 'es5',
          arrowParens: 'always',
          endOfLine: 'auto',
        },
      ],
    },
    settings: {
      jest: {
        version: 29,
      },
    },
  },
]
