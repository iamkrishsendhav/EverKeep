# React + JavaScript + Vite

This template provides a minimal setup to get React working with Vite using JavaScript and HMR.

It includes the official React Vite plugin and a lightweight Oxlint configuration for maintaining code quality during development.

## Tech Stack

- React
- JavaScript
- Vite
- Oxlint
- ESLint-compatible React rules
- HMR (Hot Module Replacement)

## Official Vite React Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) uses [Oxc](https://oxc.rs)

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

You can use either plugin depending on your project requirements.

## React Compiler

The React Compiler is not enabled in this template by default because of its potential impact on development and build performance.

If you want to enable React Compiler, refer to the official documentation:

[React Compiler Installation](https://react.dev/learn/react-compiler/installation)

## JavaScript Configuration

This project uses standard JavaScript rather than TypeScript.

Therefore, TypeScript-specific configuration such as:

- TypeScript compiler configuration
- `tsconfig.json`
- `oxlint-tsgolint`
- Type-aware linting

is not required for this project.

## Oxlint Configuration

Oxlint is used to maintain code quality and catch common JavaScript and React issues during development.

A production-oriented configuration can include React and JavaScript-related rules.

Example:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "react",
    "oxc"
  ],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": [
      "warn",
      {
        "allowConstantExport": true
      }
    ]
  }
}