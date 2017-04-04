/* eslint quote-props: 0*/
/* eslint comma-dangle: 0*/

module.exports = {
  'delimiter': '??',
  'seperator': ',',
  'rewrite': {
    '$1$2$3': /^(.*)(?:\.[0-9a-f]+)(\.\w+)(\??.*)$/,
    '$1$2': /^(.*)(?:[0-9a-f]{14}\/)(.*)$/
  }
};
