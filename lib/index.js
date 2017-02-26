const fs = require('fs');
const path = require('path');
const p = require('pfork');
const url = require('url');
const http = require('http');

const START_COMBO = path.join(__dirname, 'start-combo');
let RULE_VALUE_HEADER;

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

function parseRuleValue(value) {
  // value is like ??:,@/Users/jiewei.ljw/work/test
  const mathces = value.match(/(([^:]*)?:([^@])*?@)?(.*)/);

  return {
    delimiter: mathces[2],
    seperator: mathces[3],
    root: mathces[4] ? mathces[4].replace(/\\/g, '/').replace(/\/$/, '') : '',
  };
}

module.exports = function (server, options) {
  RULE_VALUE_HEADER = options.RULE_VALUE_HEADER;

  server.on('request', (req, res) => {
    req.on('error', noop);
    res.on('error', noop);

    const ruleValue = decodeURIComponent(req.headers[RULE_VALUE_HEADER]);
    const {
      root,
      delimiter,
      seperator,
    } = parseRuleValue(ruleValue);

    if (!root) {
      return response(req, res, 500, 'Not found root directory.');
    }

    fs.stat(root, (err, stats) => {
      if (err || !stats.isDirectory()) {
        return response(req, res, 500, (err && err.message) || (`${root} is not a directory.`));
      }
      p.fork({
        script: START_COMBO,
        value: ruleValue,
        hostname: req.headers.host,
        root,
        delimiter,
        seperator,
      }, (e, data, child) => { // eslint-disable-line no-unused-vars
        if (e) {
          return response(req, res, 500, err);
        }
        transformRequest(req, res, data);
      });
    });
  });
};

// (function test() {
//   [
//     '/Users/jiewei.ljw/work/wwwwww/test',
//     'c/=:,@/Users/jiewei.ljw/work/wwwwww/test',
//   ].forEach((v) => {
//     console.log(parseRuleValue(v));
//   });
// }());
