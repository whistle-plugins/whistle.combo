/**
 * start combo server
 */
const Q = require('q');
const http = require('http');
const path = require('path');
const fs = require('fs');
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
          .head('cache-control', 'no-cache, no-store, must-revalidate')
          .head('pragma', 'no-cache');
    })
    .combo()
    .static(root);

  if (port) {
    server = http.createServer(app.run).listen(port);
  }
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

process.on('uncaughtException', (err) => {
  let stack = getErrorStack(err);
  fs.writeFileSync(path.join(process.cwd(), 'whistle.combo.log'), `\r\n${stack}\r\n`, { flag: 'a' });
});
