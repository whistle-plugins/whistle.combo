/* eslint import/no-extraneous-dependencies: 0 */

const expect = require('Chai').expect;
const request = require('request');
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

  it('should successfully start a combo server', () => {
    expect(port).to.be.ok; // eslint-disable-line
    expect(app).to.be.ok; // eslint-disable-line
  });

  it('valid req should successfully return 200', (done) => {
    request.get(`http://127.0.0.1:${port}/??util.test.js,start-combo-server.test.js`, (err, res, body) => {
      expect(err).not.exist; // eslint-disable-line
      expect(res.statusCode).to.equal(200);
      expect(body).to.have.length.above(0);
      expect(res.headers['content-type'], /javascript/);
      done();
    });
  });

  it('invalid req should return 500', (done) => {
    request.get(`http://127.0.0.1:${port}/??util.test0.js,start-combo-server.test.js`, (err, res, body) => {
      expect(err).not.exist; // eslint-disable-line
      expect(res.statusCode).to.equal(500);
      expect(body).to.contains('Error:');
      expect(res.headers['content-type'], /javascript/);
      done();
    });
  });

  after(function () {
    app.close();
  });
});
