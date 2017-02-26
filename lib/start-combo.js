/**
 * start combo server
 */
const Q = require('q');
const util = require('./util');
const http = require('http');
const tianma = require('tianma');
const combo = require('./combo');

// const proxyMiddleware = require('../middleware/proxy');
// const dotBuildMiddleware = require('../middleware/dot-build');
// const defaultConfig = require('../config/');
// const rewrite = defaultConfig.rewrite || {};

function startServer(options) {
  const port = options.port;

  const { root, hostname } = options;
  const { delimiter, seperator } = options;
  const app = tianma();

  app // eslint-disable-line no-unused-expressions
    .use(function* (next) {
      yield next;
      this.response
          .head('access-control-allow-origin', '*')
          .head('cache-control', 'no-cache, no-store, must-revalidate')
          .head('pragma', 'no-cache');
    })
    .use(combo({
      delimiter,
      seperator,
    }))
    .mount(hostname).then
      // .use(proxyMiddleware(root)).then
      //   .rewrite({
      //     [`http://${hostname}$1`]: /^(.*)/,
      //   })
      //   .end
      // .rewrite(rewrite)
      // .use(dotBuildMiddleware({ root, mode: '.build' })).then
      //   .static(root)
      //   .end
      .static(root)
    .end;

  if (port) {
    http.createServer(app.run).listen(port);
  }
}

module.exports = function (options, callback) {
  Q.all([util.getPort(), util.getPort()]).then((ports) => {
    // const { delimiter, seperator, hostname, root } = options;

    const [port, portssl] = ports;
    const serverConfig = Object.assign({
      port,
      portssl,
    }, options);

    startServer(serverConfig);
    callback(null, serverConfig);
  });
};

// startServer({
//   port: 7788,
//   portssl: 7789,
//   root: '/Users/jiewei.ljw/work/wwwwww/test',
//   hostname: 'g.cdn.com',
//   delimiter: '?@',
//   seperator: '-',
// });

