// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import testingLibrary from "eslint-plugin-testing-library";
import formatjs from "eslint-plugin-formatjs";
import pluginPromise from 'eslint-plugin-promise';
import stylistic from '@stylistic/eslint-plugin'
// import importPlugin from 'eslint-plugin-import';

// https://typescript-eslint.io/packages/typescript-eslint#flat-config-extends
// https://www.npmjs.com/package/eslint-plugin-react
export default tseslint.config({
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  ignores: ["node_modules/**", "dist/**"],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
    // tseslint.configs.strict,
    tseslint.configs.stylistic,
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime'],
    pluginPromise.configs['flat/recommended'],
    // importPlugin.flatConfigs.recommended,
  ],
  plugins: { 
    'testing-library': testingLibrary,
    "formatjs": formatjs,
    "@stylistic": stylistic.configs.customize({
      flat: true,
      indent: 2,
      quotes: 'single',
      semi: false,
      jsx: true,
    }),
  },
  rules: {
    "@typescript-eslint/no-empty-function": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "react/jsx-indent": [
        "error",
        2
    ],
  }
})