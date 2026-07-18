// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    // The CLI package is plain Node and ships its own conventions.
    ignores: ['dist/*', 'packages/*'],
  },
  {
    rules: {
      // Reanimated shared values are mutated by design (`sharedValue.value = x`),
      // which this React Compiler rule cannot model.
      'react-hooks/immutability': 'off',
    },
  },
]);
