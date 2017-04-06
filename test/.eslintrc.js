// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  env: {
    mocha: true
  },
  globals: {
    expect: true,
    sinon: true
  },
  extends: 'eslint-config-imweb',
  rules: {
    'prefer-arrow-callback': 0
  }
}
