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
    http.createServer(app.run).listen(port);
  }
}

module.exports = function (options, callback) {
  Q.all([util.getFreshPort()]).then((ports) => {
    const { root } = options;
    const [port, portssl] = ports;
    const serverConfig = {
      port,
      portssl,
      root,
    };
    startServer(serverConfig);
    callback(null, serverConfig);
  });
};
