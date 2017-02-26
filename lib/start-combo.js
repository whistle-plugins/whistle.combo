/* eslint no-unused-expressions: 0 */

// const debug = require('debug')('start-combo');
const Q = require('q');
const util = require('./util');
const http = require('http');
const tianma = require('tianma');
const defaultConfig = require('../config/');
// const proxyMiddleware = require('../middleware/proxy');
const dotBuildMiddleware = require('../middleware/dot-build');
const combo = require('./combo');

function startServer(options) {
  const port = options.port;
  // const portssl = options.portssl;
  const { root, hostname } = options;
  const rewrite = defaultConfig.rewrite || {};
  const { delimiter, seperator } = options;
  const app = tianma();

  app
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
      .rewrite(rewrite)
      .use(dotBuildMiddleware({ root, mode: '.build' })).then
        .static(root)
        .end
      .static(root)
    .end;

  if (port) {
    http.createServer(app.run).listen(port);
    console.log('[i] Listen to http://127.0.0.1:%s ..', port);
  }
}

module.exports = function (options, callback) {
  Q.all([util.getPort(), util.getPort()]).then((ports) => {
    const { delimiter, seperator, hostname } = options;
    const root = options.value;
    const [port, portssl] = ports;

    startServer({
      port,
      portssl,
      root,
      hostname,
      delimiter,
      seperator,
    });

    callback(null, {
      port,
      portssl,
      root,
      hostname,
    });
  });
};

// function test() {
//   startServer({
//     port: 7788,
//     portssl: 7789,
//     root: '/Users/jiewei.ljw/work/wwwwww/test',
//     hostname: 'g.cdn.com',
//     delimiter: '',
//     seperator: '',
//   });
// }
// test();

