/**
 * start combo server
 */
const Q = require('q');
const http = require('http');
const tianma = require('tianma');
const util = require('./util');

function startServer(options) {
  const port = options.port;
  const { root } = options;
  const app = tianma();

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
    return http.createServer(app.run).listen(port);
  }

  return null;
}

module.exports = function (options, callback) {
  Q.all([util.getFreshPort()]).then((ports) => {
    const { root } = options;
    const [port] = ports;
    const serverConfig = {
      port,
      root,
    };
    const server = startServer(serverConfig);
    callback(null, serverConfig, server);
  });
};
