const expect = require('Chai').expect; // eslint-disable-line
const request = require('request'); // eslint-disable-line
const startServer = require('../lib/start-combo-server');

describe('start-combo-server', () => {
  let app;
  let port;

  before(function () {
    startServer({
      root: __dirname,
    }, (err, config, server) => {
      expect(!err);
      expect(config.port);
      expect(config.root === __dirname);
      expect(server);

      app = server;
      port = config.port;
    });
  });

  it('should successfully start a combo server', (done) => {
    request.get(`http://127.0.0.1:${port}/??util.test.js,start-combo-server.test.js`, (err, res, body) => {
      expect(err).not.exist; // eslint-disable-line
      expect(res.statusCode).to.equal(200);
      expect(body).to.have.length.above(0);
      expect(res.headers['content-type'], /javascript/);

      // should throw a exception when request a invalid url
      request.get(`http://127.0.0.1:${port}/??util.test0.js,start-combo-server.test.js`, (err0, res0, body0) => {
        expect(err0).not.exist; // eslint-disable-line
        expect(res0.statusCode).to.equal(500);
        expect(body0).to.contains('Error:');
        expect(res.headers['content-type'], /javascript/);
        done();
      });
    });
  });
  after(function () {
    app.close();
  });
});
