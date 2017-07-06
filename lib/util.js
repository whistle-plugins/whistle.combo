const net = require('net');

let curPort = 20000;

function getPort(callback) {
  let port = ++curPort;
  let server = net.createServer();

  server.on('error', () => {
    getPort(callback);
  }).listen(port, () => {
    server.close(() => {
      callback(port);
    });
  });
}

function getFreshPort() {
  return new Promise((resolve) => {
    getPort((port) => {
      resolve(port);
    });
  });
}

function parseRuleValue(value) {
  // value is a string like `??:,@/Users/jiewei.ljw/work/test`
  const mathces = value.match(/(([^:]*)?:([^@]*)?@)?(.*)/);

  return {
    delimiter: mathces[2] || '??',
    seperator: mathces[3] || ',',
    root: mathces[4] && mathces[4].replace(/\\/g, '/').replace(/\/$/, ''),
  };
}

module.exports = {
  getFreshPort,
  parseRuleValue,
  noop: () => {},
};
