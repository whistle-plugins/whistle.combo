const Q = require('q');
const net = require('net');

const MAX_PORT = 60000;

function getPort() {
  const deferred = Q.defer();
  let curPort = 30000;

  function _getPort(callback) {
    let port = curPort++;
    let server = net.createServer();
    if (curPort > MAX_PORT) {
      curPort = 40000;
    }
    server.on('error', () => {
      _getPort(callback);
    }).listen(port, () => {
      server.close(() => {
        callback(port);
      });
    });
  }

  _getPort((port) => {
    deferred.resolve(port);
  });

  return deferred.promise;
}

module.exports = {
  getPort,
  noop: () => {},
};
