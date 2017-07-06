/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-unused-expressions: 0 */
const assert = require('assert');
const request = require('request');
const startServer = require('../lib/start-combo-server');

describe('start-combo-server', () => {
  let app;
  let port;

  before(function () {
    startServer({
      root: __dirname,
    }, (err, config, server) => {
      assert(!err);
      assert(config.port);
      assert(config.root === __dirname);
      assert(server);

      app = server;
      port = config.port;
    });
  });

  it('should successfully start a combo server', () => {
    assert(port);
    assert(app);
  });

  it('valid req should successfully return 200', (done) => {
    request.get(`http://127.0.0.1:${port}/??util.test.js,start-combo-server.test.js`, (err, res, body) => {
      assert(!err);
      assert(res.statusCode === 200);
      assert(body.length > 0);
      assert(/javascript/.test(res.headers['content-type']));
      done();
    });
  });

  it('invalid req should return 500', (done) => {
    request.get(`http://127.0.0.1:${port}/??util.test0.js,start-combo-server.test.js`, (err, res, body) => {
      assert(!err);
      assert(res.statusCode === 500);
      assert(/Error:/.test(body));
      done();
    });
  });

  after(function () {
    app.close();
  });
});
