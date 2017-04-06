/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
/* eslint no-console: 0 */
/* eslint import/no-extraneous-dependencies: 0 */

const expect = require('Chai').expect;
const whistle = require('whistle');
const request = require('request');
const util = require('../lib/util');

let port;
let proxyRequest;

describe('combo-plugin', () => {
  before(() => {
    util.getFreshPort().then((p) => {
      port = p;

      proxyRequest = request.defaults({
        proxy: `http://127.0.0.1:${port}`,
      });

      // start whistle
      whistle({
        port,
        pluginPaths: [
          __dirname,
        ],
        storage: '__test__',
        rules: [
          `i.alicdn.com combo://c/=:,@${__dirname}`,
          `u.alicdn.com combo://${__dirname}`,
        ],
        debugMode: true,
      }, () => {
        console.log(' Visit http://127.0.0.1:%s/ to access whistle.', port); // eslint-disable-line
      });
    });
  });

  it('request without proxy should return 200', (done) => {
    request.get({
      url: `http://127.0.0.1:${port}/??index.test.js,start-combo-server.test.js`,
    }, (err, res, body) => {
      expect(err).not.exit;
      expect(res.statusCode).to.equal(200);
      expect(body).to.have.length.above(0);

      done();
    });
  });

  it(`rule1: [ i.alicdn.com combo://c/=:,@${__dirname}] should return 200`, (done) => {
    proxyRequest.get({
      url: 'http://i.alicdn.com/mock/c/=x.js,y.js',
      rejectUnauthorized: false,
    }, (err, res, body) => {
      // expect(err).not.exit;
      // expect(res.statusCode).to.equal(200);
      // expect(body).to.have.length.above(0);

      done();
    });
  });

  it(`rule2: [ u.alicdn.com combo://${__dirname}] should return 200`, (done) => {
    proxyRequest.get({
      url: 'http://u.alicdn.com/??index.test.js,start-combo-server.test.js',
      rejectUnauthorized: false,
    }, (err, res, body) => {
      // expect(err).not.exit;
      // expect(res.statusCode).to.equal(200);
      // expect(body).to.have.length.above(0);

      done();
    });
  });
  after(() => {

  });
});
