const fs = require('co-fs');
const path = require('path');

/**
 * rewrite /{{appname}}/a/b.js => /{{appname}}/.build/{{appname}}/a/b.js
 * @param  {string} root the root directory
 * @return {generator}
 */
module.exports = function (options) {
  const { root, mode } = options;
  return function* (next) {
    const req = this.request;
    const res = this.response;
    const originPath = req.pathname;

    if (mode === '.build') {
      let appname = originPath.split('/')[1] || '';
      let pathname = path.join(
        '/',
        appname,
        '.build',
        originPath).replace(/\\/g, '/');

      try {
        const stats = yield fs.stat(path.join(root, pathname));

        if (stats.isFile()) {
          req.url(pathname);
          yield next;
          req.url(originPath);
        } else {
          res.status(404);
        }
      } catch (err) {
        // file not found
        if (err.code === 'ENOENT') {
          res.status(404);
        } else {
          throw err;
        }
      }
    }
  };
};
