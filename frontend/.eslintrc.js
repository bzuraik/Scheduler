module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
    {
      files: [
        '**/*.spec.js',
        '**/*.spec.jsx',
      ],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'prefer-destructuring': ['error', {
      array: false,
    }],
    'no-plusplus': ['error', {
      allowForLoopAfterthoughts: true,
    }],
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],

  },
};
