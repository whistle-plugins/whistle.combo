/* eslint no-unused-vars: 0 */
// const debug = require('debug')('http');
const fs = require('fs');
const path = require('path');
const p = require('pfork');
const url = require('url');
const https = require('https');
const http = require('http');
// const merge = require('merge');
// const defaultConfig = require('../config/');

const START_COMBO = path.join(__dirname, 'start-combo');
let RULE_VALUE_HEADER;
let SSL_FLAG_HEADER;

function getRootDir(req) {
  const root = req.headers[RULE_VALUE_HEADER];
  return typeof root === 'string' ? decodeURIComponent(root)
  .replace(/\\/g, '/')
  .replace(/\/$/, '') : '';
}

function getFullUrl(req) {
  let _url = req.url;
  if (/^https?:\/\//.test(_url)) {
    return _url;
  }
  return `http://${req.headers.host}${_url}`;
}

function transformRequest(req, res, ports) {
  let options = url.parse(getFullUrl(req));
  options.method = req.method;
  options.headers = req.headers;
  options.host = '127.0.0.1';
  options.port = ports.port;
  options.hostname = null;

  const abort = () => {
    res.destroy();
  };

  const client = http.request(options, (_res) => {
    _res.on('error', abort);
    res.writeHead(_res.statusCode, _res.headers);
    _res.pipe(res);
  });
  client.on('error', abort);
  req.pipe(client);
}

function noop() {}

function response(req, res, statusCode, msg) {
  req.on('data', noop);
  req.on('end', () => {
    res.writeHead(statusCode || 501, {
      'content-type': 'text/plain charset=utf-8',
    });
    res.end(msg);
  });
}

module.exports = function (server, options) {
  RULE_VALUE_HEADER = options.RULE_VALUE_HEADER;
  SSL_FLAG_HEADER = options.SSL_FLAG_HEADER;

  server.on('request', (req, res) => {
    req.on('error', noop);
    res.on('error', noop);

    const root = getRootDir(req);
    console.log(root)
    console.log(req.headers[RULE_VALUE_HEADER]);

    if (!root) {
      return response(req, res, 500, 'Not found root directory.');
    }

    fs.stat(root, (err, stats) => {
      if (err || !stats.isDirectory()) {
        return response(req, res, 500, (err && err.message) || (`${root} is not a directory.`));
      }
      p.fork({
        script: START_COMBO,
        value: root,
        hostname: req.headers.host,
      }, (e, data, child) => {
        if (e) {
          return response(req, res, 500, err);
        }
        console.log(data);
        transformRequest(req, res, data);
      });
    });
  });
};

