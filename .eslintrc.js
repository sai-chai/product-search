module.exports = {
   env: {
      browser: true,
      es2021: true,
   },
   extends: ['plugin:react/recommended', 'airbnb'],
   parser: '@typescript-eslint/parser',
   parserOptions: {
      ecmaFeatures: {
         jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
   },
   plugins: ['react', '@typescript-eslint'],
   rules: {
      indent: ['error', 3],
      camelcase: 'off',
      react: {
         'react-in-jsx-scope': 'off',
         'jsx-indent': ['error', 3],
         'jsx-indent-props': ['error', 3],
         'jsx-filename-extension': [
            2,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
         ],
      },
      'no-mixed-operators': 'off',
      'import/no-unresolved': 'off',
   },
   globals: {
      React: 'writable',
   },
};
