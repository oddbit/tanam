module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      { semi: true, singleQuote: true, printWidth: 80 }
    ],
    'vue/html-indent': [
      'error',
      2,
      {
        attribute: 1,
        closeBracket: 0,
        ignores: [],
        alignAttributesVertically: true
      }
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        selfClosingTag: 'always'
      }
    ],
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}