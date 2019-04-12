module.exports = {
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    es6: true,
    node: true
  },
  extends: [
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier'
  ],
  rules: {
    'no-console': 'off'
  }
}
