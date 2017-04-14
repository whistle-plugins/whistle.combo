/**
 * start combo server
 */

const path = require('path');
const fs = require('fs');
const http = require('http');
const tianma = require('tianma');
const util = require('./util');

function startServer(options) {
  const { root, port, callback } = options;
  const app = tianma();
  let server = null;

  app // eslint-disable-line
    .use(function* (next) {
      yield next;
      this.response
          .head('access-control-allow-origin', '*')
          // https://www.smashingmagazine.com/2017/04/secure-web-app-http-headers/
          .head('cache-control', 'no-cache,no-store,max-age=0,must-revalidate')
          .head('pragma', 'no-cache')
          .head('expires', '-1');
    })
    .combo()
    .static(root);
  /* istanbul ignore else  */
  if (port) {
    server = http.createServer(app.run).listen(port);
  }

  /* istanbul ignore else  */
  if (typeof callback === 'function') {
    callback(null, {
      port,
      root,
    }, server);
  }
  return server;
}

module.exports = function (options, callback) {
  util.getFreshPort().then((port) => {
    const { root } = options;

    startServer({
      port,
      root,
      callback,
    });
  });
};
/* istanbul ignore next */
function getErrorStack(err) {
  let stack = '';
  try {
    stack = err && (err.stack || err.message || err);
  } catch (e) {
    /* eslint no-console: 0 */
    console.error(e);
  }
  return `Date: ${new Date()}\r\n${stack || err.message || err}`;
}
/* istanbul ignore next */
process.on('uncaughtException', (err) => {
  let stack = getErrorStack(err);
  fs.writeFileSync(path.join(process.cwd(), 'whistle.combo.log'), `\r\n${stack}\r\n`, { flag: 'a' });
});
