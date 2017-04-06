// process.on('uncaughtException', (err) => {
//   console.log(err);
//   process.exit(1);
// });
const fs = require('fs');
const path = require('path');
const p = require('pfork');
const url = require('url');
const http = require('http');
const util = require('./util');

const START_COMBO = path.join(__dirname, 'start-combo-server');
const cache = {};
let RULE_VALUE_HEADER;

function getFullUrl(req) {
  let _url = req.url;
  if (/^https?:\/\//.test(_url)) {
    return _url;
  }
  return `http://${req.headers.host}${_url}`;
}

function transferRequest(req, res, data) {
  const { port, delimiter, seperator } = data;
  let fullUrl = getFullUrl(req).replace(delimiter, '??').split(seperator || ',').join(',');
  const options = url.parse(fullUrl);

  options.method = req.method;
  options.headers = req.headers;
  options.host = '127.0.0.1';
  options.port = port;
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

function response(req, res, statusCode, msg) {
  req.on('data', util.noop);
  req.on('end', () => {
    res.writeHead(statusCode || 501, {
      'content-type': 'text/plain charset=utf-8',
    });
    res.end(msg);
  });
}

module.exports = function (server, options) {
  RULE_VALUE_HEADER = options.RULE_VALUE_HEADER;
  server.on('request', (req, res) => {
    req.on('error', util.noop);
    res.on('error', util.noop);

    const ruleValue = decodeURIComponent(req.headers[RULE_VALUE_HEADER]);
    const {
      root,
      delimiter,
      seperator,
    } = util.parseRuleValue(ruleValue);

    if (!root) {
      return response(req, res, 500, 'Not found root directory.');
    }

    fs.stat(root, (err, stats) => {
      if (err || !stats.isDirectory()) {
        return response(req, res, 500, (err && err.message) || (`${root} is not a directory.`));
      }

      if (p.exists({
        script: START_COMBO,
        value: root,
      })) {
        if (cache[root] && cache[root].data && cache[root].data.port) {
          return transferRequest(req, res, {
            delimiter,
            seperator,
            port: cache[root].data.port,
          });
        }
        return response(req, res, 500, 'Opps!!');
      }

      p.fork({
        script: START_COMBO,
        value: root,
        root,
      }, (e, data, child) => { // eslint-disable-line no-unused-vars
        if (e) {
          return response(req, res, 500, err);
        }
        cache[root] = {
          child,
          data,
        };

        transferRequest(req, res, {
          delimiter,
          seperator,
          port: data.port,
        });
      });
    });
  });
};
